# Quick Window Opener 🚀

![Getting Started](./images/demo.png)
A highly configurable Chrome extension to instantly open your favorite or most-used websites in a new, clean window with a single click.

## Features

- **One-Click Access:** Opens a specified URL in a new, focused popup window, free from the clutter of your main browser tabs.
- **Visual Options Page:** A clean, card-based grid lets you easily see and select your target website.
- **Pre-configured Defaults:** Comes with a set of popular websites like GitHub, Wikipedia, and Stack Overflow to get you started immediately.
- **Fully User-Configurable:** Don't see your favorite site? Use the '+' button to add any custom website with its own title, URL, icon, and description.
- **Persistent & Synced Storage:** Your selections and custom-added websites are saved using `chrome.storage.sync`, meaning your configuration is automatically synced across all your devices where you're logged into Chrome.
- **Modern UI:** Built with a responsive grid layout and a clean modal form for a smooth user experience.

## Installation

Since this extension is not on the Chrome Web Store, you can load it directly from the source code.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ahmed-bahlaoui/url-opener-extension.git
    ```
2.  **Open Chrome Extensions:** Navigate to `chrome://extensions` in your Chrome browser.
3.  **Enable Developer Mode:** In the top-right corner, toggle the "Developer mode" switch on.
4.  **Load the Extension:** Click the "Load unpacked" button that appears on the top-left.
5.  **Select the Folder:** In the file dialog, navigate to and select the `url-opener-extension` folder that you just cloned.

The extension icon should now appear in your Chrome toolbar. You may need to click the puzzle piece icon to pin it.

## How to Use

### Selecting a Website

1.  Right-click the extension icon in your toolbar and select "Options".
2.  On the options page, simply click on the card of the website you want to set as your target. The selected card will be highlighted with a blue border.
3.  That's it! Now, when you left-click the extension icon, it will open your selected website.

### Adding a Custom Website

1.  On the options page, click the blue `+` button in the bottom-right corner.
2.  A form will appear. Fill in the details for your custom site:
    - **Title:** The name that will appear on the card.
    - **Full URL:** The complete web address (e.g., `https://youtube.com`).
    - **URL to an icon image:** Find a URL for the site's icon (you can often get this by right-clicking the icon in a browser tab and selecting "Copy Image Address").
    - **Short Description:** A brief summary for the card.
3.  Click "Save". Your new website will be added to the grid and will be available for selection.

## Technology Stack

- **HTML5**
- **CSS3** (Flexbox, Grid)
- **Vanilla JavaScript (ES6+)**
- **Chrome Extension API (Manifest V3)**

## Future Roadmap

- [ ] Ability to **delete** custom-added websites.
- [ ] Functionality to **edit** an existing custom website.
- [ ] Drag-and-drop reordering of cards.
- [ ] Add a keyboard shortcut to trigger the extension.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
