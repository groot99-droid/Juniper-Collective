# Client portal: specification and build plan

Status: not built. The public pages describe it and the illustration uses sample data. This document is the starting point for building it.

## What the owner asked for
All of these, for every engagement: project status and milestones; read and approve decisions; open shared documents; book a session; message the team; see concept renders; pay invoices; sign agreements. Access for the founder or owner, investors, architects and designers, the general manager, lenders and legal counsel. Payment by card, with retainers billed monthly. Client information is commercially confidential.

## Why it needs a server
The site is static, so it has no sign-in, no private storage and no way to take a payment. Everything above needs those. Client data must not go in the public repositories.

## Recommended shape
Build it as a separate private application, not inside this repository.

| Concern | Proposal | Why |
|---|---|---|
| Hosting | Railway (already used for other projects) | Managed Postgres, private networking, simple deploys |
| App | One web app with server-rendered pages | Fewer moving parts to secure than a single-page app plus API |
| Sign-in | Email magic link plus an optional passkey; invite-only | No passwords to leak; access is issued per person |
| Roles | owner, investor, design, operations, lender, counsel, team | Per-person scopes, set per engagement |
| Documents | Object storage, private, short-lived signed links | Never public URLs |
| Decisions | Append-only log: proposal, approver, time, reasoning | The portal's core promise: what was decided stays decided |
| Messages | Threads attached to a decision or document | Context stays with the thing discussed |
| Booking | Google Calendar availability read from the firm's calendar | Already in use; avoids a second scheduler |
| Payments | Stripe Checkout and Stripe Billing for monthly retainers | Cards and subscriptions without holding card data |
| Signatures | A hosted e-signature provider | Legally recognized signing with an audit trail |
| Renders | Uploaded images and video attached to a milestone | Reviewed and answered in the decision log |

## Security requirements before any real client data
- Written data-handling terms in the engagement agreement, reviewed by counsel.
- Every request authorised by role and engagement on the server, with tests for each role.
- Audit log of who viewed or changed what.
- Encrypted backups, tested restore, and a retention and deletion policy.
- No client data in logs, analytics, or this repository.
- A named person responsible for access requests and incidents.

## Phasing
1. **Record only.** Invite-only sign-in, one engagement view with milestones, a decision log and a document room.
2. **Conversation.** Message threads, concept renders, session booking.
3. **Money.** Invoices, card payments, monthly retainer billing, agreements to sign.
4. **Roles.** Investor, lender and counsel views with scoped access.

## Open decisions
See `OPEN-QUESTIONS.md`, Portal section. The most urgent: who may see what, and which payment and signature providers.
