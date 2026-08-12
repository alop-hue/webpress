import { chromium } from 'playwright-core'
const b = await chromium.launch()
const ctx = await b.newContext()
const p = await ctx.newPage()
const errs = []
p.on('pageerror', e => errs.push('[pageerror] ' + String(e).slice(0, 150)))
p.on('console', m => { if (m.type() === 'error') errs.push('[console] ' + m.text().slice(0, 150)) })
p.setDefaultTimeout(25000)
await p.goto('https://webpress-ashy.vercel.app/signup')
await p.getByPlaceholder('Your name').fill('Prod Tpl2')
await p.getByPlaceholder('Email').fill(`pt2-${Date.now()}@webpress.test`)
await p.getByPlaceholder(/Password/).fill('test-password-123')
await p.getByRole('button', { name: 'Create account' }).click()
await p.waitForURL('**/projects**', { timeout: 40000 })
await p.getByRole('button', { name: 'New site' }).click()
await p.getByPlaceholder(/e\.g\. My Studio/).fill('Prod Docs')
await p.getByRole('button', { name: /Documentation/ }).click()
await p.getByRole('button', { name: 'Create site' }).click()
await p.waitForURL('**/editor/**', { timeout: 40000 })
await p.waitForTimeout(4000)
// check editor loaded
const canvasOk = await p.evaluate(() => !!document.querySelector('iframe[title=Canvas]'))
console.log('CANVAS PRESENT:', canvasOk)
await p.getByRole('button', { name: /Publish/ }).first().click()
await p.waitForTimeout(1000)
const dlgText = await p.evaluate(() => document.body.innerText.slice(-400))
console.log('DIALOG:', JSON.stringify(dlgText.slice(0, 150)))
await p.getByRole('button', { name: 'Start publish' }).click()
// watch the dialog area for status changes
for (let i = 0; i < 30; i++) {
  await p.waitForTimeout(2000)
  const body = await p.evaluate(() => document.body.innerText)
  const m = body.match(/\/p\/[A-Za-z0-9]+/)
  if (m) { console.log('URL FOUND:', m[0]); break }
  if (i % 5 === 4) console.log('status at', (i+1)*2, 's:', JSON.stringify(body.match(/Building|Testing|Uploading|Deploying|Live|failed|error/gi)?.slice(0,3)))
}
console.log('PAGE ERRORS:', errs.length ? errs.slice(0, 4) : 'none')
await b.close()
