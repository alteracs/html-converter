export default defineNitroPlugin(async (nitroApp) => {
  const browser = await useBrowser()

  nitroApp.hooks.hookOnce('close', async () => {
    await browser.close()
  })
})
