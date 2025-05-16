# 🗑️ Remove Firefox Containers by Regex Pattern

A simple Firefox extension that allows you to delete containers (contextual identities) based on a regex pattern. Optionally, you can choose whether to remove containers that currently have open tabs.

---

## 🚀 Features

- Match container names using **regular expressions**
- Choose whether to remove containers with **open tabs**
- Clean, simple popup UI

---

## 📦 Installation (Temporary)

1. Clone or download this repo.  
2. Open Firefox and navigate to:  
   `about:debugging#/runtime/this-firefox`  
3. Click **"Load Temporary Add-on..."**  
4. Select the `manifest.json` file from this project folder.  
5. Click the extension icon in your toolbar to use it.

> 🔁 Note: Temporary add-ons are removed when Firefox restarts.

---

## 🧠 How It Works

1. Enter a **regex** pattern (e.g. `^tmp.*`, `work`, `^Session-[0-9]+$`).  
2. The extension will find all container names that match this pattern.  
3. By default, it only removes containers **without open tabs**.  
4. Enable the checkbox if you want to **also remove active containers**.

---

## 📂 File Structure

```bash
cleanup-containers/
├── package-lock.json
├── package.json
├── readme.md
├── src
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── removeContainers.js
└── tests
    ├── jest.setup.js
    └── removeContainers.test.js

## 🧪 Testing

This project uses **sinon-chrome** to mock the Firefox WebExtensions API in tests.

> Other libraries such as `jest-webextension-mock` or `webextensions-api-fake` do **not** fully support Firefox's `contextualIdentities` API, which is essential for container management.  
> Therefore, **sinon-chrome** was chosen for its flexibility, allowing us to explicitly mock `contextualIdentities` methods like `.query()` and `.remove()`.

### Running Tests

```bash
npm install
npm test
```

## 📜 Permissions (manifest.json)

The extension requires the following permissions to manage containers and tabs:
```
"permissions": [
  "contextualIdentities",
  "tabs",
  "storage"
]
```
- contextualIdentities: Access and manage Firefox containers.

- tabs: Query open tabs to detect active containers.

- storage: Save extension preferences or user input if needed.

🤝 Contributions

Feel free to open issues or pull requests!
