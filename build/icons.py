"""Juniper Collective icon set. 24x24 grid, 1.5px stroke, round caps and joins, currentColor.
Hand-drawn for this site; no third-party icon set. Add an icon here and `{{icon:name}}` works in any page."""

ICONS = {
    "arrow-right": '<path d="M4 12h15M13 6l6 6-6 6"/>',
    "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
    "check": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    "menu": '<path d="M4 8h16M4 16h16"/>',
    "close": '<path d="m6 6 12 12M18 6 6 18"/>',
    "mail": '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7.5 8 6 8-6"/>',
    "pin": '<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10" r="2.2"/>',
    "lock": '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2"/>',
    "compass": '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    "swatch": '<path d="M12 3.5c3 3.5 6 6.2 6 9.7a6 6 0 0 1-12 0c0-3.5 3-6.2 6-9.7Z"/><path d="M9.5 14a2.8 2.8 0 0 0 2.5 2"/>',
    "signal": '<path d="M4 14v-4l10-5v14L4 14Z"/><path d="M17.5 9.5a3.5 3.5 0 0 1 0 5M6.5 14.5 8 19h2.5"/>',
    "door": '<path d="M6 20V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V20M4 20h16"/><circle cx="14.5" cy="12.5" r=".7" fill="currentColor"/>',
    "stewardship": '<path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6l-7-2.5Z"/><path d="m9 12 2.2 2.2L15.2 10"/>',
    "diagnostic": '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5M8 12.5v-2M10.5 12.5v-4M13 12.5v-3"/>',
    "thesis": '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="6" r="1.8"/><circle cx="12" cy="20" r="1.5"/><path d="m6.5 7.2 3.4 3.3M17.5 7.2l-3.4 3.3M12 14.5v4"/>',
    "nodes": '<path d="M3 20h18"/><path d="M5 20v-8l3-2.5L11 12v8"/><path d="M13 20V8l3.5-3L20 8v12M16.5 20v-4"/>',
    "economics": '<path d="M4 19V5M4 19h16"/><path d="m7 15 3.5-4 3 2.5L19 7"/><path d="M15 7h4v4"/>',
    "culinary": '<path d="M3.5 18h17"/><path d="M5 18a7 7 0 0 1 14 0"/><path d="M12 11V8.5"/><circle cx="12" cy="7.3" r="1.1"/>',
    "design": '<path d="m12 3 5 8-5 10-5-10 5-8Z"/><circle cx="12" cy="11" r="1.4"/><path d="M12 12.4V21"/>',
    "systems": '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="m7.5 9.5 3 2.5-3 2.5M13 15h4"/>',
    "spatial": '<path d="M8 3.5h8l2.5 8h-13l2.5-8Z"/><path d="M12 11.5V19M8.5 20.5h7"/>',
    "overview": '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="4" rx="1.5"/><rect x="13" y="10" width="7" height="10" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/>',
    "feed": '<path d="M4 6h10M4 12h16M4 18h12"/><circle cx="19" cy="6" r="1.4" fill="currentColor"/>',
    "log": '<path d="M12 6c-2-1.5-4.5-2-8-2v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2Z"/><path d="M12 6v14"/>',
    "milestone": '<path d="M6 21V4"/><path d="M6 5h11l-2.5 4L17 13H6"/>',
    "folder": '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4.5l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18V7.5Z"/>',
    "support": '<path d="M4 5.5h10a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H8.5L5 16v-2.5H4A1.5 1.5 0 0 1 2.5 12V7A1.5 1.5 0 0 1 4 5.5Z"/><path d="M18 9h2a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5v2.5L17 17h-4.5"/>',
    "sprig": '<path d="M12 21V9"/><path d="M12 9c0-3 2-5 5-5 0 3-2 5-5 5Z"/><path d="M12 14.5c0-2.6-1.8-4.4-4.5-4.4 0 2.6 1.8 4.4 4.5 4.4Z"/>',
    "volume": '<path d="M4 10v4h3.5L12 18V6L7.5 10H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    "volume-off": '<path d="M4 10v4h3.5L12 18V6L7.5 10H4Z"/><path d="m16 9.5 4.5 5M20.5 9.5l-4.5 5"/>',
}

# The mark: a windswept juniper on a ledge. Fills use currentColor; the ledge is a second tone via opacity.
LOGO_MARK = (
    # ledge: a slab of rock the tree has rooted into
    '<path d="M2 57v-6h30c7 0 11-3 14-7l16 5v8H2Z" opacity=".5"/>'
    # trunk and two branches: stroked, leaning with the wind
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M25 51c5-5 1-10 4-16 2.5-5 6-8 7-15" stroke-width="3.6"/>'
    '<path d="M28 39c-3-1.5-6-1.5-9-4.5" stroke-width="2.2"/>'
    '<path d="M33 29c4.5-.5 7.5-3 10-7" stroke-width="2.2"/>'
    '</g>'
    # foliage: cloud-pruned pads, flat underneath, stacked and swept to the right
    '<g>'
    '<ellipse cx="16" cy="32" rx="9.5" ry="4.6" transform="rotate(-6 16 32)"/>'
    '<ellipse cx="25" cy="23" rx="9" ry="4.4" transform="rotate(-8 25 23)"/>'
    '<ellipse cx="46" cy="19.5" rx="11" ry="4.8" transform="rotate(-10 46 19.5)"/>'
    '<ellipse cx="38" cy="10.5" rx="9" ry="4.4" transform="rotate(-8 38 10.5)"/>'
    '</g>'
)

def sprite():
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">']
    for name, body in ICONS.items():
        parts.append(f'<symbol id="i-{name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                     f'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{body}</symbol>')
    parts.append(f'<symbol id="logo-mark" viewBox="0 0 64 64" fill="currentColor">{LOGO_MARK}</symbol>')
    parts.append('</svg>')
    return "".join(parts)

def logo_svg(size=64):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="{size}" height="{size}" '
            f'fill="currentColor">{LOGO_MARK}</svg>')

if __name__ == "__main__":
    import sys
    print(sprite() if len(sys.argv) < 2 else logo_svg())
