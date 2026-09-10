"""Extract the APM1 spreadsheet-export PDF into auditable JSON and CSV files.

The PDF positions each spreadsheet column at stable x coordinates. Parsing by
coordinates is more reliable than splitting the flattened text, which loses the
column boundaries. Nothing is published by this script.
"""

from __future__ import annotations

import csv
import hashlib
import json
import re
import sys
import unicodedata
from dataclasses import asdict, dataclass
from decimal import Decimal, InvalidOperation
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "fontes" / "LOTES-APM1.pdf"
OUTPUT_DIR = ROOT / "data" / "imports" / "lote-apm1"

CATEGORY_HEADINGS = {
    "BORRACHAS": "Borracha e vedação",
    "CALHAS": "Calhas",
    "FAROL / LANTERNA/LENTE": "Iluminação",
    "RETROVISOR": "Retrovisores",
    "MOLDURA/PONTEIRA/GRADE": "Molduras e grades",
    "PARABARRO": "Para-barros",
}


@dataclass(frozen=True)
class ImportRow:
    source_page: int
    source_row: int
    category: str
    description: str
    manufacturer_code: str | None
    brand: str | None
    quantity: int | None
    source_price_cents: int | None
    sale_price_cents: int | None
    total_cents: int | None
    confidence: str
    issues: list[str]
    source_fingerprint: str
    internal_code: str
    slug: str


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def parse_money(value: str) -> int | None:
    numeric = re.sub(r"[^0-9,.]", "", value)
    if not numeric:
        return None
    if "," in numeric:
        numeric = numeric.replace(".", "").replace(",", ".")
    elif numeric.count(".") > 1:
        numeric = numeric.replace(".", "")
    try:
        decimal = Decimal(numeric)
    except InvalidOperation:
        return None
    return int((decimal * 100).quantize(Decimal("1")))


def normalize_code(value: str) -> str | None:
    value = compact(value).upper().replace(" ", "")
    return value or None


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")


def cluster_lines(words: list[dict]) -> list[list[dict]]:
    lines: list[list[dict]] = []
    for word in sorted(words, key=lambda item: (item["top"], item["x0"])):
        if not lines or abs(word["top"] - lines[-1][0]["top"]) > 2.1:
            lines.append([word])
        else:
            lines[-1].append(word)
    return [sorted(line, key=lambda item: item["x0"]) for line in lines]


def text_in_range(words: list[dict], start: float, end: float) -> str:
    return compact(" ".join(word["text"] for word in words if start <= word["x0"] < end))


def confidence_for(code: str | None, quantity: int | None, sale: int | None, total: int | None) -> tuple[str, list[str]]:
    issues: list[str] = []
    if not code:
        issues.append("missing_manufacturer_code")
    if quantity is None or quantity <= 0:
        issues.append("invalid_quantity")
    if sale is None or sale <= 0:
        issues.append("invalid_sale_price")
    if quantity and sale and total is not None and abs(total - quantity * sale) > 2:
        issues.append("total_mismatch")
    if any(issue.startswith("invalid_") or issue == "total_mismatch" for issue in issues):
        return "low", issues
    return ("high" if code else "medium"), issues


def extract_rows() -> list[ImportRow]:
    rows: list[ImportRow] = []
    category: str | None = None
    row_number = 0

    with pdfplumber.open(SOURCE) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            for words in cluster_lines(page.extract_words(use_text_flow=False, keep_blank_chars=False)):
                full_text = compact(" ".join(word["text"] for word in words))
                if full_text in CATEGORY_HEADINGS:
                    category = CATEGORY_HEADINGS[full_text]
                    continue
                if not category or "R$" not in full_text or full_text.startswith("TOTAL R$"):
                    continue

                description = text_in_range(words, 0, 270)
                if not description or description.startswith("DESCRI"):
                    continue

                code = normalize_code(text_in_range(words, 270, 343))
                brand = compact(text_in_range(words, 343, 400)).upper() or None
                quantity_text = text_in_range(words, 400, 425)
                quantity_match = re.search(r"\d+", quantity_text)
                quantity = int(quantity_match.group(0)) if quantity_match else None
                source_price = parse_money(text_in_range(words, 425, 470))
                sale_price = parse_money(text_in_range(words, 470, 495))
                total = parse_money(text_in_range(words, 495, 595.2))
                confidence, issues = confidence_for(code, quantity, sale_price, total)
                row_number += 1
                fingerprint_input = f"APM1|{page_number}|{row_number}|{description}|{code}|{sale_price}"
                rows.append(ImportRow(
                    source_page=page_number,
                    source_row=row_number,
                    category=category,
                    description=description,
                    manufacturer_code=code,
                    brand=brand,
                    quantity=quantity,
                    source_price_cents=source_price,
                    sale_price_cents=sale_price,
                    total_cents=total,
                    confidence=confidence,
                    issues=issues,
                    source_fingerprint=hashlib.sha256(fingerprint_input.encode("utf-8")).hexdigest(),
                    internal_code=f"APM1-{row_number:04d}",
                    slug=f"{slugify(description)[:120].rstrip('-')}-apm1-{row_number:04d}",
                ))
    return rows


def write_outputs(rows: list[ImportRow]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    payload = [asdict(row) for row in rows]
    (OUTPUT_DIR / "rows.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    with (OUTPUT_DIR / "rows.csv").open("w", newline="", encoding="utf-8-sig") as stream:
        writer = csv.DictWriter(stream, fieldnames=[field for field in asdict(rows[0]) if field != "issues"] + ["issues"])
        writer.writeheader()
        for row in payload:
            writer.writerow({**row, "issues": ",".join(row["issues"])})

    summary = {
        "source": str(SOURCE.relative_to(ROOT)),
        "sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "rows": len(rows),
        "by_category": {},
        "by_confidence": {},
        "with_code": sum(row.manufacturer_code is not None for row in rows),
        "total_cents": sum(row.total_cents or 0 for row in rows),
    }
    for row in rows:
        summary["by_category"][row.category] = summary["by_category"].get(row.category, 0) + 1
        summary["by_confidence"][row.confidence] = summary["by_confidence"].get(row.confidence, 0) + 1
    (OUTPUT_DIR / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    parsed_rows = extract_rows()
    if not parsed_rows:
        print("No product rows extracted", file=sys.stderr)
        raise SystemExit(1)
    write_outputs(parsed_rows)
