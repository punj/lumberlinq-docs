# LumberLinq Knowledge Base — Tally Sheets

## What is a Tally Sheet and Why is it Used?

A tally sheet is the core measurement record in LumberLinq. It is a digital log of individual timber piece measurements — either round logs or sawn/square timber. Every tally sheet belongs to a Transport Unit (TU), which represents the physical container, truck, or vessel holding the timber. When you create a tally sheet you are recording how many logs or boards are in a TU, their individual dimensions, and the resulting total volume in CBM (cubic metres) and CFT (cubic feet).

Tally sheets are used for volume calculation at source, export documentation, inventory tracking, and reconciliation against buyer or surveyor tallies. The data flows into shipment reports, inventory ledgers, and shareable links for buyers and third parties to review remotely.

## Round Tally vs Square Tally — Key Differences

LumberLinq has two tally types and they cannot be mixed in the same Transport Unit:

**Round Tally** is for round, unprocessed logs. Each row captures:
- Length (default unit: centimetres)
- Girth (circumference, default unit: centimetres)
- Calculated volume per log: Volume = π × (Girth ÷ 4)² × Length
- Net volume = Gross minus any configured Length or Girth allowance

**Square (Sawn) Tally** is for sawn, dressed, or rectangular timber boards. Each row captures:
- Width (default unit: inches)
- Thickness (default unit: inches)
- Length (default unit: feet)
- Pieces (how many boards of that dimension in this batch)
- Gross CFT = (Width × Thickness × Length × Pieces) ÷ 144
- CBM = CFT ÷ 35.3147

The tally type is determined by the Product you select when creating the Transport Unit. A Round Log product opens a Round tally grid; a Square/Sawn product opens a Square grid. You cannot switch tally type after the TU is created — if you need a different type, create a new TU with the correct product.

## How to Create a Tally Sheet — Step by Step

1. Go to **Tally Sheets** from the main menu, then click **New Tally Sheet**.
2. Fill in the Transport Unit header: Transport ID (your reference, e.g., truck number or container ID), Product (determines round vs square), Transport Mode (truck, vessel, rail, etc.), and Loading Site.
3. Save the Transport Unit. The measurement grid opens automatically.
4. Enter each log or board as a row. For round: type Length and Girth. For square: type Width, Thickness, Length, and Pieces. Volume calculates in real time.
5. The status bar at the bottom shows unsaved row count. Click **Save** regularly or when finished. The status bar confirms all rows are saved.
6. Continue adding rows until all timber in the TU is measured.

To view all your Transport Units go to **Tally Sheets → View Transport Units**.

## The Measurement Grid — How to Work Efficiently

The tally sheet uses an editable data grid (AG-Grid). Each row is one log (round) or one batch of boards at the same dimensions (square). Working efficiently in the grid:

- **Add a row**: click the + icon in the row action column, or press Enter at the last row
- **Delete a row**: use the delete icon in the row action column; confirmation is not required
- **Navigate cells**: Tab moves right across columns, Enter/arrow keys move between rows
- **Undo / Redo**: toolbar buttons reverse or reapply recent changes before saving — use this instead of manually deleting and re-entering wrong values
- **Go to Row**: jump to any row number directly — essential when working with tally sheets that have 100+ entries
- **Choose Columns**: hide or show specific measurement and volume columns; changes are saved per session

Volume columns (Gross CBM, Net CBM, Gross CFT, Net CFT) update as you type. You do not need to save to see the totals — the status bar reflects the current in-memory sum.

## Status Bar — Reading the Indicators

The status bar is pinned to the bottom of the tally sheet screen. It is always visible while entering data. From left to right it shows:

- **Row count**: total number of measurement entries in the current tally
- **Gross CBM / Gross CFT**: live total volume, recalculated with every keystroke
- **Unsaved rows**: number of rows with changes not yet written to the server. If this is non-zero do not close the tab.
- **Save progress**: spinner that appears during the save operation
- **Saved state**: green checkmark confirmation when all rows are committed to the database
- **Readiness**: overall readiness indicator for the tally sheet

Best practice: after each session of data entry, confirm the unsaved count is 0 before switching to another module.

## Tally Settings — Every Option Explained

Open Settings (the gear icon in the toolbar) to configure how the tally behaves. These settings are saved per tally sheet and affect both validation and volume calculations.

**Round Tally Settings:**

- **Divisible by 5** — When enabled, rejects Length values that are not multiples of 5. This is used in markets where logs are graded in 5cm increments.
- **Length Range (min / max)** — Any Length entry outside this range triggers a validation error. Set this to the realistic range for your timber to catch keying mistakes (e.g., entering 500 when you meant 50).
- **Girth Range (min / max)** — Same as Length Range but for Girth measurements.
- **Length UoM** — Unit of measure for Length: centimetres, millimetres, inches, or feet. Changing this recalculates all volume.
- **Girth UoM** — Unit of measure for Girth: centimetres, millimetres, or inches.
- **Decimal Places** — How many decimal places to show for volume totals (0 to 4). Does not affect input precision.
- **Rounding Direction** — Whether to round volume results up, down, or to nearest. Affects Net values only.
- **Copy Previous Row Length** — When adding a new row, pre-fills the Length field with the value from the previous row. Saves time when many consecutive logs are the same length.
- **Add to Length (increment)** — When Copy Previous Length is on, automatically adds this fixed value to the copied length. Useful for staircase patterns where each successive log is slightly longer.
- **Length Allowance** — A percentage or fixed deduction subtracted from Gross Length when calculating Net volume. Used for outturn adjustments.
- **Girth Allowance** — Same as Length Allowance but applied to the Girth measurement.

**Square Tally Settings:**

- **Width UoM / Thickness UoM / Length UoM** — Unit of measure per dimension (inches, feet, cm, mm). All three can be set independently.
- **Decimal Places** — Same as round tally.
- **Rounding Direction** — Same as round tally.
- **Width Allowance / Thickness Allowance / Length Allowance** — Deductions from each dimension for Net volume calculation.
- **Visible Columns** — Choose which columns appear in the square grid (useful for hiding dimensions not relevant to your product).

Changing Settings after data has been entered recalculates all existing rows immediately. Always verify totals after changing UoM or allowances.

## Export — All Formats and When to Use Them

Click **Export** in the toolbar to open the export dialog.

- **Excel (.xlsx)**: full spreadsheet of all tally rows with summary totals, TU header information, and volume calculations. Best for reconciliation, internal analysis, or sending to surveyors and buyers who need editable data.
- **PDF**: formatted, printable document with company branding. Includes tally rows, volume summary, TU details, and optional watermark and logo. Use for banks, certification bodies, or official submissions.
- **Bundle**: packages the PDF tally report together with all uploaded TU photos and documents into a single ZIP file. Use when the recipient needs both the measurement data and photographic evidence.
- **Advanced**: opens the full export configuration dialog where you choose access level (Public / Protected / Private). This controls which columns and TU fields are included:
  - Public export: basic measurements and volume totals, no internal fields
  - Protected export: includes more detail such as TU reference and product information
  - Private export: includes all fields including internal notes and full party information

## Importing Tally Data — File Import and AI Import

**File Import (CSV or Excel):** Use this when measurements are recorded offline, in a legacy system, or by a field team using spreadsheets. The import dialog has three steps: (1) Configure — set the file format options; (2) Upload and Map — upload the file and match your column headers to LumberLinq fields; (3) Preview — review all rows before they are added. Imported rows appear in the grid and must be saved like manually entered rows.

**AI Import (Image-based):** Upload a photo of a handwritten tally sheet — a field notebook page, a printed form, or any document with rows of numbers. LumberLinq AI reads the image and extracts measurements automatically. Steps: upload the photo, review the AI-extracted rows in the preview, correct any misread values, then confirm import. Each image costs 5 AI credits. Credits are only deducted after successful extraction. AI Import requires the feature to be enabled on your subscription plan.

If AI Import is not available in your toolbar, your plan does not include this feature or it has been disabled by your administrator.

## Sharing a Tally Sheet with External Parties

Click **Share** on the tally sheet to create a shareable link. This is used when buyers, surveyors, or freight forwarders need to view the tally without a LumberLinq account.

Three access tiers:
- **Public link**: anyone with the URL can open it, no login required. Shows basic volume summary only.
- **Protected link**: recipient must sign into a LumberLinq account to view. Shows more detail.
- **Private link**: recipient must be logged in and belong to your organisation or an invited party. Shows all fields.

Share link options:
- **Expiry date**: the link automatically deactivates after this date
- **Download permission**: allow or block PDF download from the share view
- **Document access**: control whether uploaded documents are visible to the link recipient

Use Public links for buyers who do not have LumberLinq accounts. Protected and Private links are for team members, partner companies, or agents who are registered users.

## Transport Units — Full Explanation

A Transport Unit (TU) is the container that tally rows are grouped under. Think of it as the physical unit of transport — a container, a truck, a vessel hold, or a batch. Every tally sheet is part of exactly one TU.

Key TU fields:
- **Transport ID**: your reference number or code for this unit (e.g., MSCU1234567, Truck-42, Vessel Hold 3). Must be unique within your account.
- **Product**: determines whether the tally is Round or Square. Cannot be changed after the TU is saved.
- **Transport Mode**: Truck, Vessel, Rail, Air, or Other. Informational, used in reports.
- **Loading Site**: where the timber is physically located or being loaded from. Links to the Loading Sites module.
- **Photos**: upload site photos, stacking photos, or inspection photos. Photo count is shown in the TU list view and is included in Bundle exports.
- **Documents**: attach any documents specific to this TU (weighbridge tickets, site inspection reports, etc.).

View all TUs from **Tally Sheets → View Transport Units**. The list shows TU ID, product, loading site, photo count, tally row count, total volume, and status.

A TU must be received into inventory before it can be linked to a shipment. If the TU has not been received, go to Inventory → In/Out and record the receipt, then return to the shipment.

## Reconciliation Tab

The Reconciliation tab is available inside the tally sheet dashboard. It is used to compare your tally measurements against an external counter-tally such as a buyer's tally, a port surveyor's report, or a government inspection tally.

The reconciliation view shows:
- **Matched rows**: log entries where both tallies agree
- **Pending rows**: entries not yet compared
- **Discrepancies**: rows where measurements differ between your tally and the reference tally

Use reconciliation before finalising a shipment or settling a payment to ensure both parties agree on volume. Reconciliation results feed into the Reconciliation Report in the Reports module.

## Common Problems and How to Fix Them

**Cannot add the Transport Unit to a shipment**
The TU must be received into inventory first. Go to Inventory → In/Out, record the inward movement for this TU, then return to the shipment and add it. This is a data integrity protection — the system prevents shipping stock that has not been officially received.

**Volume looks wrong or too large/small**
Almost always a unit of measure mismatch. Open Settings and check Length UoM and Girth UoM (round) or Width/Thickness/Length UoM (square). If you entered values in centimetres but the setting is inches, the calculated volume will be wrong. Correct the UoM setting and the volume recalculates automatically.

**Validation error: value out of range**
You have configured a Length Range or Girth Range in Settings and an entry falls outside it. Either correct the measurement value or open Settings and widen the acceptable range.

**Copy Previous Length is not pre-filling**
Enable it in Settings → Copy Previous Row Length. It only applies when you click Add Row Below or press Enter — it does not backfill existing rows.

**Exported PDF has no photos**
Photos are only included in Bundle export format. PDF and Excel exports contain measurement data only. Use Export → Bundle to include TU photos in the download.

**AI Import ran but extracted incorrect data**
The AI reads handwritten text visually — poor lighting, smudged ink, or very small writing can reduce accuracy. Always review the Preview step and delete or correct wrong rows before confirming import. Credits are deducted after extraction, not after confirmation.

**The tally grid is slow with 200+ rows**
This is expected with very large tallies. Use Go to Row to jump directly to specific rows rather than scrolling. The grid handles large datasets but scrolling performance depends on your browser.

## How Tally Sheets Connect to Other LumberLinq Modules

- **Products**: the product on the TU determines tally type (Round or Square). Product also appears in tally and shipment reports.
- **Loading Sites**: each TU is linked to a loading site — the physical origin of the timber. Loading sites appear in the TU list and reports.
- **Inventory**: when a TU is received into inventory, its volume appears in the Inventory Overview and In/Out ledger. The TU status changes from pending to received.
- **Shipments**: after inventory receipt, TUs can be linked to shipments. One shipment can contain multiple TUs. The total CBM/CFT of linked TUs appears in the shipment.
- **Reports**: the Tally Report shows all tally sheet data with filters. The Transport Unit Report shows TU-level volume and status. The Reconciliation Report uses data from the Reconciliation tab.
- **Business Partners**: not directly linked on the tally sheet, but the shipment containing the TU references the shipper and consignee (Business Partners).
