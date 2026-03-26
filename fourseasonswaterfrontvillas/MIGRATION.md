# Migration Notes
- **Date migrated:** 2026-03-18
- **Migrated by:** John
- **Files moved to public/:** contact.html, contact.php, css/, images/, index.html, js/, nearby.html, sitemap.xml, villas.html
- **Required .env vars:** POSTMARK_TOKEN, FROM_EMAIL, TO_EMAIL
- **Container names:** fourseasonswaterfrontvillas_site, fourseasonswaterfrontvillas_forms
- **Port:** 8083
- **Security audit:** PASS / 2026-03-18
- **CONCERN:** form-handler/server.js has hardcoded Postmark token and email addresses — these should be moved to env vars and the .env populated with real values before production use.
