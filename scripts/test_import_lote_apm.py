"""Regression checks for the APM1 source parser."""

import unittest

from scripts.import_lote_apm import extract_rows, parse_money


class ImportLoteApmTest(unittest.TestCase):
    def test_brazilian_money(self) -> None:
        self.assertEqual(parse_money("R$ 1.234,56"), 123456)
        self.assertEqual(parse_money("R$ 9,90"), 990)
        self.assertIsNone(parse_money("-"))

    def test_source_reconciliation(self) -> None:
        rows = extract_rows()
        self.assertEqual(len(rows), 637)
        self.assertEqual(sum(row.total_cents or 0 for row in rows), 6_573_970)
        self.assertEqual(sum(row.confidence == "high" for row in rows), 498)
        self.assertEqual(sum(row.confidence == "medium" for row in rows), 139)
        self.assertFalse(any(row.confidence == "low" for row in rows))
        self.assertEqual(len({row.source_fingerprint for row in rows}), 637)
        self.assertEqual(len({row.internal_code for row in rows}), 637)


if __name__ == "__main__":
    unittest.main()
