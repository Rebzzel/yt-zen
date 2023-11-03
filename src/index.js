function verifyTab(tab) {
  return tab.url.startsWith("https://www.youtube.com")
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!verifyTab(tab)) return

  const target = {
    tabId,
  }

  await chrome.scripting.insertCSS({
    files: ["index.css"],
    target,
  })

  if (tab.url === "https://www.youtube.com/") {
    await chrome.scripting.insertCSS({
      files: ["home-page.css"],
      target,
    })
  } else {
    await chrome.scripting.removeCSS({
      files: ["home-page.css"],
      target,
    })
  }
})
