import { chromium } from 'playwright'

const base = process.argv[2] ?? 'http://localhost:5310'
const paths = ['/director', '/scene', '/']

for (const path of paths) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  try {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(3000)
    const text = await page.locator('body').innerText()
    console.log(`\n=== ${path} ===`)
    console.log('errors:', errors.length ? errors : 'none')
    console.log('body preview:', text.slice(0, 400).replace(/\n/g, ' | '))
  } catch (e) {
    console.log(`\n=== ${path} FAILED ===`, e.message)
  }
  await browser.close()
}
