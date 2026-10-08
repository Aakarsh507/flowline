# MetricFlow Consulting — Website

Static, dependency-free website for **MetricFlow Consulting** (Purdue University MIS 38200 academic consulting project).

```
FlowlineConsulting/
├── index.html        ← all page content (sections are clearly commented)
├── css/styles.css    ← all styling; brand colors/fonts are tokens at the top
├── js/main.js        ← mobile menu, smooth scroll, active nav, animations, form
└── assets/favicon.svg
```

No build step, no npm packages. The only external request is Google Fonts (Inter, Manrope and Montserrat); the site falls back to system fonts if they're unavailable.

## Run locally

Option A: double-click `index.html`. It opens in your browser and works as-is.

Option B (recommended; behaves exactly like a real host): from this folder run

```bash
python -m http.server 5500
```

then open http://localhost:5500. (VS Code's "Live Server" extension also works.)

## Publish for free

### GitHub Pages
1. Create a new **public** repository on GitHub (e.g. `flowline-consulting`).
2. Upload the contents of this folder (`index.html` must be at the repo root), or push with git:
   ```bash
   git init && git add . && git commit -m "MetricFlow Consulting site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/flowline-consulting.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. After about a minute the site is live at `https://<your-username>.github.io/flowline-consulting/`.

### Netlify Drop (no account setup beyond sign-in, about 30 seconds)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page. You get a live URL immediately; rename it under *Site settings*.

Vercel and Cloudflare Pages also work: import the repo and use no build command and output directory `/`.

## Common edits

| What | Where |
|---|---|
| Brand colors / fonts | `css/styles.css`, `:root` tokens at the top |
| Prototype output rows | `index.html`, `<table class="md-table">` in the Featured Solution section |

## Making the contact form actually send

Right now the form validates input and shows a confirmation that clearly says **no email was sent** (there's no backend). To receive messages for free:

1. Create a form at https://formspree.io (free tier) and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `js/main.js`, inside the form `submit` handler, after validation passes, add:
   ```js
   fetch('https://formspree.io/f/abcdwxyz', {
     method: 'POST',
     headers: { Accept: 'application/json' },
     body: new FormData(form)
   });
   ```
3. Update the success text in `index.html` (`#form-success`) to say the message was sent.

## Accuracy notes

The site keeps these distinctions in place on purpose; keep them if you edit content:
- The Target Inventory Exception Assistant is labeled a **proposed client solution / prototype**, and the page states Target has not commissioned or endorsed it.
- All prototype output is labeled **simulated**; the site states MetricFlow has no access to Target's proprietary data.
- Impact cards are **proposed success measures**, with no percentages or claimed results.
- The footer states this is an academic project for Purdue University MIS 38200.
