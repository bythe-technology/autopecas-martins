"""Build a reviewed candidate image URL list from Bing image results.

The output is intentionally a candidate queue: URLs are sourced from the
search result metadata and are not silently published as product images.
"""
import html
import json
import re
import time
from pathlib import Path
from urllib.parse import quote

import requests

ROOT = Path(__file__).resolve().parents[1]
rows = json.loads((ROOT / "data/imports/lote-apm1/rows.json").read_text(encoding="utf-8"))
output = ROOT / "data/product-image-candidates.json"
session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; AutoPecasMartinsCatalog/1.0)"})
existing = {item["slug"]: item for item in json.loads(output.read_text(encoding="utf-8"))} if output.exists() else {}

for index, row in enumerate(rows, 1):
    slug = row["slug"]
    if slug in existing:
        continue
    query = f"auto peça {row['description']} {row.get('brand') or ''}".replace("<", " ")
    try:
        text = session.get(f"https://www.bing.com/images/search?q={quote(query)}", timeout=8).text
        urls = [html.unescape(url) for url in re.findall(r'murl&quot;:&quot;(https?://.*?)&quot;', text)]
        existing[slug] = {"slug": slug, "query": query, "candidates": urls[:5], "status": "pending_review"}
    except requests.RequestException as error:
        existing[slug] = {"slug": slug, "query": query, "candidates": [], "status": f"error:{type(error).__name__}"}
    if index % 10 == 0:
        output.write_text(json.dumps(list(existing.values()), ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{index}/{len(rows)}")
    time.sleep(0.05)

output.write_text(json.dumps(list(existing.values()), ensure_ascii=False, indent=2), encoding="utf-8")
print(f"saved {len(existing)} candidates to {output}")
