# Four Seasons Waterfront Villas

Static HTML/CSS/JS site for [fourseasonswaterfrontvillas.com.au](https://fourseasonswaterfrontvillas.com.au/).
No framework and no build step — what's in `public/` is what gets served.

## Project Structure

```
fourseasonswaterfrontvillas/
├── amplify.yml          # AWS Amplify build config (serves public/ as-is)
├── README.md
└── public/
    ├── index.html       # Home page (incl. guest ratings strip)
    ├── villas.html      # Villas page
    ├── nearby.html      # Nearby attractions page
    ├── contact.html     # Contact page (form + map)
    ├── sitemap.xml
    ├── css/
    │   └── style.css    # All styles
    ├── js/
    │   └── main.js      # Header, mobile nav, sliders, Google rating, scroll animations
    └── images/          # All site images and platform logos
```

The header and footer are duplicated in every page — contact details, nav links
and the booking URL need updating in all four HTML files.

## Hosting & Deployment

Hosted on **AWS Amplify**, connected to this repo. Pushing to `main` deploys
automatically — Amplify publishes the `public/` directory (see `amplify.yml`).
Changes are usually live within a minute or two.

## Dependencies (CDN — no install required)

- [Google Fonts](https://fonts.google.com/) — Open Sans + Playfair Display
- [Font Awesome 6](https://fontawesome.com/) — Icons
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) — contact form spam protection
- Tripadvisor ratings widget — homepage ratings strip

## Google Analytics

GA4 Measurement ID: `G-KMXMYJB8Q7` — added to all 4 pages.

## Guest Ratings (homepage)

- **Booking.com / Expedia** — static scores in `index.html`. Update the
  "As at" date whenever a score changes.
- **Google** — live rating and review count from the Places API (New), fetched
  in `js/main.js`. The API key is public by necessity, so it must stay
  restricted in Google Cloud Console to the site's domains (apex and www) and to
  the Places API. Google's terms require the Google Maps logo alongside the
  rating and forbid caching the values.
- **Tripadvisor** — live widget.

## Contact Form

`contact.html` posts to the Peabody Digital forms service
(`https://forms.peabodydigital.com.au`, tenant `fourseasons-81fc17f4e78a`) with
a Turnstile check, via the inline script at the bottom of the page. Recipient
addresses are configured in the forms service, not in this repo.

## SEO

Each page has its own `<title>`, meta description, canonical URL and Open
Graph / Twitter tags — keep these in sync when changing a page's title or
description. `index.html` also carries `LodgingBusiness` Schema.org data. Bump
the `<lastmod>` dates in `sitemap.xml` when page content changes.

## Local Development

Open `public/index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server -d public 8000
# then open http://localhost:8000
```

The Google rating won't load locally (the API key is restricted to the live
domains), and the contact form will submit to the live forms service.

---

Originally built by [ForteWebDesign.com.au](https://fortewebdesign.com.au)
