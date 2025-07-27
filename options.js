// 1. DATA SOURCE
// An array of objects, where each object represents a website card.
// This makes it easy to add or remove websites in the future.
const websites = [
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
  {
    id: "stackoverflow",
    title: "Stack Overflow",
    description: "Where developers learn and share.",
    url: "https://stackoverflow.com",
    icon: "https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico",
  },
  {
    id: "google",
    title: "Google",
    description: "The world's search engine.",
    url: "https://www.google.com",
    icon: "https://www.google.com/favicon.ico",
  },
  {
    id: "roadmap",
    title: "Roadmap.sh",
    description: "Your roadmap to learning.",
    url: "https://roadmap.sh",
    icon: "https://roadmap.sh/favicon.ico",
  },
  {
    id: "mdn",
    title: "MDN Web Docs",
    description: "Documentation for web developers.",
    url: "https://developer.mozilla.org",
    icon: "https://developer.mozilla.org/favicon.ico",
  },
  {
    id: "freecodecamp",
    title: "freeCodeCamp",
    description: "Learn to code for free.",
    url: "https://www.freecodecamp.org",
    icon: "https://global.discourse-cdn.com/freecodecamp/optimized/3X/2/0/206c254cf9e405bcddf6caea7f882dca146dcd3c_2_32x32.png",
  },
];

const gridContainer = document.getElementById("grid-container");

// 2. SAVE FUNCTION
/**
 * Saves the selected URL to chrome.storage.
 * @param {string} url The URL to save.
 */
const saveOption = (url) => {
  chrome.storage.sync.set({ customUrl: url }, () => {
    console.log(`URL saved: ${url}`);
  });
};

// 3. UI UPDATE FUNCTION
/**
 * Updates the UI to show which card is currently selected.
 * @param {string} selectedUrl The URL of the card to mark as selected.
 */
const updateSelectedCard = (selectedUrl) => {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    // The 'dataset' property is a way to read custom data attributes (data-*)
    if (card.dataset.url === selectedUrl) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
};

// 4. RENDER FUNCTION
/**
 * Renders the website cards into the grid container.
 */
const renderCards = () => {
  websites.forEach((site) => {
    const card = document.createElement("div");
    card.classList.add("card");
    // Store the URL in a data attribute for easy access later.
    card.dataset.url = site.url;

    card.innerHTML = `
      <img src="${site.icon}" alt="${site.title} icon">
      <h3>${site.title}</h3>
      <p>${site.description}</p>
    `;

    // Add a click listener to each card
    card.addEventListener("click", () => {
      saveOption(site.url);
      updateSelectedCard(site.url);
    });

    gridContainer.appendChild(card);
  });
};

// 5. INITIALIZATION
/**
 * Main function to set up the page.
 */
const initialize = () => {
  // First, build the UI by rendering all the cards.
  renderCards();

  // Then, retrieve the currently saved URL from storage.
  chrome.storage.sync.get({ customUrl: websites[0].url }, (items) => {
    // Finally, update the UI to highlight the saved card.
    updateSelectedCard(items.customUrl);
  });
};

// Run the initialization function once the DOM is ready.
document.addEventListener("DOMContentLoaded", initialize);
