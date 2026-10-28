# Excel VLOOKUP & XLOOKUP Tips ...

**Category:** Office Productivity

---

## VLOOKUP Syntax

```
=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])
```

- **lookup_value** — what you’re searching for
- **table_array** — the range to search
- **col_index** — column number to return
- **range_lookup** — use `FALSE` for exact match

## Example

```
=VLOOKUP(A2, $D$2:$F$100, 2, FALSE)
```

## Common Errors

| Error | Meaning | Fix |
|-------|---------|-----|
| `#N/A` | Value not found | Check spelling; use IFERROR |
| `#REF!` | Column index too high | Reduce col_index |
| `#VALUE!` | Wrong data type | Ensure types match |

## Modern Alternative: XLOOKUP (Office 365)

```
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
```

More flexible: looks left, returns multiple columns, built-in error handling.

---
*Tags: excel, office, formulas*
