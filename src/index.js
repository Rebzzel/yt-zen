const SHARED_TWEAKS = [
  "tweaks/disable-mini-guide-renderer.css",
  "tweaks/disable-videos-column.css",
]
const HOME_PAGE_TWEAKS = [
  "tweaks/disable-video-browser.css",
  "tweaks/disable-shorts-browser.css",
]

function verifyTab(tab) {
  return tab.url.startsWith("https://www.youtube.com")
}

function isHomePageURL(url) {
  return url === "https://www.youtube.com/"
}

async function handleTabUpdate(tab) {
  if (!verifyTab(tab)) return

  const target = { tabId: tab.id }
  const insertCSS = (options) =>
    chrome.scripting.insertCSS({ ...options, target })
  const removeCSS = (options) =>
    chrome.scripting.removeCSS({ ...options, target })

  await insertCSS({ files: SHARED_TWEAKS })

  if (isHomePageURL(tab.url)) {
    await insertCSS({ files: HOME_PAGE_TWEAKS })
  } else {
    await removeCSS({ files: HOME_PAGE_TWEAKS })
  }
}

chrome.tabs.onUpdated.addListener(
  (_0, _1, tab) => handleTabUpdate(tab),
)
