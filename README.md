# LinkedIn Buddy

LinkedIn Buddy is a Chrome extension designed to enhance your LinkedIn experience by helping you manage and generate professional connection messages easily.

## Tech Stack

![Chrome](https://img.shields.io/badge/-Chrome-4285F4?logo=google-chrome&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![OpenAI](https://img.shields.io/badge/-OpenAI-412991?logo=openai&logoColor=white)

## Features

- **Save LinkedIn profiles:** Quick access to saved profiles.
- **Generate professional connection messages:** Uses OpenAI to generate customized messages.
- **Add and manage notes:** Save notes for each LinkedIn profile.
- **Dark mode support:** Enjoy a seamless experience in dark mode.

## Installation

### Chrome Web Store

1. Go to the [Chrome Web Store](https://chromewebstore.google.com/detail/linkedin-buddy/olcmcenphilegegccbbcjmjjbinbdkac).
2. Click "Add to Chrome" to install the extension.

### Manual Installation

1. Download the latest release from the [Releases](#) page (Link to be added).
2. Unzip the downloaded file.
3. Go to `chrome://extensions/` in your Chrome browser.
4. Enable "Developer mode" in the top right corner.
5. Click "Load unpacked" and select the unzipped folder.

## Usage

1. After installing the extension, click the LinkedIn Buddy icon in the Chrome toolbar.
2. Open a LinkedIn profile and click "Save current profile" to add it to your saved profiles.
3. Go to the extension popup to view and manage your saved profiles.
4. Click "Generate message" to create a professional connection message. Make sure you have set your API key in the settings.

## Settings

1. Click on the "Settings" button in the extension popup.
2. Add your name, description, and OpenAI API key for better results.

## Development

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.
- Install [Vite](https://vitejs.dev/) for building the project.

### Setup

1. Clone the repository: `git clone https://github.com/mohamed-esoliman/linkedin-buddy.git`
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load the `dist` folder as an unpacked extension in Chrome.

## Contributing

Feel free to submit issues or pull requests. We appreciate your help!

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
