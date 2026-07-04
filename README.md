# Tilak Raghunandan G — Portfolio

A fully animated, single-page portfolio built with plain HTML, CSS, and JavaScript —
no build step, no dependencies. Designed around a computer-vision "object detection"
visual language (scan lines, bounding boxes, confidence tags) that reflects the
CV/ML work it showcases. Includes a dark/light theme toggle (light theme swaps
every accent to blue) and a working "download resume" button.

## What's inside

```
portfolio/
├── index.html      → all page content (about, experience, hackathons, projects, skills, education, contact)
├── styles.css       → design system, dark/light theme tokens, animations
├── script.js        → scroll reveals, count-up stats, pipeline draw-in, theme toggle, nav behaviour
├── assets/
│   ├── photo.jpg                          → profile photo used in the hero section
│   └── Tilak_Raghunandan_G_Resume.pdf     → resume served by the "Download PDF" button
└── README.md
```

---

## Run it in VS Code

1. **Open the folder.**
   - Unzip `portfolio.zip` anywhere on your machine.
   - In VS Code: `File → Open Folder…` → select the unzipped `portfolio` folder.

2. **Preview it live** (pick one):
   - **Live Server extension (easiest):** install the "Live Server" extension
     (by Ritwick Dey) from the Extensions tab (`Ctrl/Cmd+Shift+X`, search "Live Server").
     Then right-click `index.html` in the file explorer → **"Open with Live Server"**.
     It opens in your browser at `http://127.0.0.1:5500` and auto-reloads on save.
   - **No extensions:** open the built-in terminal (`` Ctrl+` ``) and run:
     ```bash
     python3 -m http.server 8000
     ```
     then open `http://localhost:8000` in your browser. (Opening `index.html`
     directly by double-clicking also works, since there's no build step — but
     a local server avoids any browser file-path quirks.)

3. **Edit and see changes instantly** — with Live Server running, any save to
   `index.html`, `styles.css`, or `script.js` refreshes the browser automatically.

---

## Deploy to GitHub Pages (free hosting)

1. **Create a new GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Name it either `portfolio` (or anything) — or specifically
     `<your-username>.github.io` if you want it at the root of your GitHub domain.
   - Leave it public, don't initialize with a README (you already have one).

2. **Push this folder to the repo**, from inside the unzipped `portfolio` folder:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
   *(Replace `<your-username>` and `<repo-name>` with your actual GitHub username and repo name. You can also do this from VS Code's built-in Source Control tab instead of the terminal, if you prefer.)*

3. **Enable GitHub Pages:**
   - On GitHub, open your repo → **Settings** → **Pages** (left sidebar)
   - Under "Build and deployment" → **Source**, choose **Deploy from a branch**
   - **Branch:** `main`, folder: **/ (root)** → **Save**

4. **Wait ~1 minute**, then your site is live at:
   - `https://<your-username>.github.io/<repo-name>/` (regular repo name), or
   - `https://<your-username>.github.io/` (if you named the repo `<your-username>.github.io`)

5. **Making future edits:** edit locally in VS Code, then:
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
   GitHub Pages redeploys automatically within a minute or two.

6. **Optional — custom domain:** Settings → Pages → Custom domain, then add the
   suggested `CNAME` record at your DNS provider.

---

## Editing content

Everything is in `index.html` — each resume section (experience, hackathons,
projects, skills, education) is a plain HTML block, no templating. To update:

- **Text/links:** edit directly inside the relevant `<section id="...">`.
- **Colors/fonts/spacing:** all design tokens live at the top of `styles.css`
  under `:root { ... }` (dark theme) and `:root[data-theme="light"] { ... }`
  (light theme — keep both in sync if you tweak the palette).
- **Photo:** replace `assets/photo.jpg` with a new image of the same filename
  (portrait orientation, ~900px wide works best).
- **Resume:** replace `assets/Tilak_Raghunandan_G_Resume.pdf` with an updated
  PDF of the *same filename* — the download button will pick it up automatically.
  If you rename the file, update the `href` in the resume `<a>` tag inside the
  contact section of `index.html` too.

## Notes

- Fully responsive down to small mobile widths.
- Dark/light theme toggle in the nav — preference is remembered on return visits
  (via `localStorage`), and falls back to the visitor's OS-level light/dark
  preference on first load.
- Respects `prefers-reduced-motion` — animations are disabled for users who
  request it at the OS level.
- No external JS frameworks; fonts are loaded from Google Fonts via CDN
  (Space Grotesk, Inter, IBM Plex Mono).
