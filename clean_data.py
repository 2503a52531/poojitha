"""Global Flood dataset cleaner. Uses only Python's built-in libraries; no pandas needed."""
import csv
from pathlib import Path

FOLDER = Path(__file__).resolve().parent
SOURCE = FOLDER / 'Global_Flood_Original.csv'
OUTPUT = FOLDER / 'Global_Flood_Cleaned.csv'
REPORT = FOLDER / 'Cleaning_Report.txt'

EXPECTED = [
    'Record_ID', 'Country', 'Year', 'Deaths_REAL', 'Injured_REAL',
    'Total_Affected_REAL', 'Relief_Camps_SIMULATED',
    'People_Sheltered_SIMULATED', 'Houses_Damaged_SIMULATED',
    'Food_Requirement_kg_SIMULATED',
    'Water_Requirement_Litres_SIMULATED', 'Medical_Kits_SIMULATED'
]
NUMERIC = EXPECTED[2:]

def main():
    if not SOURCE.exists():
        raise FileNotFoundError(
            'Global_Flood_Original.csv not found. Keep it in the same folder as clean_data.py.'
        )

    with SOURCE.open('r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []
        missing_cols = [c for c in EXPECTED if c not in headers]
        if missing_cols:
            raise ValueError(f'Required columns missing: {missing_cols}')
        original_rows = list(reader)

    report = [
        'GLOBAL FLOOD DATA CLEANING REPORT',
        '=' * 42,
        f'Original rows: {len(original_rows)}',
        f'Original columns: {len(headers)}',
        'Cleaning library: Python built-in csv (pandas not required)',
        ''
    ]

    seen = set()
    cleaned = []
    duplicates_removed = 0
    negative_counts = {c: 0 for c in NUMERIC}
    invalid_number_counts = {c: 0 for c in NUMERIC}
    invalid_year_count = 0

    for source_row in original_rows:
        row = {c: (source_row.get(c) or '').strip() for c in EXPECTED}
        # Remove only exact duplicate records after trimming surrounding spaces.
        key = tuple(row[c] for c in EXPECTED)
        if key in seen:
            duplicates_removed += 1
            continue
        seen.add(key)

        for col in NUMERIC:
            value = row[col]
            if value == '':
                continue
            try:
                number = float(value.replace(',', ''))
                if number < 0:
                    negative_counts[col] += 1
                    row[col] = ''
                elif col == 'Year' and (not number.is_integer() or number < 1900 or number > 2100):
                    invalid_year_count += 1
                    row[col] = ''
                else:
                    row[col] = str(int(number)) if number.is_integer() else str(number)
            except ValueError:
                invalid_number_counts[col] += 1
                row[col] = ''

        cleaned.append(row)

    missing_counts = {c: sum(1 for r in cleaned if r[c] == '') for c in EXPECTED}

    with OUTPUT.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=EXPECTED)
        writer.writeheader()
        writer.writerows(cleaned)

    report += [
        f'Exact duplicate rows removed: {duplicates_removed}',
        f'Rows in cleaned dataset: {len(cleaned)}',
        '', 'Invalid negative numeric values changed to blank:'
    ]
    report += [f'  {c}: {n}' for c, n in negative_counts.items()]
    report += ['', 'Unparseable numeric values changed to blank:']
    report += [f'  {c}: {n}' for c, n in invalid_number_counts.items()]
    report += ['', f'Invalid years (not whole years 1900-2100) changed to blank: {invalid_year_count}',
               '', 'Blank values in cleaned output:']
    report += [f'  {c}: {n}' for c, n in missing_counts.items()]
    report += ['', 'DATA NOTE:',
               'REAL columns are recorded impact fields in the supplied dataset.',
               'SIMULATED columns are planning estimates, not verified real outcomes.',
               'Missing values are left blank; no disaster values are guessed or replaced with zero.',
               'The original CSV was not modified.',
               '', f'Cleaned file: {OUTPUT.name}']
    REPORT.write_text('\n'.join(report), encoding='utf-8')

    print('DATA CLEANING COMPLETED')
    print(f'Original rows: {len(original_rows)}')
    print(f'Cleaned rows: {len(cleaned)}')
    print(f'Exact duplicate rows removed: {duplicates_removed}')
    print(f'Created: {OUTPUT.name}')
    print(f'Created: {REPORT.name}')

if __name__ == '__main__':
    main()