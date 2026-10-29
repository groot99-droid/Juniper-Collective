#!/usr/bin/env python3
"""Static checks over the built pages. Stdlib only. Exit 1 on any problem.

One h1 per page, no heading-level skips, every img has alt, every form control has a label,
no duplicate ids, and every internal link and #anchor resolves.
    python build/check_site.py
"""
import re, sys, pathlib, html.parser

ROOT = pathlib.Path(__file__).resolve().parent.parent

class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.ids = set(); self.dups = []; self.hrefs = []; self.h = []
        self.imgs = []; self.controls = []; self.labels = set(); self.in_label = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            if a["id"] in self.ids: self.dups.append(a["id"])
            self.ids.add(a["id"])
        if tag == "a" and "href" in a: self.hrefs.append(a["href"])
        if tag in ("h1", "h2", "h3", "h4"): self.h.append(int(tag[1]))
        if tag == "img": self.imgs.append(a)
        if tag == "label":
            self.in_label += 1
            if "for" in a: self.labels.add(a["for"])
        if tag in ("input", "select", "textarea") and a.get("type") != "hidden" and not self.in_label: self.controls.append(a)
    def handle_endtag(self, tag):
        if tag == "label" and self.in_label: self.in_label -= 1

def main():
    pages = {}
    for p in sorted(ROOT.glob("*.html")):
        q = Page(); q.feed(p.read_text()); pages[p.name] = q
    bad = 0
    for name, q in pages.items():
        probs = []
        if q.h.count(1) != 1: probs.append(f"{q.h.count(1)} h1")
        skips = [(a, b) for a, b in zip(q.h, q.h[1:]) if b > a + 1]
        if skips: probs.append(f"heading skips {skips[:3]}")
        probs += [f"img without alt: {i.get('src')}" for i in q.imgs if "alt" not in i]
        probs += [f"unlabelled control: {c.get('id') or c.get('name')}" for c in q.controls if c.get("id") not in q.labels]
        probs += [f"duplicate id: {d}" for d in q.dups]
        for h in q.hrefs:
            if re.match(r"(https?:|mailto:|tel:)", h): continue
            path, _, frag = h.partition("#"); target = path.split("?")[0] or name
            if not (ROOT / target).exists(): probs.append(f"broken link: {h}"); continue
            if frag and frag not in pages.get(target, Page()).ids: probs.append(f"missing anchor: {h}")
        print(f"{'ok  ' if not probs else 'FAIL'} {name}" + ("" if not probs else "  " + "; ".join(probs)))
        bad += bool(probs)
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
