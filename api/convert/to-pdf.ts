import { useValidatedBody, z } from 'h3-zod'

const validateRules = z.object({
  url: z.string().url().optional(),
  html: z.string().optional(),
  options: z.object({
    headers: z.record(z.string()).optional(),
    waitUntil: z.enum(['load', 'domcontentloaded']).optional(),
    landscape: z.boolean().optional(),
    format: z.enum(['letter', 'legal', 'tabloid', 'ledger', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6']).optional(),
  }),
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
  const { headers, waitUntil, ...pdfOptions } = options

  const browser = await useBrowser()
  const page = await browser.newPage()

  headers && await page.setExtraHTTPHeaders(headers)
  url && await page.goto(url, { waitUntil })
  html && await page.setContent(html, { waitUntil })

  const result = await page.pdf(pdfOptions)

  await page.close()

  return result
})
