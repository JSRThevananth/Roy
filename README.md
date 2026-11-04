# Roy Thevananth — Portfolio

Personal portfolio of **Roy Thevananth Joseph Selvarasu**, FSQA Specialist in Montréal
(HACCP · FSMA / PCQI · FSSC 22000 · ISO 22000 · SQF Internal Auditor).

Static site, no build step and no dependencies:

```
index.html          page markup
assets/style.css    styles
assets/main.js      build-in intro, arrow flock, email copy
assets/roy.webp     portrait (background removed)
vercel.json         security headers when hosted on Vercel
```

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Deploy

- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
- **Vercel:** import this repo; no framework or build command. `vercel.json` adds the security headers.

## Security

- Strict Content-Security-Policy: scripts only from this site, no inline scripts, no third-party trackers.
- No forms, cookies, or data collection.
- On Vercel: HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy and COOP/CORP headers.
