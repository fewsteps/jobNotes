# Installation & Deployment Guide

This guide walks you through setting up **KB Studio (jobNotes)** locally and deploying it to **GitHub Pages** or **Cloudflare Pages**.

---

## Table of Contents

1. [Prerequisites & Browser Requirements](#1-prerequisites--browser-requirements)
2. [Local Setup](#2-local-setup)
3. [Deploying to GitHub Pages](#3-deploying-to-github-pages)
4. [Deploying to Cloudflare Pages](#4-deploying-to-cloudflare-pages)
   - [Method 1: Direct CLI Deploy (Wrangler)](#method-1-direct-cli-deploy-wrangler)
   - [Method 2: Git Integration (Cloudflare Dashboard)](#method-2-git-integration-cloudflare-dashboard)
5. [Browser Compatibility & Troubleshooting](#5-browser-compatibility--troubleshooting)
6. [Quick Reference Commands](#6-quick-reference-commands)

---

## 1. Prerequisites & Browser Requirements

### System Requirements
- **Node.js** (v18 or higher recommended) and **npm** installed.
- **Git** installed and authenticated with your GitHub account.

### Browser Requirement (Crucial)
KB Studio is a local-first application that reads and writes Markdown files on your computer using the **File System Access API**.
- **Supported out of the box:** Google Chrome (v86+), Microsoft Edge (v86+).
- **Brave Browser:** Requires enabling `brave://flags/#file-system-access-api` (see [Troubleshooting](#5-browser-compatibility--troubleshooting)).
- **HTTPS or Localhost is required:** The File System Access API will only operate in a **Secure Context** (`https://`, `http://localhost`, or `file://`).

---

## 2. Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/fewsteps/jobNotes.git
cd jobNotes
```

### Step 2: Install Dependencies
Install development tools (Wrangler CLI for Cloudflare deployments):
```bash
npm install
```

### Single-File Structure & Always-Mapped `notes/` Folder
The entire app lives in **`index.html`** with an always-mapped **`notes/`** folder:
- **`notes/` Folder:** Saved in both GitHub (committed to repo) and Cloudflare (`dist/notes/`). These markdown notes (`README.md`, `daily-notes/`, `solutions/`, `templates/`) are always visible in the explorer sidebar.
- **Local Configured Folder:** When you select your local folder, it appears right alongside the `notes/` folder in the sidebar.
- **GitHub Pages:** Directly serves `index.html` and `notes/` from the root whenever you commit & push.
- **Cloudflare Pages:** Deploys via `npm run deploy` (automatically bundles `index.html` and copies `notes/` to `dist/`).

### Step 3: Run Locally (Testing)
You can run the app locally using any static web server:
```bash
# Using npx serve:
npx serve .

# Or using Python:
python3 -m http.server 8080
```
Open your browser at `http://localhost:3000` (or `http://localhost:8080`).

---

## 3. Deploying to GitHub Pages

GitHub Pages serves static files directly from your repository over HTTPS.

### Option A: Deploy from Branch (Recommended & Quickest)

Because `index.html` is already present in the root directory:

1. Push your latest changes to GitHub:
   ```bash
   git add .
   git commit -m "Update site"
   git push origin main
   ```
2. Open your repository on GitHub:
   `https://github.com/fewsteps/jobNotes`
3. Go to **Settings** &rarr; **Pages** (under the "Code and automation" sidebar section).
4. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`.
   - **Branch:** Select `main` and folder `/ (root)`.
   - Click **Save**.
5. After 1–2 minutes, your site will be live at:
   ```text
   https://fewsteps.github.io/jobNotes/
   ```

Every time you edit `index.html` and commit/push to `main`, GitHub Pages automatically updates!

---

## 4. Deploying to Cloudflare Pages

Cloudflare Pages offers fast worldwide CDN hosting, automatic HTTPS, and preview deployments.

### Method 1: Direct CLI Deploy (Wrangler)

The repository comes pre-configured with deploy scripts in `package.json` pointing to project `fewstepsonline`.

#### 1. One-time Authentication
Log in to your Cloudflare account from your terminal:
```bash
npx wrangler login
```
Verify your login:
```bash
npm run whoami
```

#### 2. Deploy to Production
Run the deploy command (this automatically builds to `dist/` first, then uploads):
```bash
npm run deploy
```
*(If you want to deploy to a different Cloudflare project name, edit `--project-name <your-project>` in `package.json`)*.

#### 3. Deploy a Preview Branch
To test without affecting production:
```bash
npm run deploy:preview
```

---

### Method 2: Git Integration (Cloudflare Dashboard)

If you prefer Cloudflare to automatically rebuild and deploy on every `git push`:

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select your GitHub account and pick the `jobNotes` repository.
4. Configure your build settings:
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
5. Click **Save and Deploy**.

Cloudflare will automatically build and deploy every time you push commits to `main`.

---

## 5. Browser Compatibility & Troubleshooting

### Error: "Browser Not Supported" (File System Access API)

If you see this screen:
```text
🚫 Browser Not Supported
KB Studio requires the File System Access API...
```

#### If using Brave:
Brave disables this API by default for privacy reasons. Enable it:
1. In Brave, go to: `brave://flags/#file-system-access-api`
2. Change the dropdown setting to **Enabled**.
3. Click **Relaunch** at the bottom of the screen.
4. Refresh your KB Studio tab.

#### If using Firefox or Safari:
Firefox and Safari do not implement Chromium's File System Access API. Use **Google Chrome** or **Microsoft Edge**.

#### Insecure Context (HTTP):
If hosting on a custom domain, ensure HTTPS is active. Browsers block the File System Access API on plain non-localhost `http://`.

---

## 6. Quick Reference Commands

| Command | Action |
|---|---|
| `npm run build` | Copies `index.html` &rarr; `dist/index.html` (for Cloudflare) |
| `npm run deploy` | Builds and deploys production build to Cloudflare Pages |
| `npm run deploy:preview` | Builds and deploys preview branch to Cloudflare Pages |
| `npx wrangler login` | Authenticates your local CLI with Cloudflare |
| `npm run whoami` | Checks active Cloudflare credentials |
| `git push origin main` | Pushes changes to trigger GitHub Pages update |

