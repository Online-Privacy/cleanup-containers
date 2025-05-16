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
remove-containers/
├── manifest.json       # Extension config
├── popup.html          # Popup UI
├── popup.js            # Core logic
