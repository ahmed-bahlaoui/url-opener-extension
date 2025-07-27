/**
 * Saves the options to chrome.storage.
 */
const saveOptions = () => {
  const url = document.getElementById("url-input").value;

  // The chrome.storage.sync.set method saves an object.
  // We're saving the URL under the key 'customUrl'.
  chrome.storage.sync.set({ customUrl: url }, () => {
    // This is a callback function that runs after the save is complete.
    const status = document.getElementById("status-message");
    status.textContent = "Options saved.";
    // The message will disappear after 1 second.
    setTimeout(() => {
      status.textContent = "";
    }, 1000);
  });
};

/**
 * Restores the saved URL from chrome.storage and populates the input field.
 */
const restoreOptions = () => {
  // The chrome.storage.sync.get method retrieves one or more items.
  // We provide a key and a default value in case nothing is stored yet.
  chrome.storage.sync.get({ customUrl: "https://www.google.com" }, (items) => {
    // This callback receives an object 'items' with the retrieved data.
    document.getElementById("url-input").value = items.customUrl;
  });
};

// Add event listeners once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save-button").addEventListener("click", saveOptions);
