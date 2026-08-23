# Delivery Receipt — Collect & Connect Preview Variants A/B/C (2026-08-23)

- Repo: https://github.com/SoLoVisionLLC/collect-connect-preview (branch main, pushed SHA 5d1101e; variant source dirs variants/a|b|c)
- Coolify project: Collect & Connect (uuid gexbn26o4nf9hze5vws0szy4, id 54), environment production (id 85)
- Apps: A b2xmvxsbskxtxurl6byl7m0x · B q7zkqwbvpulifkx3qpn5krzr · C tvpdeq918vcerwcncjcir69s (all dockerfile/nginx:alpine, base_directory /variants/<x>, port 80)
- Live URLs: A https://collect-connect-a.sololink.cloud · B https://collect-connect-b.sololink.cloud · C https://collect-connect-c.sololink.cloud — all HTTP 200, valid TLS
- Routes per variant: Home, Shop Categories, Sell or Trade, New Arrivals, About, Visit. Events & Giveaways omitted (no dated/current event sources at build time).
- noindex: X-Robots-Tag "noindex, nofollow" header on every response + meta robots on every page.
- Live HTML SHA256 (home): a=aad3a1d8…ed8, b=eded3470…da9, c=ae644c94…d81a — all distinct. Full per-route list in sha256-live.txt.
- Copy gates: verbatim offer sentence "Collect & Connect buys, sells, and trades video games and collectibles." present on Home + About of all variants; Chamber category tags and Shop Categories intro wording verbatim; banned-terms sweep clean (HTML visible text).
- Media manifest: see SOURCE-MEDIA-MANIFEST.md (wordmark used, press photo + Chamber ribbon-cutting cover with credits, social media linked not hotlinked). Variant C additionally uses ribbon-cutting cover for differentiation.
- QA captures: 18/18 passed — 390×844 DPR2 mobile emulation fullPage screenshots with scrollY=0, fonts loaded, images decoded, screenshot height ≥ document height; secondary 430×932 live check (no horizontal overflow, images OK). Manifest: captures/capture-manifest.json.
- QA page: https://app.solorecall.com/files/editor/4175fc51-bbe1-44fb-b98c-057ffcfdbb74 (each URL above its desktop+mobile screenshots, editable SoLo Notes callouts, SoLo General Feedback block).
- CRM row synced: consolidated Preview URL + Preview URL A/B/C + Preview Status "Preview Built" + Status "Waiting on SoLo".
