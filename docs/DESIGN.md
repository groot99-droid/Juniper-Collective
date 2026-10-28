# Design record

How the redesign was reasoned, using the ui-design toolkit (`plugins/ui-design` in the Pipelines-Plugin repo). Nothing was persisted into that repo; commands were run read-only.

## Dissecting the original page
| # | Finding | Catalog area | Now |
|---|---|---|---|
| 1 | No mobile navigation: the nav was `hidden lg:flex` with no menu button | ux / Navigation | Menu button, `aria-expanded`, Esc closes, focus returns |
| 2 | Footer and "Terms", "Privacy" links went to `#`; "Enter Portal" and "Begin a diagnostic" went to sections of the same page | ux / Navigation | Every link leads to a real page |
| 3 | The contact form faked success ("Request Received") and sent nothing | ux / Forms | Honest forms: they open the visitor's email app, and say so |
| 4 | Small labels in Alpine green (3.6:1) and a 60%-opacity footer note (3.7:1) | ux / Accessibility (4.5:1) | Olive labels (5.7:1); footer text 7:1 or better |
| 5 | Labels at 10-11px | Typography (12px floor) | Smallest label is 12px |
| 6 | Icons from an icon font (Material Symbols), shown as ligature text until loaded | style / SVG icons | Inline SVG sprite, `aria-hidden` |
| 7 | Tailwind from a CDN in production; images hot-linked from a third-party host, with no width or height | Performance (CLS, WebP, lazy) | Own CSS; local WebP with `srcset`, width and height, lazy below the fold |
| 8 | No skip link, no visible focus style, no reduced-motion handling | ux / Accessibility | All three |
| 9 | The portal "screenshot" was a generated picture of a UI | Honesty | A built, labelled illustration with sample data |

## Routing the brief
`route.py "boutique hospitality advisory firm ... premium, calm, editorial, trustworthy, with a client portal" --stack html-tailwind` returned **AMBIGUOUS** and **CLOSE-CALL** between *Hotel/Hospitality* and *Luxury/Premium Brand*. I read both rows. Chosen: **Hotel/Hospitality** (it names the audience), borrowing *Luxury*'s storytelling landing pattern.

- **Style:** Liquid Glass (primary row), with Minimalism & Swiss. Used for the header and the cards over photographs: translucent, blurred, with a solid fallback where `backdrop-filter` is unsupported.
- **Pattern:** the catalog's "Hero + Testimonials + CTA" does not apply, because there are no testimonials and none were invented. The storytelling pattern is used instead (hook, chapters, climax call to action).
- **Dials:** variance 4, motion 4, density 3 (spacious). Motion is a quiet reveal on scroll, switched off for reduced-motion.
- **Not adopted:** the suggested navy and gold palette and the Playfair pairing. The author's own green, marine and rose, and Cormorant with Manrope, are the brand.
- **Anti-patterns the catalog names for this product:** "poor photos", "complex booking". Photography is the main image budget; the only call to action is an email.

## Checks run
Every page, at 1440px and 390px: no horizontal overflow, no broken images, one `h1`, no heading-level skips, every image has `alt`, every input has a label, no duplicate ids, every internal link and anchor resolves (`build/check_site.py`, which also gates the deploy). Interaction: mobile menu, form validation (including the correct-then-submit path), FAQ, the intro (first visit and returning visit).
