import type { Browser } from 'puppeteer'
import { launch } from 'puppeteer'

let browser: Browser | null = null

export async function useBrowser() {
  if (!browser) {
    browser = await launch({
      headless: 'new',
    })
  }

  return browser
}
