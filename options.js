// 1. DATA SOURCE (Defaults)
const defaultWebsites = [
  {
    id: "github",
    title: "GitHub",
    description: "Code hosting and collaboration.",
    url: "https://github.com",
    icon: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  },
  {
    id: "wikipedia",
    title: "Wikipedia",
    description: "The Free Encyclopedia.",
    url: "https://www.wikipedia.org",
    icon: "https://www.wikipedia.org/static/favicon/wikipedia.ico",
  },
  // ... other default sites
];

// 2. DOM ELEMENT SELECTORS
const gridContainer = document.getElementById("grid-container");
const addNewButton = document.getElementById("add-new-button");
const modalOverlay = document.getElementById("modal-overlay");
const addSiteForm = document.getElementById("add-site-form");
const cancelButton = document.getElementById("cancel-button");

// 3. CORE FUNCTIONS
/**
 * Renders a combined list of default and user-defined websites.
 * @param {Array} sitesToRender The full list of website objects.
 * @param {string} selectedUrl The currently active URL to highlight.
 */
const renderCards = (sitesToRender, selectedUrl) => {
  gridContainer.innerHTML = ""; // Clear the grid before re-rendering

  sitesToRender.forEach((site) => {
    const card = document.createElement("div");
    card.classList.add("card");
    if (site.url === selectedUrl) {
      card.classList.add("selected");
    }
    card.dataset.url = site.url;

    card.innerHTML = `
      <img src="${site.icon}" alt="${site.title} icon" onerror="this.src='images/icon48.png';">
      <h3>${site.title}</h3>
      <p>${site.description}</p>
    `;

    card.addEventListener("click", () => {
      chrome.storage.sync.set({ customUrl: site.url });
      // Re-render to update the 'selected' state visually
      initialize();
    });

    gridContainer.appendChild(card);
  });
};

/**
 * Fetches all data and orchestrates the rendering of the page.
 */
const initialize = () => {
  // Fetch both userWebsites and the selected customUrl in parallel
  chrome.storage.sync.get(
    { userWebsites: [], customUrl: defaultWebsites[0].url },
    (data) => {
      const userSites = data.userWebsites;
      const selectedUrl = data.customUrl;
      const allSites = [...defaultWebsites, ...userSites];
      renderCards(allSites, selectedUrl);
    }
  );
};

// 4. MODAL AND FORM HANDLING
const openModal = () => modalOverlay.classList.remove("hidden");
const closeModal = () => modalOverlay.classList.add("hidden");

const handleFormSubmit = (event) => {
  event.preventDefault(); // Prevent the form from reloading the page

  const newSite = {
    // Use timestamp for a unique-enough ID for this use case
    id: `custom-${Date.now()}`,
    title: document.getElementById("new-title").value,
    url: document.getElementById("new-url").value,
    icon: document.getElementById("new-icon").value,
    description: document.getElementById("new-desc").value,
  };

  // 1. Get the current list of user websites.
  chrome.storage.sync.get({ userWebsites: [] }, (data) => {
    const updatedUserSites = [...data.userWebsites, newSite];

    // 2. Save the new, updated list back to storage.
    chrome.storage.sync.set({ userWebsites: updatedUserSites }, () => {
      // 3. Re-initialize the page to show the new card.
      initialize();
      closeModal();
      addSiteForm.reset(); // Clear the form fields
    });
  });
};

// 5. EVENT LISTENERS
addNewButton.addEventListener("click", openModal);
cancelButton.addEventListener("click", closeModal);
addSiteForm.addEventListener("submit", handleFormSubmit);
// Optional: Close modal if user clicks on the dark overlay
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", initialize);
