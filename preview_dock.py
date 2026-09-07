"""Shared canonical comparison pill for the Collect & Connect previews."""

from html import escape

VARIANT_DOMAINS = {
    "a": "https://collect-connect-a.sololink.cloud",
    "b": "https://collect-connect-b.sololink.cloud",
    "c": "https://collect-connect-c.sololink.cloud",
}
VARIANT_NAMES = {
    "a": "Safe / Trust-first",
    "b": "Modern / Conversion-first",
    "c": "Bold / Differentiated",
}
ASSET_VERSION = "20260907-v7-pill"


def route_for_file(filename: str) -> str:
    return "/" if filename == "index.html" else f"/{filename}"


def render(variant: str, filename: str) -> str:
    route = route_for_file(filename)
    links = []
    for key, domain in VARIANT_DOMAINS.items():
        name = escape(VARIANT_NAMES[key], quote=True)
        active = " is-active" if key == variant else ""
        current = ' aria-current="page"' if key == variant else ""
        label = f"Design {key.upper()}: {name}"
        links.append(
            f'<a class="preview-design{active}" href="{domain}{route}"{current} '
            f'title="{label}" aria-label="{label}">{key.upper()} '
            f'<span class="preview-design-name">({name})</span></a>'
        )
    return (
        '<aside class="preview-dock" aria-label="Collect &amp; Connect preview comparison">\n'
        '  <nav class="preview-dock-inner" aria-label="Preview designs">\n'
        '    <span class="preview-group-label">VARIANT:</span>\n'
        f'    {"".join(links)}\n'
        '    <span class="preview-dock-divider" aria-hidden="true"></span>\n'
        '  </nav>\n'
        '</aside>'
    )
