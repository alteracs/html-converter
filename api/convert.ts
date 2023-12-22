import type { Buffer } from 'node:buffer'
import { useValidatedBody, z } from 'h3-zod'

const validateRules = z.object({
  from: z.enum(['url', 'html']),
  target: z.string(),
}).required().and(z.discriminatedUnion('to', [
  z.object({
    to: z.literal('image'),
    options: z.object({
      type: z.enum(['png', 'jpeg', 'webp']).optional(),
      quality: z.number().optional(),
      fullPage: z.boolean().optional(),
    }).optional(),
  }),
  z.object({
    to: z.literal('pdf'),
    options: z.object({
      landscape: z.boolean().optional(),
      format: z.enum(['letter', 'legal', 'tabloid', 'ledger', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6']).optional(),
    }).optional(),
  }),
]))

export default eventHandler(async (event) => {
  const {
    from,
    to,
    target,
    options,
  } = await useValidatedBody(event, validateRules)

  const browser = await useBrowser()
  const page = await browser.newPage()

  if (from === 'url') {
    await page.goto(target)
  } else if (from === 'html') {
    await page.setContent(target, { waitUntil: 'load' })
  }

  let result: Buffer

  if (to === 'image') {
    result = await page.screenshot(options)
  } else if (to === 'pdf') {
    result = await page.pdf(options)
  }

  await page.close()

  return result
})
