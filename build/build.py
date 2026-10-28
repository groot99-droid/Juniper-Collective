#!/usr/bin/env python3
"""Build the Juniper Collective site. Stdlib only.

    python build/build.py            # writes <page>.html, sitemap.xml, robots.txt, assets/favicon.svg at the repo root
    python build/build.py --check    # builds into memory and fails if any file on disk is out of date

Pages live in src/pages/<slug>.html: a front-matter comment (key: value lines) then the body.
Tokens in a body:
    {{icon:name}}                                an inline SVG icon from build/icons.py
    {{photo:name|alt|class|sizes|eager}}         a responsive <img> from assets/img (alt may be empty for decoration)
    {{include:name}}                             src/partials/name.html
"""
import re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import icons

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
BASE = "https://groot99-droid.github.io/Juniper-Collective/"
SITE = "Juniper Collective"

# name -> (widths available, native width, native height)
PHOTOS = {
    "hero-pavilion":   ([1200, 1920], 1920, 1086),
    "cliff-juniper":   ([1200, 1920], 1920, 1086),
    "three-buildings": ([1200, 1920], 1920, 1086),
    "scale-model":     ([900, 1400], 1400, 930),
    "kitchen":         ([900, 1400], 1400, 930),
    "venue":           ([900, 1400], 1400, 930),
    "studio-table":    ([900, 1400], 1400, 930),
    "dining-terrace":  ([900, 1400], 1400, 930),
    "writing-desk":    ([900, 1400], 1400, 930),
    "lodge-path":      ([1000], 1000, 1250),
}

def esc(s): return (s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;"))

def photo(m):
    parts = m.group(1).split("|") + [""] * 5
    name, alt, cls, sizes, eager = parts[:5]
    if name not in PHOTOS: raise SystemExit(f"unknown photo: {name}")
    widths, w, h = PHOTOS[name]
    srcset = ", ".join(f"assets/img/{name}-{x}.webp {x}w" for x in widths)
    sizes = sizes or "(min-width: 1180px) 1180px, 100vw"
    load = 'loading="eager" fetchpriority="high"' if eager == "eager" else 'loading="lazy"'
    c = f' class="{cls}"' if cls else ""
    return (f'<img{c} src="assets/img/{name}-{widths[-1]}.webp" srcset="{srcset}" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{esc(alt)}" {load} decoding="async">')

def icon(m):
    n = m.group(1)
    if n not in icons.ICONS: raise SystemExit(f"unknown icon: {n}")
    return f'<svg class="i" aria-hidden="true" focusable="false"><use href="#i-{n}"/></svg>'

def expand(text):
    for _ in range(3):
        text = re.sub(r"\{\{include:([\w-]+)\}\}", lambda m: (SRC / "partials" / f"{m.group(1)}.html").read_text(), text)
    text = re.sub(r"\{\{icon:([\w-]+)\}\}", icon, text)
    text = re.sub(r"\{\{photo:([^}]*)\}\}", photo, text)
    return text

def parse(path):
    raw = path.read_text()
    m = re.match(r"\s*<!--(.*?)-->\s*(.*)", raw, re.S)
    if not m: raise SystemExit(f"{path.name}: missing front-matter comment")
    meta = {}
    for line in m.group(1).strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1); meta[k.strip()] = v.strip()
    return meta, m.group(2)

def render(slug, meta, body, layout):
    title = meta["title"] if meta.get("title_full") == "yes" else f'{meta["title"]} · {SITE}'
    page = "index.html" if slug == "index" else f"{slug}.html"
    out = layout
    extra_head = f'<link rel="stylesheet" href="assets/css/intro.css">\n' if slug == "index" else ""
    extra_js = '<script src="assets/js/intro.js" defer></script>\n' if slug == "index" else ""
    rep = {
        "{{title}}": esc(title), "{{description}}": esc(meta["description"]),
        "{{canonical}}": BASE if slug == "index" else BASE + page,
        "{{og_image}}": BASE + "assets/img/cliff-juniper-1200.webp",
        "{{robots}}": '<meta name="robots" content="noindex">\n' if meta.get("noindex") == "yes" else "",
        "{{extra_head}}": extra_head, "{{extra_js}}": extra_js,
        "{{sprite}}": icons.sprite(),
        "{{intro}}": (SRC / "partials" / "intro.html").read_text() if slug == "index" else "",
    }
    out = out.replace("{{body}}", body)
    for k, v in rep.items(): out = out.replace(k, v)
    out = re.sub(r"\{\{cur:([\w-]+)\}\}", lambda m: ' aria-current="page"' if meta.get("nav") == m.group(1) else "", out)
    return expand(out)

def build():
    layout = (SRC / "layout.html").read_text()
    files = {}
    pages = []
    for p in sorted((SRC / "pages").glob("*.html")):
        slug = p.stem
        meta, body = parse(p)
        files[f"{slug}.html"] = render(slug, meta, body, layout)
        if meta.get("noindex") != "yes": pages.append(slug)
    urls = "".join(f"  <url><loc>{BASE if s == 'index' else BASE + s + '.html'}</loc></url>\n" for s in pages)
    files["sitemap.xml"] = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n'
    files["robots.txt"] = f"User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n"
    fav = icons.logo_svg(64).replace('fill="currentColor"', 'fill="#3B5545"')
    files["assets/favicon.svg"] = fav
    return files

def main():
    files = build()
    if "--check" in sys.argv:
        stale = [n for n, c in files.items() if not (ROOT / n).exists() or (ROOT / n).read_text() != c]
        if stale: raise SystemExit("out of date, run build/build.py: " + ", ".join(stale))
        print(f"ok: {len(files)} files up to date"); return
    for n, c in files.items():
        (ROOT / n).write_text(c)
    print(f"wrote {len(files)} files: " + ", ".join(sorted(files)))

if __name__ == "__main__":
    main()
