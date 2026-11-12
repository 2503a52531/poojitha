GLOBAL FLOOD DISASTER MANAGEMENT — COMPLETE DAV PROJECT
==========================================================

WHAT IS INCLUDED
1. Global_Flood_Original.csv  — your uploaded source data, copied unchanged.
2. clean_data.py              — Python data-cleaning program.
3. requirements.txt           — Python dependency.
4. index.html                 — interactive dashboard (reads cleaned CSV).
5. README.txt                 — these instructions.

IMPORTANT DATA DETAILS
- Source dataset: 4,308 records and 12 columns.
- REAL columns: Deaths_REAL, Injured_REAL, Total_Affected_REAL.
- SIMULATED columns: relief camps, sheltered people, damaged houses,
  food, water and medical kits.
- Simulated values must be described as estimates, not verified outcomes.
- Cleaning does not guess missing values or replace them with zero.
- Original CSV is never overwritten.

PART A — OPEN PROJECT IN VS CODE
1. Download this ZIP.
2. On your laptop, open Downloads.
3. Right-click the ZIP > Extract All.
4. Open VS Code.
5. Click File > Open Folder.
6. Select the extracted folder named Global_Flood_DAV_Complete_Project.
7. In VS Code Explorer, confirm you can see the files listed above.

PART B — RUN DATA CLEANING
1. In VS Code, click Terminal > New Terminal.
2. Confirm the terminal path is the project folder.
3. Install pandas:
      python -m pip install -r requirements.txt
   If Windows says python is not found, try:
      py -m pip install -r requirements.txt
4. Run the cleaning program:
      python clean_data.py
   If needed, use:
      py clean_data.py
5. Wait for DATA CLEANING COMPLETED.
6. Two new files should appear:
      Global_Flood_Cleaned.csv
      Cleaning_Report.txt
7. Open Cleaning_Report.txt and check missing values and duplicate counts.
8. Keep the original CSV unchanged.

PART C — OPEN THE INTERACTIVE DASHBOARD
IMPORTANT: Run Part B first so Global_Flood_Cleaned.csv exists.
1. In VS Code Explorer, right-click index.html.
2. Choose Open with Live Server.
3. Your browser opens the dashboard.
4. Try the Year dropdown.
5. Try the Country dropdown.
6. Search by country name or Record_ID.
7. Click Reset filters to clear selections.
8. Scroll down to explore the record table.

IF LIVE SERVER IS NOT AVAILABLE
1. Open Terminal in the project folder.
2. Run:
      python -m http.server 8000
   or:
      py -m http.server 8000
3. Open your browser and enter:
      http://localhost:8000
4. Open index.html from the local server page.

IF DASHBOARD SAYS CSV LOAD ERROR
- Make sure clean_data.py ran successfully.
- Make sure Global_Flood_Cleaned.csv is in the same folder as index.html.
- Make sure you opened the page through Live Server or localhost, not by double-clicking the HTML file.
- Internet is needed for the Chart.js and PapaParse CDN libraries.

PART D — WHAT TO SHOW IN YOUR DAV DEMO
1. Show the original CSV.
2. Show clean_data.py code.
3. Run the code in terminal.
4. Open Cleaning_Report.txt and explain the cleaning checks.
5. Open Global_Flood_Cleaned.csv.
6. Start index.html in browser.
7. Demonstrate year filter, country filter and search.
8. Explain the REAL vs SIMULATED distinction.

PROJECT STRUCTURE AFTER CLEANING
Global_Flood_DAV_Complete_Project/
  Global_Flood_Original.csv
  Global_Flood_Cleaned.csv
  Cleaning_Report.txt
  clean_data.py
  requirements.txt
  index.html
  README.txt

NOTE
This is a front-end dashboard and a local Python cleaning workflow.
It does not alter your Excel workbook or overwrite the source CSV.
