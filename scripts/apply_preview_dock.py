#!/usr/bin/env python3
"""Apply the shared v7 comparison pill to every static preview route."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from preview_dock import ASSET_VERSION, render

DOCK_CSS = r'''
/* Canonical v7 comparison pill: shared across the three preview variants. */
.preview-dock{position:fixed;z-index:30;left:50%;bottom:16px;width:max-content;max-width:calc(100vw - 24px);height:34px;transform:translateX(-50%);border-radius:999px;background:#252525;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.24);font:500 11px/1.2 system-ui,sans-serif}
.preview-dock-inner{display:flex;align-items:center;gap:2px;height:100%;padding:2px 4px;overflow-x:auto;scrollbar-width:none;white-space:nowrap}
.preview-dock-inner::-webkit-scrollbar{display:none}
.preview-group-label{flex:0 0 auto;margin:0 5px;color:#bdbdbd;font-size:10px;font-weight:700;letter-spacing:.06em}
.preview-design{display:inline-flex;align-items:center;justify-content:center;gap:4px;min-width:44px;min-height:28px;height:28px;padding:0 10px;border-radius:999px;color:#fff;text-decoration:none;white-space:nowrap;transition:background-color .15s ease,color .15s ease}
.preview-design-name{font:inherit}.preview-design:hover{background:rgba(255,255,255,.12);color:#fff}.preview-design.is-active{background:#BC2026;color:#fff}
.preview-dock-divider{flex:0 0 1px;width:1px;height:16px;background:rgba(255,255,255,.28)}
.preview-dock a:focus-visible{outline:2px solid #BC2026;outline-offset:-3px}
@media(max-width:520px){.preview-dock{bottom:70px;max-width:calc(100vw - 16px)}.preview-group-label{display:none}.preview-design{padding-inline:9px}}
@media(prefers-reduced-motion:reduce){.preview-design{transition:none}}
'''

for variant in ("a", "b", "c"):
    variant_root = ROOT / "variants" / variant
    css = variant_root / "styles.css"
    content = css.read_text()
    if ".preview-dock{" not in content:
        css.write_text(content.rstrip() + "\n" + DOCK_CSS)
    elif ".preview-dock-divider" not in content:
        css.write_text(content.rstrip() + "\n.preview-dock-divider{flex:0 0 1px;width:1px;height:16px;background:rgba(255,255,255,.28)}\n")
    for page in sorted(variant_root.glob("*.html")):
        content = page.read_text()
        if 'styles.css?v=' not in content:
            content = content.replace('href="styles.css"', f'href="styles.css?v={ASSET_VERSION}"')
        if 'class="preview-dock"' not in content:
            marker = '<div class="mobile-bar">'
            insert_before = marker if marker in content else '</body>'
            if insert_before not in content:
                raise SystemExit(f"missing body in {page}")
            content = content.replace(insert_before, render(variant, page.name) + "\n\n" + insert_before, 1)
        elif 'preview-dock-divider' not in content:
            content = content.replace('  </nav>\n</aside>', '    <span class="preview-dock-divider" aria-hidden="true"></span>\n  </nav>\n</aside>', 1)
        page.write_text(content)
