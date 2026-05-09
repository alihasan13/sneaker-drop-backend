ALTER TABLE "inventory"
  ADD CONSTRAINT inventory_no_oversell
  CHECK (
    "reservedStock" >= 0 AND
    "soldStock" >= 0 AND
    ("reservedStock" + "soldStock") <= "totalStock"
  );