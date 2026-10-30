# Install & Deploy Guide

## 1. Daily Usage (Adding or Editing Notes)

Put your `.md` files inside the **`notes/`** folder (you can create any subfolders inside `notes/`).

### Publish to GitHub Pages
Just commit and push — it updates automatically:
```bash
git add .
git commit -m "update notes"
git push
```
Live URL: `https://fewsteps.github.io/jobNotes/`

### Publish to Cloudflare Pages
Run one command:
```bash
npm run deploy
```

---

## 2. First-Time Setup (On a New Computer)

```bash
git clone https://github.com/fewsteps/jobNotes.git
cd jobNotes
npm install
```

**Cloudflare Login (One-Time Only):**
```bash
npx wrangler login
```

---

## 3. Brave Browser Tip (Optional — For Local Disk Folders)

Viewing and searching `notes/` works in **all browsers** automatically.  
If you use **Brave** and want to connect an extra local folder from your computer (`Select Local Folder` button):
1. Open `brave://flags/#file-system-access-api`
2. Set it to **Enabled** and click **Relaunch**.


/private/tmp/pdf_pages/all_vision.txt