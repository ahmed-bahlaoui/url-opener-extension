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
    id: "roadmap",
    title: "Roadmap.sh",
    description:
      "Community driven roadmaps, articles and guides for developers to grow in their career.",
    url: "https://roadmap.sh",
    icon: "https://roadmap.sh/favicon.ico",
  },
  {
    id: "wikipedia",
    title: "Wikipedia",
    description: "The Free Encyclopedia.",
    url: "https://www.wikipedia.org",
    icon: "https://www.wikipedia.org/static/favicon/wikipedia.ico",
  },
  {
    id: "facebook",
    title: "Facebook",
    description: "Connect with friends and the world around you.",
    url: "https://www.facebook.com",
    icon: "https://www.facebook.com/favicon.ico",
  },
  {
    id: "twitter",
    title: "Twitter",
    description: "See what's happening in the world right now.",
    url: "https://x.com",
    icon: "https://abs.twimg.com/favicons/twitter.3.ico",
  },
  {
    id: "youtube",
    title: "YouTube",
    description: "Watch, upload, and share videos.",
    url: "https://www.youtube.com",
    icon: "https://www.youtube.com/s/desktop/ad18d4a4/img/logos/favicon_96x96.png",
  },
];

// 2. DOM ELEMENT SELECTORS
const gridContainer = document.getElementById("grid-container");
const addNewButton = document.getElementById("add-new-button");
const modalOverlay = document.getElementById("modal-overlay");
const addSiteForm = document.getElementById("add-site-form");
const cancelButton = document.getElementById("cancel-button");

// 3. NEW: A variable to hold the element being dragged
let draggedItem = null;

// 4. CORE FUNCTIONS

const saveOrder = () => {
  const userSitesInOrder = [];
  const siteOrderIds = [];
  const cards = gridContainer.querySelectorAll(".card");

  // Rebuild the userWebsites array and track the complete order
  cards.forEach((card) => {
    const siteId = card.dataset.id;
    siteOrderIds.push(siteId);

    // Only save user sites to userWebsites array
    if (siteId.startsWith("custom-")) {
      userSitesInOrder.push({
        id: siteId,
        url: card.dataset.url,
        // We need to re-read the other properties from the card
        title: card.querySelector("h3").textContent,
        description: card.querySelector("p").textContent,
        icon: card.querySelector("img").src,
      });
    }
  });

  // Save both user websites and the complete site order
  chrome.storage.sync.set(
    {
      userWebsites: userSitesInOrder,
      siteOrder: siteOrderIds,
    },
    () => {
      console.log("New card order saved.");
    }
  );
};

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
    card.dataset.id = site.id;
    card.dataset.url = site.url;

    card.draggable = true;

    card.innerHTML = `
      <img src="${site.icon}" alt="${
      site.title
    } icon" onerror="this.src='images/icon48.png';">
      <h3>${site.title}</h3>
      <p>${site.description}</p>
      ${
        site.id.startsWith("custom-")
          ? `
        <div class="card-actions">
          <button class="edit-btn" title="Edit this site">Edit</button>
          <button class="delete-btn" title="Delete this site">Delete</button>
        </div>
      `
          : ""
      }
    `;

    card.addEventListener("click", (e) => {
      // Don't trigger card selection if clicking on action buttons
      if (
        e.target.classList.contains("edit-btn") ||
        e.target.classList.contains("delete-btn")
      ) {
        return;
      }
      chrome.storage.sync.set({ customUrl: site.url });
      // Re-render to update the 'selected' state visually
      initialize();
    });

    // Add event listeners for edit and delete buttons (only for custom sites)
    if (site.id.startsWith("custom-")) {
      const editBtn = card.querySelector(".edit-btn");
      const deleteBtn = card.querySelector(".delete-btn");

      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditModal(site);
      });

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteSite(site.id);
      });
    }
    // Drag and Drop Listeners
    card.addEventListener("dragstart", (e) => {
      draggedItem = e.target;
      setTimeout(() => e.target.classList.add("dragging"), 0);
    });

    card.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });

    card.addEventListener("dragover", (e) => {
      e.preventDefault(); // This is necessary to allow a drop
      const dragging = document.querySelector(".dragging");
      // Check if we are hovering over a different card
      if (e.target.closest(".card") !== dragging) {
        e.target.closest(".card").classList.add("drag-over");
      }
    });

    card.addEventListener("dragleave", (e) => {
      e.target.closest(".card").classList.remove("drag-over");
    });

    card.addEventListener("drop", (e) => {
      e.preventDefault();
      e.target.closest(".card").classList.remove("drag-over");
      // Don't do anything if dropping on itself
      if (e.target.closest(".card") !== draggedItem) {
        // Reorder the DOM elements
        gridContainer.insertBefore(draggedItem, e.target.closest(".card"));
        // Save the new order
        saveOrder();
      }
    });
    // Append the card to the grid container
    gridContainer.appendChild(card);
  });
};

/**
 * Fetches all data and orchestrates the rendering of the page.
 */
const initialize = () => {
  // Fetch userWebsites, customUrl, and siteOrder in parallel
  chrome.storage.sync.get(
    { userWebsites: [], customUrl: defaultWebsites[0].url, siteOrder: [] },
    (data) => {
      const userSites = data.userWebsites;
      const selectedUrl = data.customUrl;
      const savedOrder = data.siteOrder;

      // Create a map of all available sites
      const allSitesMap = new Map();

      // Add default sites to the map
      defaultWebsites.forEach((site) => {
        allSitesMap.set(site.id, site);
      });

      // Add user sites to the map
      userSites.forEach((site) => {
        allSitesMap.set(site.id, site);
      });

      let orderedSites;

      if (savedOrder.length > 0) {
        // Use saved order if available
        orderedSites = [];

        // First, add sites in the saved order
        savedOrder.forEach((siteId) => {
          if (allSitesMap.has(siteId)) {
            orderedSites.push(allSitesMap.get(siteId));
            allSitesMap.delete(siteId); // Remove from map to avoid duplicates
          }
        });

        // Add any remaining sites that weren't in the saved order (new default sites, etc.)
        allSitesMap.forEach((site) => {
          orderedSites.push(site);
        });
      } else {
        // Fall back to default order if no saved order exists
        orderedSites = [...defaultWebsites, ...userSites];
      }

      renderCards(orderedSites, selectedUrl);
    }
  );
};

// 4. MODAL AND FORM HANDLING
const openModal = () => modalOverlay.classList.remove("hidden");
const closeModal = () => modalOverlay.classList.add("hidden");

// Variable to track if we're editing an existing site
let editingSite = null;

const openEditModal = (site) => {
  editingSite = site;

  // Populate the form with existing site data
  document.getElementById("new-title").value = site.title;
  document.getElementById("new-url").value = site.url;
  document.getElementById("new-icon").value = site.icon;
  document.getElementById("new-desc").value = site.description;

  // Change modal title to indicate editing
  const modalTitle = document.querySelector("#modal-overlay h2");
  if (modalTitle) {
    modalTitle.textContent = "Edit Website";
  }

  openModal();
};

const deleteSite = (siteId) => {
  if (confirm("Are you sure you want to delete this website?")) {
    chrome.storage.sync.get({ userWebsites: [], siteOrder: [] }, (data) => {
      // Remove from userWebsites array
      const updatedUserSites = data.userWebsites.filter(
        (site) => site.id !== siteId
      );

      // Remove from siteOrder array
      const updatedSiteOrder = data.siteOrder.filter((id) => id !== siteId);

      // Save updated data
      chrome.storage.sync.set(
        {
          userWebsites: updatedUserSites,
          siteOrder: updatedSiteOrder,
        },
        () => {
          initialize(); // Refresh the display
        }
      );
    });
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault(); // Prevent the form from reloading the page

  const siteData = {
    title: document.getElementById("new-title").value,
    url: document.getElementById("new-url").value,
    icon: document.getElementById("new-icon").value,
    description: document.getElementById("new-desc").value,
  };

  if (editingSite) {
    // Editing existing site
    const updatedSite = {
      ...siteData,
      id: editingSite.id, // Keep the same ID
    };

    chrome.storage.sync.get({ userWebsites: [], siteOrder: [] }, (data) => {
      // Update the site in userWebsites array
      const updatedUserSites = data.userWebsites.map((site) =>
        site.id === editingSite.id ? updatedSite : site
      );

      chrome.storage.sync.set({ userWebsites: updatedUserSites }, () => {
        editingSite = null; // Reset editing state

        // Reset modal title
        const modalTitle = document.querySelector("#modal-overlay h2");
        if (modalTitle) {
          modalTitle.textContent = "Add New Website";
        }

        initialize();
        closeModal();
        addSiteForm.reset();
      });
    });
  } else {
    // Adding new site
    const newSite = {
      ...siteData,
      id: `custom-${Date.now()}`, // Generate new ID
    };

    chrome.storage.sync.get({ userWebsites: [], siteOrder: [] }, (data) => {
      const updatedUserSites = [...data.userWebsites, newSite];
      const updatedSiteOrder = [...data.siteOrder, newSite.id];

      chrome.storage.sync.set(
        {
          userWebsites: updatedUserSites,
          siteOrder: updatedSiteOrder,
        },
        () => {
          initialize();
          closeModal();
          addSiteForm.reset();
        }
      );
    });
  }
};

// 5. EVENT LISTENERS
addNewButton.addEventListener("click", () => {
  editingSite = null; // Reset editing state
  // Reset modal title
  const modalTitle = document.querySelector("#modal-overlay h2");
  if (modalTitle) {
    modalTitle.textContent = "Add New Website";
  }
  openModal();
});

cancelButton.addEventListener("click", () => {
  editingSite = null; // Reset editing state
  // Reset modal title
  const modalTitle = document.querySelector("#modal-overlay h2");
  if (modalTitle) {
    modalTitle.textContent = "Add New Website";
  }
  closeModal();
});

addSiteForm.addEventListener("submit", handleFormSubmit);

// Optional: Close modal if user clicks on the dark overlay
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    editingSite = null; // Reset editing state
    // Reset modal title
    const modalTitle = document.querySelector("#modal-overlay h2");
    if (modalTitle) {
      modalTitle.textContent = "Add New Website";
    }
    closeModal();
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", initialize);
