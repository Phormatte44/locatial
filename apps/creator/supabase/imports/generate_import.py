#!/usr/bin/env python3
"""
Webflow -> Supabase import generator for LOCATIAL.

Fetches the locatial.io Webflow `Locations` collection (Data API v2) and emits a
single idempotent SQL file: one `do $$ ... $$` block per `collection` group,
each producing one published/draft Story with borough/locality Sections and one
Chapter per Location. Output style matches the hand-built pilot
(`best-music-venues-nyc.sql`) so the two are interchangeable.

Usage:
    WEBFLOW_TOKEN=xxxx python3 generate_import.py > all-guides.sql

    # only specific collections (repeatable), draft instead of published, flat sections:
    WEBFLOW_TOKEN=xxxx python3 generate_import.py \
        --only "Best Music Venues in NYC" --only "7 Wonders" \
        --status draft --flat-sections > some-guides.sql

    # offline: read pre-fetched items instead of hitting the API
    python3 generate_import.py --from-json /tmp/loc_0.json /tmp/loc_100.json /tmp/loc_200.json > all.sql

Run the resulting SQL in the Supabase SQL editor (runs as postgres, bypasses RLS).
Each block deletes its slug first, so re-running is safe.
"""
import argparse
import json
import os
import sys
import urllib.request
from collections import OrderedDict

SITE_ID = "64ea1f05f055c6958cd93dd0"
LOCATIONS_COLLECTION = "66019a8c5f7df86379232825"
OWNER_EMAIL = "michael.o.mccann@gmail.com"

# Editorial / non-place collections to skip by default (not true place-guides).
DEFAULT_EXCLUDE = {"MM PhotoGeornal", "News Room", "Cocaine Chronicles", "Radar"}

# Webflow field slugs we read. Each tuple = candidate slugs (first that exists wins),
# tolerating the hyphen variants Webflow generates ("card----title" etc.).
FIELDS = {
    "name":      ["location", "name"],
    "headline":  ["card----title", "card-title", "card_title"],
    "body":      ["card----body", "card-body", "card_body"],
    "image":     ["picture"],
    "place":     ["address"],
    "lon":       ["longitude"],
    "lat":       ["latitude"],
    "zoom":      ["zoom"],
    "pitch":     ["pitch"],
    "bearing":   ["bearing"],
    "collection":["collection"],
}

DEFAULT_CAMERA = {"zoom": 13.0, "pitch": 60.0, "bearing": -10.0}


def api_get(path, token):
    req = urllib.request.Request(
        "https://api.webflow.com" + path,
        headers={"Authorization": "Bearer " + token, "accept": "application/json"},
    )
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def fetch_all_items(token):
    items, offset = [], 0
    while True:
        page = api_get(
            f"/v2/collections/{LOCATIONS_COLLECTION}/items?limit=100&offset={offset}",
            token,
        )
        batch = page.get("items", [])
        items.extend(batch)
        total = page.get("pagination", {}).get("total", len(items))
        offset += 100
        if offset >= total or not batch:
            break
    return items


def field(data, key):
    """Read a logical field from a Webflow item's fieldData using candidate slugs."""
    for slug in FIELDS[key]:
        if slug in data and data[slug] not in (None, ""):
            return data[slug]
    return None


def img_url(val):
    if isinstance(val, dict):
        return val.get("url")
    return val


def slugify(text):
    out = []
    for ch in text.lower():
        if ch.isalnum():
            out.append(ch)
        elif ch in " -_/":
            out.append("-")
    s = "".join(out)
    while "--" in s:
        s = s.replace("--", "-")
    return s.strip("-")


def section_for(place_name, flat):
    """Derive a section from the address: the segment after the last comma
    (borough / country). Flat mode -> single 'All' section."""
    if flat or not place_name:
        return "All"
    return place_name.split(",")[-1].strip() or "All"


def q(text):
    """Escape a SQL string literal body (double the single quotes)."""
    if text is None:
        return ""
    return str(text).replace("'", "''")


def num(val, default=None):
    try:
        return float(val)
    except (TypeError, ValueError):
        return default


def build_blocks(items, only, exclude, status, flat):
    # group items by their `collection` value
    groups = OrderedDict()
    for it in items:
        data = it.get("fieldData", it)
        coll = field(data, "collection")
        if not coll:
            continue  # skip ungrouped items
        # NOTE: most collections are map-pins with no card----title/body — we keep them
        # (a chapter only needs a name + coordinates; headline/body are optional).
        if only and coll not in only:
            continue
        if coll in exclude:
            continue
        groups.setdefault(coll, []).append(data)

    blocks = []
    for coll, rows in groups.items():
        blocks.append(build_story_block(coll, rows, status, flat))
    return groups, blocks


def build_story_block(coll, rows, status, flat):
    slug = slugify(coll)
    published_at = "now()" if status == "published" else "null"

    # assign sections in first-seen order, chapters in global reading order 1..N
    sections = OrderedDict()  # name -> var index
    chapter_lines = []
    pos = 0
    for data in rows:
        name = field(data, "name") or field(data, "headline")
        lon = num(field(data, "lon"))
        lat = num(field(data, "lat"))
        if not name or lon is None or lat is None:
            continue  # need a name + coords to be a map chapter
        if (field(data, "place") or "").strip().lower() == "about...":
            continue  # skip "A PlayceList Guide" cover/intro cards
        pos += 1
        sec_name = section_for(field(data, "place"), flat)
        if sec_name not in sections:
            sections[sec_name] = len(sections)
        sec_var = f"v_sec{sections[sec_name]}"

        cam = {
            "zoom": num(field(data, "zoom"), DEFAULT_CAMERA["zoom"]),
            "pitch": num(field(data, "pitch"), DEFAULT_CAMERA["pitch"]),
            "bearing": num(field(data, "bearing"), DEFAULT_CAMERA["bearing"]),
        }
        image = img_url(field(data, "image"))
        image_sql = f"'{q(image)}'" if image else "null"
        place = field(data, "place")
        place_sql = f"'{q(place)}'" if place else "null"

        chapter_lines.append(
            "  insert into public.chapters(story_id,section_id,position,name,headline,body,"
            "tags,image_url,place_name,longitude,latitude,camera) values (\n"
            f"    v_story,{sec_var},{pos},'{q(name)}','{q(field(data,'headline'))}','{q(field(data,'body'))}',\n"
            f"    array['{q(coll)}']::text[],{image_sql},{place_sql},{lon},{lat},"
            f"jsonb_build_object('zoom',{cam['zoom']},'pitch',{cam['pitch']},'bearing',{cam['bearing']}));"
        )

    if not chapter_lines:
        return None

    decls = "".join(f"  {f'v_sec{i}'} uuid;\n" for i in range(len(sections)))
    sec_inserts = "".join(
        f"  insert into public.sections(story_id,name,position) values "
        f"(v_story,'{q(sec_name)}',{i}) returning id into v_sec{i};\n"
        for sec_name, i in sections.items()
    )

    return (
        f"-- {coll}  ({len(chapter_lines)} chapters, {len(sections)} sections)\n"
        "do $$\n"
        "declare v_story uuid; v_owner uuid;\n"
        f"{decls}"
        "begin\n"
        f"  select id into v_owner from auth.users where email='{OWNER_EMAIL}' limit 1;\n"
        f"  delete from public.stories where slug='{slug}';\n"
        "  insert into public.stories(title,slug,status,published_at,owner_id)\n"
        f"  values ('{q(coll)}','{slug}','{status}',{published_at},v_owner) returning id into v_story;\n"
        f"{sec_inserts}"
        + "\n".join(chapter_lines)
        + "\nend $$;\n"
    )


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--only", action="append", default=[],
                    help="collection name to include (repeatable); default = all but excluded")
    ap.add_argument("--exclude", action="append", default=None,
                    help="collection name to exclude (repeatable); default = editorial set")
    ap.add_argument("--status", choices=["published", "draft"], default="published")
    ap.add_argument("--flat-sections", action="store_true",
                    help="one 'All' section per story instead of deriving from address")
    ap.add_argument("--from-json", nargs="+", default=None,
                    help="read items from local JSON file(s) instead of the Webflow API")
    args = ap.parse_args()

    only = set(args.only)
    exclude = set(args.exclude) if args.exclude is not None else set(DEFAULT_EXCLUDE)
    if only:
        exclude = set()  # explicit include list overrides the default exclusions

    if args.from_json:
        items = []
        for path in args.from_json:
            with open(path) as f:
                doc = json.load(f)
            items.extend(doc.get("items", doc) if isinstance(doc, dict) else doc)
    else:
        token = os.environ.get("WEBFLOW_TOKEN")
        if not token:
            sys.exit("WEBFLOW_TOKEN not set (and --from-json not given). "
                     "Ask Michael to re-paste the read-only Webflow token.")
        items = fetch_all_items(token)

    groups, blocks = build_blocks(items, only, exclude, args.status, args.flat_sections)
    blocks = [b for b in blocks if b]

    print("-- Generated by generate_import.py — Webflow Locations -> LOCATIAL stories.")
    print("-- Run in Supabase SQL editor (postgres; bypasses RLS). Each block is re-runnable.")
    total_ch = 0
    for coll, rows in groups.items():
        sys.stderr.write(f"  {coll}: {len(rows)} items\n")
    print("\n".join(blocks))
    sys.stderr.write(f"\nWrote {len(blocks)} story blocks.\n")


if __name__ == "__main__":
    main()
