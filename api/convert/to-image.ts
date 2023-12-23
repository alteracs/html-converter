import { useValidatedBody, z } from 'h3-zod'

const validateRules = z.object({
  url: z.string().url().optional(),
  html: z.string().optional(),
  options: z.object({
    headers: z.record(z.string()).optional(),
    waitUntil: z.enum(['load', 'domcontentloaded']).optional(),
    type: z.enum(['png', 'jpeg', 'webp']).optional(),
    quality: z.number().optional(),
    fullPage: z.boolean().optional(),
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
  const { headers, waitUntil, ...imageOptions } = options

  const browser = await useBrowser()
  const page = await browser.newPage()

  headers && await page.setExtraHTTPHeaders(headers)
  url && await page.goto(url, { waitUntil })
  html && await page.setContent(html, { waitUntil })

  const result = await page.screenshot(imageOptions)

  await page.close()

  return result
})
