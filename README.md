# Four Seasons Waterfront Villas

Static HTML/CSS/JS rebuild of [fourseasonswaterfrontvillas.com.au](https://fourseasonswaterfrontvillas.com.au/)

## Project Structure

```
fourseasonswaterfrontvillas/
├── index.html          # Home page
├── villas.html         # Villas page
├── nearby.html         # Nearby attractions page
├── contact.html        # Contact page
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Slider, nav, lightbox, animations, contact form
├── images/             # All site images
├── form-handler/       # Node.js contact form service (Postmark)
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml  # Two services: nginx site + node form handler
├── nginx.conf          # Nginx config — static files + proxy to form handler
├── sitemap.xml
└── README.md
```

## Docker Services

| Container            | Image         | Port |
|----------------------|---------------|------|
| fourseasons_site     | nginx:alpine  | 8082 |
| fourseasons_forms    | node:18-alpine| 3000 (internal) |

## Dependencies (CDN — no install required)

- [Google Fonts](https://fonts.google.com/) — Open Sans + Playfair Display
- [Font Awesome 6](https://fontawesome.com/) — Icons

## Google Analytics

GA4 Measurement ID: `G-1Q2DJEDD4H` — added to all 4 pages.

## Contact Form

Sends via Postmark API. Config is in `form-handler/server.js`:
- **From:** noreply@fortewebdesign.com.au
- **To:** Cassandra.mason2@bigpond.com
- **Endpoint:** POST /api/contact

## Local Development

Open `index.html` directly in your browser for layout review.

To test the contact form locally you need Docker running:
```bash
docker compose up -d --build
# Then open http://localhost:8082
```

## GitHub Repository

https://github.com/trustedsamurai/linode-server-sites1

This site lives as a subfolder inside the `linode-server-sites1` repo:
`linode-server-sites1/fourseasonswaterfrontvillas/`

## Pushing Changes (from Windows)

```powershell
# 1. Copy updated files into the cloned repo folder
Copy-Item -Recurse -Force "C:\Users\johnf\Dropbox\forte websites\Github sites\fourseasonswaterfrontvillas\*" "C:\Users\johnf\linode-server-sites1\fourseasonswaterfrontvillas\"

# 2. Commit and push
cd "C:\Users\johnf\linode-server-sites1"
git add fourseasonswaterfrontvillas/
git commit -m "Update fourseasonswaterfrontvillas"
git push origin main
```

## Deploying to Linode (after pushing)

SSH into the Linode server, then:

```bash
cd ~/sites
git pull origin main

cd ~/sites/fourseasonswaterfrontvillas
docker compose down
docker compose up -d --build
```

---

Built by [ForteWebDesign.com.au](https://fortewebdesign.com.au)
