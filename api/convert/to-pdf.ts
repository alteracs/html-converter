import { useValidatedBody, z } from 'h3-zod'

const validateRules = z.object({
  url: z.string().url().optional(),
  html: z.string().optional(),
  options: z.object({
    landscape: z.boolean().optional(),
    format: z.enum(['letter', 'legal', 'tabloid', 'ledger', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6']).optional(),
  }).optional(),
}).superRefine(({ url, html }, ctx) => {
  if (!url && !html) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Required field is not filled in', params: ['url', 'html'] })
  }

  if (url && html) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'There should only be one field', params: ['url', 'html'] })
  }
})

export default eventHandler(async (event) => {
  const { url, html, options } = await useValidatedBody(event, validateRules)

  const browser = await useBrowser()
  const page = await browser.newPage()

  url && await page.goto(url)
  html && await page.setContent(html, { waitUntil: 'load' })

  const result = await page.pdf(options)

  await page.close()

  return result
})
