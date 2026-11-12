# NBC public content snapshot

Captured from the public `https://nbc.gov.vn/` site on 2026-11-12. No admin pages or authenticated requests are used.

- `src/data/source-articles.json`: 678 original articles, including original title, publication date, summary, category, source URL, and sanitized article HTML. Original article IDs and slugs are retained.
- `src/data/source-home.json`: original banner, featured and latest article order, five homepage category blocks, and the four original counter values.
- `src/data/source-assets.json`: original image URLs mapped to downloaded local files, with availability and byte size.
- `src/data/source-import-report.json`: archive/import counts and exact unavailable original image URLs.
- `public/nbc/images`: downloaded original images. The full originals occupy approximately 717 MiB.

Article HTML excludes scripts, event handlers, share widgets, and inaccessible editor-local `file:///` images. Original prose and image captions are retained. Article links target local article routes; external links retain their original destinations. Images that are already unavailable at their original hosts remain recorded as missing; no invented replacement is presented as an original image.

The downloader uses Windows certificate validation, native TLS 1.2, caching, and at most four simultaneous GET requests. It never disables certificate validation. Some older external image hosts return 403, 404, DNS errors, or time out.

Run from the repository root with Python and Windows PowerShell installed:

```powershell
py -X utf8 scripts/ingest_nbc.py
py -X utf8 scripts/priority_nbc_images.py
py -X utf8 scripts/finalize_nbc_data.py
py -X utf8 scripts/verify_nbc_data.py
```

The initial homepage HTML is read from `../reference-nbc-home.html`. `scripts/nbc-cache` contains working HTML/download caches and should not be included in the deployed frontend. Re-running ingestion refreshes the normalized snapshot from cached pages; remove only explicitly selected cache files if a source refresh is intended.
