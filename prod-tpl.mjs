import { chromium } from 'playwright-core'
const b = await chromium.launch()
const ctx = await b.newContext()
const p = await ctx.newPage()
const errs = []
p.on('pageerror', e => errs.push('[pageerror] ' + String(e).slice(0, 150)))
p.setDefaultTimeout(25000)
await p.goto('https://webpress-ashy.vercel.app/signup')
await p.getByPlaceholder('Your name').fill('Prod Tpl')
await p.getByPlaceholder('Email').fill(`ptpl-${Date.now()}@webpress.test`)
await p.getByPlaceholder(/Password/).fill('test-password-123')
await p.getByRole('button', { name: 'Create account' }).click()
await p.waitForURL('**/projects**', { timeout: 40000 })
await p.getByRole('button', { name: 'New site' }).click()
await p.getByPlaceholder(/e\.g\. My Studio/).fill('Prod Agency')
await p.getByRole('button', { name: /Agency/ }).click()
await p.getByRole('button', { name: 'Create site' }).click()
await p.waitForURL('**/editor/**', { timeout: 40000 })
await p.waitForTimeout(4000)
await p.getByRole('button', { name: /Publish/ }).first().click()
await p.waitForTimeout(800)
await p.getByRole('button', { name: 'Start publish' }).click()
let url = null
for (let i = 0; i < 45; i++) {
  await p.waitForTimeout(1500)
  const body = await p.evaluate(() => document.body.innerText)
  const m = body.match(/\/p\/[A-Za-z0-9]+/)
  if (m) { url = m[0]; break }
}
console.log('PUBLIC URL:', url ? 'https://webpress-ashy.vercel.app' + url : 'NOT FOUND')
if (url) {
  await p.goto('https://webpress-ashy.vercel.app' + url)
  await p.waitForTimeout(3000)
  console.log('HOME TITLE:', await p.title())
  await p.getByRole('link', { name: /See our work/ }).first().click().catch(() => {})
  await p.waitForTimeout(3000)
  console.log('AFTER CLICK:', p.url())
  console.log('WORK TITLE:', await p.title())
}
console.log('PAGE ERRORS:', errs.length ? errs.slice(0, 3) : 'none')
await b.close()
