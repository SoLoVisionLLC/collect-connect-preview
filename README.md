# Collect & Connect — Preview Variants A/B/C

Static preview site variants for Collect & Connect LLC (Fostoria, OH) — video games and collectibles.

- `variants/a` — Safe / Trust-first → https://collect-connect-a.sololink.cloud
- `variants/b` — Modern / Conversion-first → https://collect-connect-b.sololink.cloud
- `variants/c` — Bold / Differentiated → https://collect-connect-c.sololink.cloud

Each variant is an independent nginx:alpine build target rooted at its own directory
(Coolify base directory = `/variants/<x>`). All routes ship with `noindex, nofollow`.

## Routes per variant

Home (`index.html`), Shop Categories, Sell or Trade, New Arrivals, About, Visit.
Events & Giveaways omitted — no dated/current event sources at build time.

## Media manifest

- Storefront photo (press): Fostoria Free Press — credit "Photo: Fostoria Free Press".
- Ribbon-cutting cover (Chamber): Fostoria Area Chamber of Commerce & Visitors Bureau.
- Logo: none public; typographic wordmark used. See SOURCE-MEDIA-MANIFEST.md.

All copy is contact-first: no invented prices, stock counts, checkout, shipping,
policies, testimonials, or events. Call 419-701-7008 for anything availability-related.
