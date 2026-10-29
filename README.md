# Juniper Collective

Static site for Juniper Collective, an advisory firm for experience-based businesses. Published to GitHub Pages by `.github/workflows/pages.yml`.

## Layout
```
src/layout.html        header, footer, head tags
src/pages/*.html       one file per page: a front-matter comment, then the body
src/partials/          the intro overlay, the portal illustration
assets/css|js|img      stylesheet, scripts, WebP photographs and the favicon
media/                 the intro video (mp4 + webm) and its soundtrack
build/build.py         builds the pages, sitemap.xml and robots.txt at the repo root
build/check_site.py    heading, alt, label, id and link checks
build/icons.py         the icon set and the logomark
docs/                  brand, design, imagery, content to confirm, open questions,
                       launch checklist, portal specification
src/site-url.txt       the public address (change it when the domain goes live)
```

## Working on it
```bash
python build/build.py          # rebuild after editing src/ or build/icons.py
python build/build.py --check  # fail if the built files are out of date
python build/check_site.py     # structure and link checks
python -m http.server 8000     # then open http://localhost:8000
```
The built `*.html` files at the root are committed; edit `src/`, never the root files. The deploy workflow runs both checks first.

## Founder photos
Drop square images at `assets/img/team/elijah.webp`, `katelyn.webp` and `nathan.webp` (also `.jpg` or `.png`) and rebuild. Until then the pages show initials.

## Notes
- No third-party scripts. Fonts come from Google Fonts; the intro uses WebGL where available and falls back to plain video.
- The forms open the visitor's email app and store nothing.
- Anything the copy asserts beyond the original page is listed in `docs/CONTENT-TO-CONFIRM.md`.
