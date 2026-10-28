# KB Studio — Developer Documentation

> **Purpose:** Complete reference for understanding, modifying, and scaling `knowledge-base.html`.
> Written for the original author or any future developer who picks this up.

---


----

✍️ Edit password:
sk
👁 View password:
sk1

---
## Cloudflare Deployment
# One-time setup: login to Cloudflare
npx wrangler login
# Every time you want to deploy:
npm run deploy
---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Design Philosophy](#2-architecture--design-philosophy)
3. [File Structure — Single-File Anatomy](#3-file-structure--single-file-anatomy)
4. [CSS System — Design Tokens & Layout](#4-css-system--design-tokens--layout)
5. [HTML Structure — Element ID Reference](#5-html-structure--element-id-reference)
6. [JavaScript — Function Reference](#6-javascript--function-reference)
7. [Markdown Parser — How It Works](#7-markdown-parser--how-it-works)
8. [State Management](#8-state-management)
9. [Key Browser APIs Used](#9-key-browser-apis-used)
10. [Common Modifications Guide](#10-common-modifications-guide)
11. [Scaling Roadmap](#11-scaling-roadmap)
12. [Known Limitations](#12-known-limitations)
13. [Browser Compatibility](#13-browser-compatibility)

---

## 1. Project Overview

**KB Studio** (`knowledge-base.html`) is a zero-dependency, single HTML file that acts as a VS Code-like personal knowledge base. It runs directly in a browser with no server, no build tools, and no internet required.

### Core Capabilities

| Feature | How It Works |
|---|---|
| File system access | Browser's native File System Access API |
| Markdown rendering | Custom lightweight parser bundled inline |
| File/folder tree | Dynamically built DOM from directory handles |
| Tab management | In-memory `openFiles` object |
| Auto-save | `setInterval` every 30 seconds |
| Syntax highlighting | Regex token coloring inside the MD parser |

### What "Zero Dependency" Really Means

There are **no external requests** of any kind — no CDN, no npm, no Node.js.
The only prerequisites are a modern browser (Chrome/Edge 86+) and a local folder.

---

## 2. Architecture & Design Philosophy

### The Single-File Pattern

Everything lives in one `.html` file in this order:

```
knowledge-base.html
|
|-- <style>     All CSS (tokens + components + markdown styles)
|
|-- <body>      All HTML markup
|   |-- #app              CSS Grid root
|   |-- #titlebar
|   |-- #sidebar
|   |-- #main
|   |-- #statusbar
|   |-- #modal-overlay
|   |-- #ctx-menu
|   |-- #notifications
|   +-- #help-overlay
|
+-- <script>    Two blocks
    |-- Block 1: Markdown parser (self-contained IIFE)
    +-- Block 2: App logic (state + all functions)
```

### Why One File?

- **Portability** — copy one file, open in browser, done.
- **No build step** — no npm, no webpack, ever.
- **Works on locked-down Windows machines** — only needs Edge or Chrome, both pre-installed.
- **Easy to scale** — split into separate files when you add a build pipeline.

---

## 3. File Structure — Single-File Anatomy

```
knowledge-base.html  (~1135 lines, ~57 KB)
|
|-- Lines   1-7    DOCTYPE, meta tags, page title
|
|-- Lines   8-380  <style> block
|   |-- :root          CSS design tokens (all colors, sizes, fonts)
|   |-- Reset          box-sizing, scrollbar styles
|   |-- #app           CSS Grid layout (3 rows x 2 columns)
|   |-- #titlebar      Top bar styles
|   |-- #sidebar       Left panel + tree node styles
|   |-- #main          Tabs, toolbar, content area styles
|   |-- .md-body       Markdown preview rendered styles
|   |-- #statusbar     Bottom bar
|   +-- Modals, ctx menu, notifications, help overlay
|
|-- Lines 381-500  <body> HTML
|   |-- #titlebar      Logo, Open / Save / New buttons, path label
|   |-- #sidebar       Explorer header, search box, #filetree
|   |-- #main
|   |   |-- #tabs-bar
|   |   |-- #editor-toolbar   View mode toggles + formatting buttons
|   |   +-- #content-area
|   |       |-- #welcome-screen    (landing screen, no file open)
|   |       |-- #editor-pane       (the <textarea>)
|   |       +-- #preview-pane      (rendered Markdown)
|   |-- #statusbar
|   |-- #modal-overlay     Create file / folder dialog
|   |-- #ctx-menu          Right-click context menu
|   |-- #notifications     Toast container
|   +-- #help-overlay      Keyboard shortcut reference overlay
|
|-- Lines ~500-600  <script> Block 1: Markdown Parser
|   +-- window.mdParse(markdownString) -> htmlString
|
+-- Lines ~600-1135 <script> Block 2: App Logic
    |-- 4 global state variables
    |-- DOMContentLoaded init + auto-save timer
    |-- bindKeys()         All keyboard shortcuts
    |-- openFolder()       Folder picker entry point
    |-- renderTree()       Rebuilds file tree from disk
    |-- buildDir/Folder/FileItem()  Tree DOM builders
    |-- openFile / saveCurrentFile / autoSave
    |-- addTab / setActiveTab / closeTab / showWelcome
    |-- onInput()          Tracks unsaved changes
    |-- setViewMode / applyView / updatePreview
    |-- insertAtCursor / insertMd / insertMdLine / etc.
    |-- updateStatus / updateWordCount
    |-- createNewFile / createNewFolder / newFileIn / delItem
    |-- showCtx / hideCtx / ctx* actions
    |-- filterTree / refreshTree / collapseAll
    |-- showModal / closeModal / confirmModal
    |-- notify()
    |-- createDemo()
    +-- toggleHelp()
```

---

## 4. CSS System — Design Tokens & Layout

### All Design Tokens

All colors, sizes, and fonts live in `:root` at the top of `<style>`.
**To restyle the entire app, only edit these values — everything else uses `var()`.**

```css
:root {
  /* --- Backgrounds --- */
  --bg-dark:        #1e1e1e;   /* main editor area */
  --bg-sidebar:     #252526;   /* left panel */
  --bg-panel:       #2d2d2d;   /* toolbar, misc panels */
  --bg-editor:      #1e1e1e;   /* textarea background */
  --bg-tab:         #2d2d30;   /* inactive tab */
  --bg-tab-active:  #1e1e1e;   /* active tab */
  --bg-input:       #3c3c3c;   /* input fields */
  --bg-hover:       #2a2d2e;   /* tree row hover */
  --bg-selected:    #094771;   /* active file in tree */
  --bg-statusbar:   #007acc;   /* bottom blue status bar */
  --bg-titlebar:    #323233;   /* top title bar */
  --bg-button:      #0e639c;   /* primary buttons */
  --bg-button-hov:  #1177bb;   /* button hover */
  --bg-modal:       #252526;   /* dialog background */
  --bg-overlay:     rgba(0,0,0,0.6); /* modal backdrop */

  /* --- Text --- */
  --fg-primary:     #cccccc;   /* main text */
  --fg-secondary:   #969696;   /* muted labels, hints */
  --fg-muted:       #6d6d6d;   /* very faint placeholder text */
  --fg-link:        #9cdcfe;   /* hyperlinks in preview */
  --fg-heading:     #569cd6;   /* Markdown heading color */

  /* --- Code syntax token colors --- */
  --fg-string:      #ce9178;
  --fg-comment:     #6a9955;
  --fg-number:      #b5cea8;
  --fg-type:        #4ec9b0;
  --fg-function:    #dcdcaa;

  /* --- Layout dimensions --- */
  --sidebar-w:      260px;
  --titlebar-h:     35px;
  --tab-h:          35px;
  --statusbar-h:    22px;

  /* --- Typography --- */
  --font-ui:    'Segoe UI', system-ui, sans-serif;
  --font-mono:  'Cascadia Code', 'Consolas', monospace;

  /* --- Misc --- */
  --border:     #3e3e3e;
  --accent:     #007acc;
  --radius:     4px;
  --transition: 0.15s ease;
}
```

### Page Layout (CSS Grid)

```
+-----------------------------------+   35px  (--titlebar-h)
|            #titlebar              |
+----------+------------------------+   1fr   (remaining height)
| #sidebar |        #main           |
|  260px   |   flex column          |
| (--sidebar-w)                     |
+----------+------------------------+   22px  (--statusbar-h)
|            #statusbar             |
+-----------------------------------+
```

`#main` is a flex column:

```
#main
|-- #tabs-bar        35px fixed
|-- #editor-toolbar  32px fixed
+-- #content-area    flex: 1
    |-- #editor-pane   (flex: 1, or 50% in split mode)
    +-- #preview-pane  (flex: 1 in split/preview modes)
```

---

## 5. HTML Structure — Element ID Reference

### Key Element IDs

| ID | Role |
|---|---|
| `#app` | Root CSS Grid container |
| `#titlebar` | Top bar with logo + action buttons |
| `#sidebar` | Left panel |
| `#filetree` | File tree DOM injection point |
| `#search-box` | Filename filter input |
| `#main` | Right panel (flex column) |
| `#tabs-bar` | Tab strip container |
| `#editor-toolbar` | View toggles + Markdown format buttons |
| `#content-area` | Flex row holding editor + preview |
| `#welcome-screen` | Landing page shown before any file is open |
| `#editor-pane` | Wrapper div for the textarea |
| `#editor-textarea` | The actual text editor `<textarea>` |
| `#preview-pane` | Rendered Markdown output container |
| `#preview-body` | Inner `.md-body` div inside preview-pane |
| `#statusbar` | Bottom info bar |
| `#modal-overlay` | Full-screen dialog backdrop |
| `#modal-title` | Dialog `<h2>` title |
| `#modal-input` | Dialog text `<input>` |
| `#ctx-menu` | Right-click context menu |
| `#notifications` | Toast notification stack (bottom-right) |
| `#help-overlay` | Keyboard shortcut reference overlay |
| `#btn-edit` | "Edit" toolbar button |
| `#btn-split` | "Split" toolbar button |
| `#btn-preview` | "Preview" toolbar button |
| `#md-format-btns` | Group of Markdown formatting buttons |
| `#sb-branch` | Status bar: folder name |
| `#sb-file` | Status bar: active filename |
| `#sb-words` | Status bar: word count |
| `#sb-lines` | Status bar: line/column |
| `#tb-path-label` | Title bar: open folder name |

### Dynamic CSS Classes (Tree & Tabs)

These classes are added/removed by JavaScript at runtime:

| Class | Element | Meaning |
|---|---|---|
| `.tree-item` | div | Any row in the file tree |
| `.tree-item.folder` | div | A directory row |
| `.tree-item.file` | div | A file row |
| `.tree-item.active` | div | Currently open file (blue highlight) |
| `.tree-folder-children` | div | A folder's child container (hidden by default) |
| `.tree-folder-children.open` | div | Folder is expanded (children visible) |
| `.item-label` | span | Filename text in tree row |
| `.item-actions` | div | Hover-visible action buttons |
| `.item-action-btn` | button | Delete / new-file action button |
| `.tab` | div | An open-file tab |
| `.tab.active` | div | Currently visible tab (blue top border) |
| `.tab.modified` | div | File has unsaved changes (dot via CSS `::after`) |
| `.tab-label` | span | Tab filename text |
| `.tab-close` | button | Close (×) button on a tab |
| `.notif` | div | A toast notification |
| `.notif.success` | div | Green-bordered toast |
| `.notif.error` | div | Red-bordered toast |

---

## 6. JavaScript — Function Reference

All code is in the last `<script>` block (Script Block 2).
Sections are separated by `// ===` comment dividers for easy navigation.

### Global State Variables

```javascript
var rootDirHandle = null;
// Type: FileSystemDirectoryHandle | null
// Set when the user opens a folder via showDirectoryPicker()
// null = no folder is open

var openFiles = {};
// Type: { [path: string]: { handle, content, saved, modified } }
//   path     - relative path string, e.g. "daily-notes/2024-01-01.md"
//   handle   - FileSystemFileHandle (used to write the file)
//   content  - current string value in the editor (may be unsaved)
//   saved    - last saved string (compared to detect changes)
//   modified - boolean: content !== saved

var activeTab = null;
// Type: string | null
// The path of the file currently displayed in the editor
// null = welcome screen is showing

var viewMode = 'edit';
// Type: 'edit' | 'preview' | 'split'
// Controls which panes are visible
```

### Complete Function List

```
INIT
  bindKeys()
    Registers all keyboard shortcuts via a single keydown listener.
    Handles: Ctrl+O, S, N, W, B, I, E, Shift+P, Tab, Escape.

FOLDER
  openFolder()
    Calls window.showDirectoryPicker({mode:'readwrite'}).
    Stores the handle in rootDirHandle, then calls renderTree().
    Shows a notification on success or failure.

FILE TREE
  renderTree()
    Clears #filetree, reads the search box value,
    calls buildDir() on rootDirHandle.

  buildDir(dirHandle, container, depth, parentPath, filter)
    Iterates all entries in a directory handle using for-await.
    Sorts: folders first, then files, both alphabetically.
    Calls buildFolderItem() or buildFileItem() for each entry.

  buildFolderItem(dirHandle, container, depth, path, filter)
    Creates the folder row div (.tree-item.folder).
    On click: toggles .open on its children div, lazily loads children.
    On contextmenu: calls showCtx().

  buildFileItem(fileHandle, container, depth, path)
    Creates the file row div (.tree-item.file).
    On click: calls openFile().
    On contextmenu: calls showCtx().

  getIcon(filename)
    Maps file extension to an emoji string.
    Returns a fallback emoji for unknown extensions.

  escH(str)
    HTML-escapes &, <, > in a string.
    Used for all user-supplied text injected into innerHTML.

  showEmptyTree()
    Renders a placeholder message with an "Open Folder" button.

FILE I/O
  openFile(fileHandle, path)
    If path already in openFiles{}, just switches to it.
    Otherwise: reads file.text(), stores in openFiles{}, calls addTab + setActiveTab.

  saveCurrentFile()
    Gets current textarea value.
    Calls fileHandle.createWritable() -> write() -> close().
    Updates f.saved and f.modified = false.

  autoSave()
    Called by setInterval every 30 seconds.
    Only saves if activeTab exists and openFiles[activeTab].modified is true.

TABS
  addTab(path)
    Creates a .tab div in #tabs-bar if one doesn't exist yet.
    Adds click handler to call setActiveTab(path).

  setActiveTab(path)
    Saves current textarea content back to openFiles[activeTab].content.
    Sets activeTab = path.
    Loads f.content into textarea.
    Hides welcome screen, shows editor pane.
    Calls applyView(), updatePreview(), updateStatus().

  setTabModified(path, bool)
    Toggles .modified class on the tab for the given path.

  closeTab(event, path)
    Confirms if file is modified, then:
    delete openFiles[path], removes .tab from DOM.
    If closing the active tab: activates next/prev tab, or calls showWelcome().

  closeActiveTab()
    Calls closeTab() on activeTab.

  showWelcome()
    Sets activeTab = null.
    Shows #welcome-screen, hides #editor-pane and preview.
    Resets status bar displays.

EDITOR
  onInput()
    Fired on every textarea input event.
    Compares textarea.value to f.saved to set f.modified.
    Calls setTabModified() and updateWordCount().
    If viewMode is not 'edit', also calls updatePreview().

VIEW
  setViewMode(mode)
    Sets viewMode, calls applyView(), updateToolbar(),
    and updatePreview() if not in edit mode.

  applyView()
    Applies CSS classes to #editor-pane and #preview-pane
    based on the current viewMode:
      'edit'    -> editor shown, preview hidden
      'preview' -> editor hidden, preview shown
      'split'   -> both shown side-by-side (50/50)

  updateToolbar()
    Syncs .active class on #btn-edit, #btn-split, #btn-preview.
    Hides #md-format-btns in preview-only mode.

  updatePreview()
    Reads textarea value, passes to window.mdParse().
    Injects result into #preview-body.innerHTML.

MARKDOWN INSERT HELPERS
  insertAtCursor(text)
    Uses textarea.setRangeText(text, start, end, 'end') to insert at cursor.

  insertMd(before, after)
    Wraps the current selection with before/after strings.
    Used for bold (**...**), italic (*...*), inline code (`...`).

  insertMdLine(prefix)
    Inserts prefix at the beginning of the current line.
    Used for headings (# ), lists (- ), blockquotes (> ), tasks (- [ ] ).

  insertCodeBlock()
    Wraps selection in a fenced code block (```javascript ... ```).

  insertTable()
    Inserts a 3-column Markdown table template at cursor.

STATUS BAR
  updateStatus()
    Calculates current line and column from textarea.selectionStart.
    Updates #sb-lines text.
    Calls updateWordCount().

  updateWordCount()
    Counts whitespace-delimited words in textarea.value.
    Updates #sb-words text.

CREATE / DELETE
  createNewFile()
    Opens the modal dialog, then on confirm:
    calls rootDirHandle.getFileHandle(name, {create:true}).
    Writes default content, re-renders tree, opens the file.

  createNewFolder()
    Opens the modal dialog, then on confirm:
    calls rootDirHandle.getDirectoryHandle(name, {create:true}).
    Re-renders tree.

  newFileIn(event, parentPath)
    Like createNewFile() but creates the file inside a specific subfolder.
    Traverses the path by calling getDirectoryHandle() for each segment.

  delItem(event, path)
    Confirms deletion, then calls dirHandle.removeEntry(name, {recursive:true}).
    Removes from openFiles{} and closes the tab if open.
    Re-renders tree.

CONTEXT MENU
  showCtx(event, target)
    Stores target in ctxTarget.
    Positions #ctx-menu at mouse coordinates.
    Shows/hides "New File Here" and "New Folder Here" based on target.kind.

  hideCtx()
    Removes .visible from #ctx-menu.
    Clears ctxTarget.

  ctxNewFile()   -> delegates to newFileIn()
  ctxNewFolder() -> opens modal, calls getDirectoryHandle()
  ctxDelete()    -> delegates to delItem()

SEARCH & TREE CONTROLS
  filterTree(value)
    Simply calls renderTree() — the filter is read from #search-box inside.

  refreshTree()
    Calls renderTree() and shows a notification.

  collapseAll()
    Queries all .tree-folder-children.open and removes .open.

MODAL DIALOG
  showModal(title, placeholder, callback)
    Sets modal title, input placeholder and value.
    Stores callback in modalCb.
    Adds .visible to #modal-overlay.
    Focuses and selects the input.

  closeModal()
    Removes .visible from #modal-overlay.
    Clears modalCb.

  confirmModal()
    Reads #modal-input value.
    Calls closeModal(), then invokes modalCb(value).

NOTIFICATIONS (Toasts)
  notify(message, type)
    Creates a .notif div (+ .success or .error class).
    Appends to #notifications.
    Auto-fades and removes after 3 seconds.

DEMO CONTENT
  createDemo()
    Checks rootDirHandle is set (prompts to open folder if not).
    Iterates a hardcoded files[] array.
    Creates subfolders and files with getDirectoryHandle/getFileHandle.
    Re-renders tree and opens README.md.

HELP OVERLAY
  toggleHelp()
    Toggles .hidden on #help-overlay.
```

---

## 7. Markdown Parser — How It Works

The parser lives in **Script Block 1**, wrapped in an IIFE.
It exposes one function: `window.mdParse(src)` which returns an HTML string.
This is a **custom minimal implementation** — not the full marked.js library.

### Block-Level Parsing

```
mdParse(src)
|
|-- Normalize: \r\n -> \n, tabs -> 2 spaces
|-- Split into lines[]
|-- Iterate lines with index i:
    |
    |-- Blank line?
    |   Skip, increment i.
    |
    |-- Fenced code block? (``` or ~~~)
    |   Collect lines until closing fence.
    |   Pass to hlCode(code, lang) for syntax highlighting.
    |   Wrap in <pre><code>. Append lang label span.
    |
    |-- Heading? (starts with #)
    |   Count # chars for h1-h6 level.
    |   Generate slug id from heading text.
    |   Wrap in <hN id="slug">.
    |   Run inline() on heading text.
    |
    |-- Horizontal rule? (---, ***, ___)
    |   Emit <hr>.
    |
    |-- Blockquote? (starts with >)
    |   Collect all consecutive > lines.
    |   Strip > prefix from each.
    |   Recursively call mdParse() on collected text.
    |   Wrap in <blockquote>.
    |
    |-- Table? (line i+1 matches |---|)
    |   Parse header row (split by |).
    |   Skip the separator row.
    |   Parse data rows until no | found.
    |   Emit <table><thead>...<tbody>...
    |
    |-- List? (starts with - / * / + / 1.)
    |   Detect ordered vs unordered.
    |   Collect consecutive list item lines.
    |   Check for task syntax: - [ ] or - [x]
    |   Emit <ul>/<ol> with <li> items (+ checkboxes).
    |
    +-- Paragraph (everything else)
        Collect consecutive non-blank lines.
        Join with space.
        Run inline() on the text.
        Wrap in <p>.
```

### Inline Parsing (`inline()` function)

Processes within-paragraph formatting using a regex-match loop:

| Pattern matched | HTML output |
|---|---|
| `\X` (backslash escape) | Literal character X |
| `` `code` `` | `<code>escaped text</code>` |
| `~~text~~` | `<del>text</del>` |
| `**text**` or `__text__` | `<strong>text</strong>` |
| `*text*` or `_text_` | `<em>text</em>` |
| `[label](url "title")` | `<a href="url" title="title" target="_blank">label</a>` |
| `![alt](url)` | `<img src="url" alt="alt" style="max-width:100%">` |
| Two trailing spaces | `<br>` |
| Plain text | HTML-escaped literal |

### Syntax Highlighter (`hlCode(code, lang)`)

Applies colored `<span>` tokens. Supported languages and their keyword sets:

| `lang` values | What gets highlighted |
|---|---|
| `js`, `javascript`, `ts`, `typescript` | `var let const function return if else for while class async await try catch import export null undefined true false` |
| `py`, `python` | `def class import from return if elif else for while in not and or True False None try except finally with as pass` |
| `bash`, `sh`, `shell`, `cmd`, `powershell` | `if then else fi for while do done echo exit return function cd ls mkdir rm cp mv cat grep curl` |
| `sql` | `SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE DROP ALTER JOIN LEFT RIGHT INNER ON AS AND OR NOT NULL` |
| `html`, `xml` | Tags and attributes (separate path using tag-specific regex) |
| Others | Only HTML-escaped, no coloring |

CSS classes used for token coloring (defined in `.md-body pre`):
- `.tok-keyword` — purple
- `.tok-string` — orange
- `.tok-comment` — green italic
- `.tok-number` — light green

### Adding a New Language

Find `hlCode()` in Script Block 1 and add an `else if` branch before the fallback `return h`:

```javascript
else if (/^(rust|rs)$/i.test(lang)) {
  kw = '\\b(fn|let|mut|pub|use|mod|struct|enum|impl|trait|return|if|else|for|while|loop|match|Some|None|Ok|Err|true|false)\\b';
}
```

---

## 8. State Management

### The Four Global Variables

```javascript
// 1. Root folder
var rootDirHandle = null;
// null  = no folder open, welcome screen shown
// value = FileSystemDirectoryHandle of the chosen folder

// 2. Open files registry
var openFiles = {};
// Each entry is created by openFile() and deleted by closeTab().
// Key   = path string relative to root (e.g. "notes/day1.md")
// Value = {
//   handle:   FileSystemFileHandle,  // reference to the file on disk
//   content:  string,                // current editor content (may differ from saved)
//   saved:    string,                // last version written to disk
//   modified: boolean                // true when content !== saved
// }

// 3. Active tab
var activeTab = null;
// null   = welcome screen is shown
// string = path of file currently displayed in editor

// 4. View mode
var viewMode = 'edit';
// 'edit'    = textarea visible, preview hidden
// 'preview' = textarea hidden, preview visible
// 'split'   = both visible side-by-side (50/50)
```

### openFiles Object Lifecycle Diagram

```
User clicks file in tree
     |
     v
openFile(handle, path)
     |-- Already in openFiles? -> setActiveTab() only
     |-- New file:
         file.text() from disk
         openFiles[path] = { handle, content, saved:content, modified:false }
         addTab(path)
         setActiveTab(path) -> loads textarea

User types
     |
     v
onInput()
     content = textarea.value
     f.modified = (content !== f.saved)
     setTabModified(path, f.modified)  -> shows/removes dot on tab

User presses Ctrl+S
     |
     v
saveCurrentFile()
     content = textarea.value
     handle.createWritable() -> write(content) -> close()
     f.saved    = content
     f.modified = false
     setTabModified(path, false)       -> removes dot

User closes tab
     |
     v
closeTab(event, path)
     if f.modified -> confirm dialog
     delete openFiles[path]
     tab element removed from DOM
     if activeTab === path:
         next tab found? -> setActiveTab(nextPath)
         no tab left?    -> showWelcome()
```

---

## 9. Key Browser APIs Used

### File System Access API

The entire file management system is built on this API.
Available natively in Chrome 86+ and Edge 86+ — no installation required.

```javascript
// Open a folder picker dialog
const rootDir = await window.showDirectoryPicker({ mode: 'readwrite' });

// Iterate directory contents
for await (const entry of dirHandle.values()) {
  entry.kind  // 'file' | 'directory'
  entry.name  // string
}

// Get a file handle (read existing)
const fh = await dirHandle.getFileHandle('readme.md');

// Get a file handle (create if missing)
const fh = await dirHandle.getFileHandle('new.md', { create: true });

// Get a subdirectory handle (create if missing)
const sub = await dirHandle.getDirectoryHandle('daily-notes', { create: true });

// Delete a file or directory
await dirHandle.removeEntry('old.md');
await dirHandle.removeEntry('folder', { recursive: true });

// Read file content
const file    = await fh.getFile();
const content = await file.text();

// Write file content
const writable = await fh.createWritable();
await writable.write('updated content');
await writable.close();  // IMPORTANT: must call close() to flush
```

> **Security note:** The browser shows a one-time permission prompt when a folder is opened.
> The handle is not persisted after the tab/window is closed — the user must re-grant permission
> on the next session. This is a browser security feature and cannot be bypassed.

### Other APIs Used

```javascript
// CSS.escape() — safely build CSS selectors from file paths
document.querySelector('.tab[data-path="' + CSS.escape(path) + '"]');

// setRangeText() — insert text at cursor in a textarea
textarea.setRangeText(text, selStart, selEnd, 'end');

// localStorage — not yet used but available for future settings storage
localStorage.setItem('kbSettings', JSON.stringify({ viewMode, fontSize }));
const s = JSON.parse(localStorage.getItem('kbSettings') || '{}');

// setInterval — auto-save timer
const timerId = setInterval(autoSave, 30000); // every 30 seconds
```

---

## 10. Common Modifications Guide

### A. Rename the App

1. `<title>` tag in `<head>` — change "KB Studio"
2. SVG `<text>` in `#titlebar` — change "KB"
3. Sidebar header `<span>` — change "Explorer"
4. SVG `<rect fill="#007acc">` — change the logo color

### B. Create a Light Theme

Override any `:root` variables. Minimal light theme:

```css
:root {
  --bg-dark:       #ffffff;
  --bg-sidebar:    #f3f3f3;
  --bg-panel:      #ececec;
  --bg-editor:     #ffffff;
  --bg-tab:        #ececec;
  --bg-tab-active: #ffffff;
  --bg-input:      #e0e0e0;
  --bg-hover:      #e8e8e8;
  --bg-selected:   #cce5ff;
  --fg-primary:    #1e1e1e;
  --fg-secondary:  #555555;
  --fg-muted:      #888888;
  --border:        #d0d0d0;
  --fg-heading:    #0070c0;
}
```

All components use `var()` and pick up changes instantly — no other edits needed.

### C. Change Sidebar Width

```css
--sidebar-w: 320px;   /* default is 260px */
```

### D. Add a Toolbar Button

Inside `#editor-toolbar`, place inside any `.toolbar-group`:

```html
<button class="toolbar-btn" onclick="myFn()" title="Tooltip text">🔖 Label</button>
```

Then define `myFn()` anywhere in Script Block 2:

```javascript
function myFn() {
  insertMdLine('> [!NOTE] ');
}
```

### E. Add a Keyboard Shortcut

Inside `bindKeys()` in Script Block 2, add before the closing `}`:

```javascript
if (e.ctrlKey && e.key.toLowerCase() === 'k') {
  e.preventDefault();
  myFn();
}
```

### F. Add a File Icon

Find `getIcon()` in Script Block 2 and add to the `map` object:

```javascript
var map = {
  md: '📝', js: '📜', /* ...existing... */
  go:  '🔷',   // Go
  rs:  '🦀',   // Rust
  vue: '💚',   // Vue
  rb:  '💎',   // Ruby
  kt:  '🟣',   // Kotlin
};
```

### G. Add Syntax Highlighting for a New Language

Find `hlCode()` in Script Block 1. Add a new `else if` before the fallback:

```javascript
else if (/^(go|golang)$/i.test(lang)) {
  kw = '\\b(func|return|if|else|for|range|var|const|type|struct|interface|package|import|go|defer|nil|true|false)\\b';
}
```

### H. Change Auto-Save Frequency

Find in `DOMContentLoaded`:

```javascript
setInterval(autoSave, 30000);  // change 30000 to desired ms
// 10000 = 10 sec, 60000 = 1 min, comment out to disable
```

### I. Edit the Demo Starter Files

Find `createDemo()` in Script Block 2. Edit the `files` array:

```javascript
var files = [
  { p: 'README.md',               c: '# My KB\n\nContent here.' },
  { p: 'daily-notes/day1.md',     c: '# Day 1 Notes\n\n...' },
  { p: 'solutions/my-fix.md',     c: '# Fix: Problem X\n\n...' },
];
```

- `p` = relative file path (`/` creates subfolders)
- `c` = file content string (use template literals for multiline)

### J. Change Editor Font Size

```css
#editor-textarea {
  font-size: 14px;   /* default */
}
```

### K. Change Markdown Preview Heading Color

```css
.md-body h1, .md-body h2, .md-body h3 {
  color: var(--fg-heading);   /* or any literal color */
}
```

### L. Change Code Block Background

```css
.md-body pre {
  background: #0d0d0d;   /* default, very dark */
}
```

---

## 11. Scaling Roadmap

### Phase 1 — Quality of Life (Still a Single File)

Low-effort features that fit in the current architecture:

| Feature | Implementation approach |
|---|---|
| **Resizable sidebar** | Drag handler on a border div; update `--sidebar-w` via `document.documentElement.style.setProperty('--sidebar-w', newWidth + 'px')` |
| **Rename files** | FSAPI has no `rename()`. Work-around: create new file, copy content, delete old. |
| **Find in file** | Add search toolbar; use `indexOf` + `textarea.setSelectionRange(start, end)` to jump to match |
| **Font size control** | +/- buttons; `document.documentElement.style.setProperty('--font-size-mono', size + 'px')` |
| **Persistent settings** | `localStorage.setItem('kbSettings', JSON.stringify({viewMode, fontSize}))` on change; load in init |
| **Multiple color themes** | Store preset objects; a dropdown applies them by overwriting `:root` vars |
| **Export to HTML** | `new Blob([preview.innerHTML], {type:'text/html'})` + `URL.createObjectURL` + `<a>.click()` |
| **Print to PDF** | `window.print()` + print CSS (`@media print`) targeting only `#preview-body` |
| **Full-text search** | Index content on folder open (see snippet below); filter by `content.includes(query)` |
| **Mermaid diagrams** | Bundle `mermaid.min.js` inline; after rendering, call `mermaid.init()` on `pre code.language-mermaid` |
| **Collapsible sidebar** | Toggle `--sidebar-w` between `0px` and `260px` with transition |
| **Image paste** | `paste` event listener on textarea; `DataTransferItem.getAsFile()` → write to disk via FSAPI |

### Phase 2 — Split into Multiple Files

When the single file grows beyond ~2000 lines:

```
kb-studio/
|-- index.html            Shell HTML only (no inline CSS or JS)
|-- css/
|   |-- variables.css     Only :root tokens
|   |-- layout.css        Grid, #app, #titlebar, #sidebar, #main, #statusbar
|   |-- components.css    Tree nodes, tabs, toolbar, modal, ctx menu, toasts
|   +-- markdown.css      .md-body and all syntax token styles
|-- js/
|   |-- state.js          4 global variables + exports
|   |-- parser.js         mdParse() + hlCode() + inline()
|   |-- tree.js           renderTree, buildDir, buildFolderItem, buildFileItem
|   |-- tabs.js           addTab, setActiveTab, closeTab, showWelcome
|   |-- editor.js         onInput, setViewMode, applyView, updatePreview, insert helpers
|   |-- fileops.js        openFile, saveCurrentFile, autoSave, createNew*, delItem
|   |-- ui.js             Modal, ctx menu, notifications, help overlay, status bar
|   +-- main.js           DOMContentLoaded init, bindKeys, openFolder, createDemo
+-- DEVELOPER.md
```

> **Important:** After splitting, you must serve files from a local HTTP server.
> Browsers block ES module imports on `file://` URLs due to CORS.
> Quickest option: `python -m http.server 8080` then open `http://localhost:8080`.

### Phase 3 — Framework Migration (React / Vue / Vite)

The current code maps naturally to React or Vue patterns:

| Current (vanilla JS) | React equivalent | Vue equivalent |
|---|---|---|
| `openFiles{}` global | `useState({})` | Pinia store |
| `activeTab` global | `useState(null)` | `ref(null)` |
| `viewMode` global | `useState('edit')` | `ref('edit')` |
| `rootDirHandle` global | `useRef(null)` | `ref(null)` |
| `renderTree()` function | `<FileTree>` component | `<FileTree>` component |
| `buildFileItem()` | `<FileItem>` component | `<FileItem>` component |
| `updatePreview()` | `useEffect` on content | `watch` on content |
| `notify()` | `<ToastProvider>` | `<ToastQueue>` component |

Recommended migration tool: **Vite**
```bash
npm create vite@latest kb-studio -- --template vanilla
```
Then incrementally move JS functions into modules and CSS into separate files.

### Phase 4 — Backend & Collaboration Features

| Feature | Recommended technology |
|---|---|
| Share notes with others | Express.js / FastAPI REST API serving .md files as JSON |
| Search across all notes | SQLite FTS5 full-text search (backend) or Lunr.js (in-browser) |
| Git version history | `isomorphic-git` — a pure-JS git implementation that runs in the browser |
| Real-time collaboration | WebSockets + Yjs (CRDT library for conflict-free merging) |
| Cloud backup / sync | GitHub REST API with a Personal Access Token; or Dropbox API |
| User authentication | JWT tokens + Passport.js / FastAPI OAuth2 |

### Useful Implementation Snippets

**Full-text search across all .md files:**
```javascript
var searchIndex = {}; // path -> file content string

async function buildSearchIndex(dirHandle, prefix) {
  for await (var entry of dirHandle.values()) {
    var path = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.kind === 'file' && entry.name.endsWith('.md')) {
      var file = await entry.getFile();
      searchIndex[path] = (await file.text()).toLowerCase();
    } else if (entry.kind === 'directory') {
      await buildSearchIndex(entry, path);
    }
  }
}

function searchAllFiles(query) {
  var q = query.toLowerCase();
  return Object.keys(searchIndex).filter(path => searchIndex[path].includes(q));
}
```

**Collapsible sidebar with animation:**
```javascript
function toggleSidebar() {
  var app = document.getElementById('app');
  var current = getComputedStyle(document.documentElement)
                  .getPropertyValue('--sidebar-w').trim();
  var next = current === '0px' ? '260px' : '0px';
  document.documentElement.style.setProperty('--sidebar-w', next);
  localStorage.setItem('sidebarCollapsed', next === '0px');
}
// Add to :root: --sidebar-w with transition on #sidebar: transition: width 0.2s ease;
```

**Persistent user settings:**
```javascript
function saveSettings() {
  localStorage.setItem('kbSettings', JSON.stringify({
    viewMode:     viewMode,
    sidebarWidth: getComputedStyle(document.documentElement)
                    .getPropertyValue('--sidebar-w').trim(),
    editorFontSize: '14px'
  }));
}

function loadSettings() {
  try {
    var s = JSON.parse(localStorage.getItem('kbSettings') || '{}');
    if (s.viewMode) setViewMode(s.viewMode);
    if (s.sidebarWidth)
      document.documentElement.style.setProperty('--sidebar-w', s.sidebarWidth);
  } catch(e) { /* ignore corrupt settings */ }
}
// Call loadSettings() at the end of DOMContentLoaded
```

---

## 12. Known Limitations

| Limitation | Root Cause | Planned Fix |
|---|---|---|
| Cannot rename files in place | `FileSystemFileHandle` has no `rename()` method | Phase 1: create new + copy + delete |
| Must re-grant folder permission on each page reload | Browser security: FSAPI handles are not persisted across sessions | No workaround; user clicks "Allow" once per session |
| File search only filters by filename | Full-text indexing not implemented | Phase 1: `buildSearchIndex()` on folder open |
| Undo history lost when tab is closed | Browser textarea undo stack is not preserved | Future: custom undo/redo stack in `openFiles{}` |
| Large folders (1000+ files) may render slowly | No virtual scrolling — all DOM nodes created at once | Future: IntersectionObserver-based virtual list |
| No image preview in the editor | Plain `<textarea>` cannot render images | Future: overlay div or switch to CodeMirror |
| Markdown strikethrough (~~text~~) is limited | Custom parser doesn't handle all edge cases | Future: replace with full marked.js |
| Nested subfolder creation requires expanding parent first | UI only exposes "New File Here" on already-rendered folders | Future: folder path input in modal |

---

## 13. Browser Compatibility

| Browser | Supported | Notes |
|---|---|---|
| **Chrome 86+** | ✅ Full | Recommended primary browser |
| **Edge 86+** | ✅ Full | Pre-installed on all Windows 10/11; recommended for office use |
| **Firefox** | ❌ No | `showDirectoryPicker()` and writable FSAPI not supported as of 2024 |
| **Safari 15.2+** | ⚠️ Partial | Read-only FSAPI available; `createWritable()` not supported — saving will fail |
| **Internet Explorer** | ❌ No | Not supported at all |

> **On a locked-down Windows office laptop:**
> Microsoft Edge ships with every Windows 10 and 11 installation.
> No IT approval, no download, no admin rights needed.
> Simply open Edge, drag `knowledge-base.html` onto it, and click "Allow" when prompted.

---

## Quick Reference Card

```
HOW TO: Add a toolbar button
  HTML  -> Add <button class="toolbar-btn" onclick="fn()">Label</button>
           inside any .toolbar-group in #editor-toolbar
  JS    -> Define fn() in Script Block 2

HOW TO: Change any color
  CSS   -> Edit --bg-* or --fg-* in :root at the top of <style>

HOW TO: Create a light theme
  CSS   -> Override background/foreground tokens in :root with light values

HOW TO: Add syntax highlighting for a code language
  JS (Block 1) -> Add else if block in hlCode() with a keyword regex string

HOW TO: Add a keyboard shortcut
  JS (Block 2) -> Add if condition in the keydown listener in bindKeys()

HOW TO: Change sidebar width
  CSS   -> Edit --sidebar-w in :root

HOW TO: Change auto-save frequency
  JS (Block 2) -> Edit the ms value in setInterval(autoSave, 30000)

HOW TO: Add a file type icon
  JS (Block 2) -> Add {ext: 'emoji'} entry to map in getIcon()

HOW TO: Edit demo starter files
  JS (Block 2) -> Edit the files[] array in createDemo()
                  Each item: { p: 'path/file.md', c: 'content' }

HOW TO: Change editor font size
  CSS   -> Change font-size on #editor-textarea

HOW TO: Change Markdown heading color
  CSS   -> Change color on .md-body h1, .md-body h2, etc.

HOW TO: Change code block background color
  CSS   -> Change background on .md-body pre

HOW TO: Split into multiple files (Phase 2)
  1. Create kb-studio/ folder
  2. Move CSS to css/*.css files
  3. Move JS sections to js/*.js files
  4. Serve with: python -m http.server 8080
```

---

*Last updated: October 2026 | Version: 1.0.0 | Source: knowledge-base.html (~1135 lines, ~57 KB)*
