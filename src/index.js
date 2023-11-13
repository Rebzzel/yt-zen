const ALL_TWEAKS = [
  "tweaks/disable-mini-guide-renderer.css",
  "tweaks/disable-shorts-browser.css",
  "tweaks/disable-videos-browser.css",
  "tweaks/disable-videos-column.css",
]
const [
  DISABLE_MINI_GUIDE_TWEAK,
  DISABLE_SHORTS_BROWSER_TWEAK,
  DISABLE_VIDEOS_BROWSER_TWEAK,
  DISABLE_VIDEOS_COLUMN_TWEAK,
] = ALL_TWEAKS

const tabsToPrevURLs = {}

chrome.tabs.onUpdated.addListener(async (_0, _1, tab) => {
  if (!verifyTabUpdate(tab)) return

  const target = { tabId: tab.id }
  const insertCSS = (options) =>
    chrome.scripting.insertCSS({ ...options, target })
  const removeCSS = (options) =>
    chrome.scripting.removeCSS({ ...options, target })

  // Tab may contain previous injected tweaks
  await removeCSS({ files: ALL_TWEAKS })

  const isHomePage = tab.url === "https://www.youtube.com/"

  await insertCSS({
    files: [
      DISABLE_MINI_GUIDE_TWEAK,
      DISABLE_VIDEOS_COLUMN_TWEAK,
      ...(isHomePage ? [
        DISABLE_SHORTS_BROWSER_TWEAK,
        DISABLE_VIDEOS_BROWSER_TWEAK,
      ] : [])
    ],
  })
})

function verifyTab(tab) {
  try {
    return tab.url.startsWith("https://www.youtube.com")
  } catch {
    return false
  }
}

function verifyTabUpdate(tab) {
  if (!verifyTab(tab)) {
    delete tabsToPrevURLs[tab.id]
    return false
  }

  const prevURL = tabsToPrevURLs[tab.id]
  tabsToPrevURLs[tab.id] = tab.url
  return prevURL !== tab.url
}
