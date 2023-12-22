import type { Browser } from 'puppeteer'
import { launch } from 'puppeteer'

let browser: Browser | null = null

export async function useBrowser(): Promise<Browser> {
  const { browserViewportWidth, browserViewportHeight, browserChromePath } = useRuntimeConfig()

  if (!browser) {
    browser = await launch({
      headless: 'new',

      ...(browserChromePath)
        ? {
            executablePath: browserChromePath,
          }
        : {},

      ...(browserViewportWidth && browserViewportHeight)
        ? {
            defaultViewport: {
              height: browserViewportHeight,
              width: browserViewportWidth,
            },
          }
        : {},
    })
  }

  return browser
}
