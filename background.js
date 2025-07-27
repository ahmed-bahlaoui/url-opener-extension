// --- THIS IS THE LINE TO MODIFY ---
// Change this URL to whatever you want the window to open.
const TARGET_URL = "https://roadmap.sh"; // Example URL

/**
 * Listener for when the user clicks the extension's toolbar icon.
 */
chrome.action.onClicked.addListener(async (tab) => {
  // Retrieve the saved URL from chrome.storage.
  // Provide a default value in case the user hasn't set one yet.
  chrome.storage.sync.get({ customUrl: "https://www.google.com" }, (items) => {
    // The logic to create the window must be INSIDE the callback,
    // because .get() is asynchronous.
    chrome.tabs.create({
      url: items.customUrl,
      active: true,
    });
  });
});
