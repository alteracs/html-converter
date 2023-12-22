export default eventHandler(async () => {
  const browser = await useBrowser()
  const pages = await browser.pages()

  return {
    browser: {
      pageOpened: pages.length,
    },
  }
})
