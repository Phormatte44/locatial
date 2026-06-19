#!/usr/bin/env python3
"""Run the full Webflow->Supabase import directly via the Supabase REST API using the
SERVICE-ROLE key (bypasses RLS). No SQL pasting required.

Reuses the field-mapping helpers from generate_import.py. For each `collection` group it:
  DELETE the story by slug (idempotent) -> POST story -> POST sections -> POST chapters.

Env:
  SERVICE_ROLE   (required) Supabase service_role secret
  SUPABASE_URL   (default https://snowiacdagibrxwhkzoi.supabase.co)
Args:
  --from-json f1 f2 ...   read items locally; else fetch live with WEBFLOW_TOKEN
  --status published|draft (default published)
  --flat-sections
  --exclude NAME (repeatable; default: none — i.e. include ALL collections)
"""
import argparse, json, os, sys, urllib.request, urllib.error
import generate_import as g

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://snowiacdagibrxwhkzoi.supabase.co")
SR = os.environ.get("SERVICE_ROLE")

def req(method, path, body=None, headers=None, base=None):
    url = (base or SUPABASE_URL) + path
    data = json.dumps(body).encode() if body is not None else None
    h = {"apikey": SR, "Authorization": "Bearer " + SR, "Content-Type": "application/json"}
    if headers: h.update(headers)
    r = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            raw = resp.read().decode()
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        sys.exit(f"{method} {path} -> {e.code}: {e.read().decode()[:300]}")

def find_owner_id(email):
    # Supabase Auth admin API (service role). Paginate a little.
    for page in range(1, 6):
        d = req("GET", f"/auth/v1/admin/users?per_page=200&page={page}", headers={"Content-Type": "application/json"})
        users = d.get("users", d if isinstance(d, list) else [])
        for u in users:
            if (u.get("email") or "").lower() == email.lower():
                return u["id"]
        if not users or len(users) < 200:
            break
    return None

def build_groups(items, exclude, flat):
    from collections import OrderedDict
    groups = OrderedDict()
    for it in items:
        data = it.get("fieldData", it)
        coll = g.field(data, "collection")
        if not coll or coll in exclude:
            continue
        groups.setdefault(coll, []).append(data)
    stories = []
    for coll, rows in groups.items():
        chapters, sections, pos = [], OrderedDict(), 0
        for data in rows:
            name = g.field(data, "name") or g.field(data, "headline")
            lon, lat = g.num(g.field(data, "lon")), g.num(g.field(data, "lat"))
            if not name or lon is None or lat is None:
                continue
            if (g.field(data, "place") or "").strip().lower() == "about...":
                continue
            pos += 1
            sec = g.section_for(g.field(data, "place"), flat)
            sections.setdefault(sec, len(sections))
            img = g.img_url(g.field(data, "image"))
            chapters.append({
                "section": sec, "position": pos,
                "name": name, "headline": g.field(data, "headline") or "",
                "body": g.field(data, "body") or "", "tags": [coll],
                "image_url": img, "place_name": g.field(data, "place"),
                "longitude": lon, "latitude": lat,
                "camera": {"zoom": g.num(g.field(data, "zoom"), g.DEFAULT_CAMERA["zoom"]),
                           "pitch": g.num(g.field(data, "pitch"), g.DEFAULT_CAMERA["pitch"]),
                           "bearing": g.num(g.field(data, "bearing"), g.DEFAULT_CAMERA["bearing"])},
            })
        if chapters:
            stories.append({"title": coll, "slug": g.slugify(coll),
                            "sections": list(sections.keys()), "chapters": chapters})
    return stories

def main():
    if not SR:
        sys.exit("SERVICE_ROLE not set.")
    ap = argparse.ArgumentParser()
    ap.add_argument("--from-json", nargs="+")
    ap.add_argument("--status", choices=["published", "draft"], default="published")
    ap.add_argument("--flat-sections", action="store_true")
    ap.add_argument("--exclude", action="append", default=[])
    a = ap.parse_args()

    if a.from_json:
        items = []
        for p in a.from_json:
            doc = json.load(open(p)); items += doc.get("items", doc) if isinstance(doc, dict) else doc
    else:
        items = g.fetch_all_items(os.environ["WEBFLOW_TOKEN"])

    owner = find_owner_id(g.OWNER_EMAIL)
    print(f"owner_id: {owner}")
    stories = build_groups(items, set(a.exclude), a.flat_sections)
    pub = "published_at"
    total = 0
    for st in stories:
        req("DELETE", f"/rest/v1/stories?slug=eq.{st['slug']}", headers={"Prefer": "return=minimal"})
        row = {"title": st["title"], "slug": st["slug"], "status": a.status, "owner_id": owner}
        row["published_at"] = "now()" if a.status == "published" else None
        # PostgREST: use an actual timestamp, not now()
        if a.status == "published":
            import datetime; row["published_at"] = datetime.datetime.utcnow().isoformat()+"Z"
        srow = req("POST", "/rest/v1/stories", [row], headers={"Prefer": "return=representation"})[0]
        sid = srow["id"]
        secmap = {}
        if st["sections"]:
            secrows = [{"story_id": sid, "name": n, "position": i} for i, n in enumerate(st["sections"])]
            created = req("POST", "/rest/v1/sections", secrows, headers={"Prefer": "return=representation"})
            secmap = {r["name"]: r["id"] for r in created}
        chs = [{"story_id": sid, "section_id": secmap.get(c["section"]), "position": c["position"],
                "name": c["name"], "headline": c["headline"], "body": c["body"], "tags": c["tags"],
                "image_url": c["image_url"], "place_name": c["place_name"],
                "longitude": c["longitude"], "latitude": c["latitude"], "camera": c["camera"]}
               for c in st["chapters"]]
        req("POST", "/rest/v1/chapters", chs, headers={"Prefer": "return=minimal"})
        total += len(chs)
        print(f"  ✓ {st['title']}  ({len(chs)} chapters, {len(st['sections'])} sections)")
    print(f"DONE: {len(stories)} stories, {total} chapters.")

if __name__ == "__main__":
    main()
