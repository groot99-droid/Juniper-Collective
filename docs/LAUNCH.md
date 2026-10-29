# Launch checklist

The site is static and publishes to GitHub Pages from Actions. Going live on a real address takes about an hour, plus DNS waiting time. Do the steps in order.

## 1. Register the domain
Register `junipercollective.co` (or the chosen domain) with any registrar. Use the LLC's legal name and a role email as the registrant. Turn on registrar lock and auto-renew.

## 2. Set up email on the domain (Google Workspace)
1. Create a Workspace account for the domain and verify ownership with the TXT record Google gives you.
2. Add the MX records Google gives you at the registrar. Remove any default MX records first.
3. Create the mailbox `inquiries@` and any aliases (`hello@`, `portal@`).
4. Add SPF (TXT) and DKIM (Workspace admin, Gmail, Authenticate email), then a DMARC TXT record: `_dmarc` with `v=DMARC1; p=none; rua=mailto:inquiries@<domain>`. Tighten `p=` after a few weeks of clean reports.
5. Send a test message in and out. Every form on the site opens a message to `inquiries@junipercollective.co`, so until this works, nothing a visitor writes arrives.

## 3. Point the domain at GitHub Pages
In the registrar's DNS:
- Apex (`junipercollective.co`): four `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
- `www`: a `CNAME` to `groot99-droid.github.io`.

Then in the repository: Settings, Pages, Custom domain. Enter the domain, save, wait for the DNS check, and tick **Enforce HTTPS** once it appears.

## 4. Tell the site its new address
Edit `src/site-url.txt` so it holds the new origin, for example `https://junipercollective.co` (no trailing slash). Run:

```
python3 build/build.py
python3 build/check_site.py
```

Commit the rebuilt files. This updates canonical links, Open Graph tags and the sitemap. If the domain differs from `junipercollective.co`, also replace that address in `src/layout.html`, the page sources, `docs/` and the form code in `assets/js/site.js`.

## 5. Before announcing
- [ ] Submit the sitemap in Google Search Console.
- [ ] Have counsel review `terms.html` and `privacy.html`, then remove their "Draft" banners.
- [ ] Settle or remove each item in `CONTENT-TO-CONFIRM.md`.
- [ ] Add founder photos (`assets/img/team/`) and Reserve photos.
- [ ] Confirm the Reserve may be named and the Travel + Leisure ranking is current.
- [ ] Test every form from a phone: the email app should open addressed to the real mailbox.
- [ ] Open the site in Safari and on an iPhone. The intro has only been tested in Chromium.

## What is not live
The client portal, calendar booking, invoicing and e-signature do not exist yet. The pages say so. See `PORTAL-SPEC.md`.
