"""Download researched product photos and preserve a source manifest."""

from __future__ import annotations

import json
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "data" / "product-image-sources.json"
OUTPUT = ROOT / "public" / "images" / "products"


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    records = json.loads(SOURCES.read_text(encoding="utf-8"))
    for record in records:
        destination = OUTPUT / f"{record['slug']}.jpg"
        request = urllib.request.Request(record["url"], headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                data = response.read()
            if len(data) < 5_000:
                raise ValueError("response is too small to be a product image")
            destination.write_bytes(data)
            print(f"ok {record['slug']} {len(data)}")
        except Exception as error:
            print(f"failed {record['slug']}: {error}")


if __name__ == "__main__":
    main()
