# Tally Sheet User Manual: Round and Square

This guide covers verified LumberLinq Tally Sheet behavior from the captured VPS UI.

## Tally Sheet List

Open **Tallysheet > List Tallysheet** to view transport units and tally sheets. The list supports search, table columns, KPI cards, and row actions.

Screenshots:
- `../screenshots/round-list-page.png`
- `../screenshots/round-search-filter.png`
- `../screenshots/square-list-page.png`
- `../screenshots/square-search-filter.png`

## Create and Edit

Use **New Tallysheet** to create a transport unit and tally sheet. Required fields include Transport ID, Product, and Transport Mode. Product type determines whether the measurement grid opens as Round or Square.

Screenshots:
- `../screenshots/round-create.png`
- `../screenshots/round-edit.png`
- `../screenshots/square-create.png`
- `../screenshots/square-edit.png`

## Round Tally Sheet

Round tally sheets capture log measurements using Length and Girth. The grid automatically calculates gross and net CBM/CFT values. The captured demo sheet includes approximately 115 log entries.

Key areas:
- Measurement grid
- First records
- Middle records
- 100+ record dataset view
- Volume calculation columns
- Summary tab
- Empty tally sheet state

Screenshots:
- `../screenshots/round-entry-grid.png`
- `../screenshots/round-first-10-records.png`
- `../screenshots/round-middle-records-row-50.png`
- `../screenshots/round-large-dataset-100-plus.png`
- `../screenshots/round-volume-calculation.png`
- `../screenshots/round-summary.png`
- `../screenshots/round-empty-tally-sheet.png`

## Square Tally Sheet

Square tally sheets capture Width, Thickness, Length, and Pieces. The captured demo sheet includes 20 records and approximately 1200 total pieces. Fit screenshots were retaken with a wider capture layout so the main square columns are visible together.

Screenshots:
- `../screenshots/square-entry-grid-fit-all-columns.png`
- `../screenshots/square-width-thickness-length-pieces-entry-fit.png`
- `../screenshots/square-volume-calculation-fit.png`
- `../screenshots/square-large-piece-counts.png`
- `../screenshots/square-summary.png`

## Settings and Configuration

Use **Settings** to control validation rules, unit of measure, allowances, decimal precision, visible columns, and copy behavior.

Round settings include:
- Divisible by 5
- Length range
- Girth range
- Length UoM
- Girth UoM
- Decimals
- Copy Previous Length
- Add to Length
- Length and Girth Allowances
- Visible columns

Square settings include:
- Width UoM
- Thickness UoM
- Length UoM
- Decimals
- Width, Thickness, and Length Allowances
- Visible columns

Screenshots:
- `../screenshots/round-settings-validation-rules.png`
- `../screenshots/round-settings-configuration.png`
- `../screenshots/square-settings-configuration.png`

## Toolbar Features

The tally grid toolbar includes:
- Undo
- Redo
- Go to Row
- Choose Columns
- Export
- Import
- AI Import
- Save

The Export menu shows Excel, PDF, Bundle, and Advanced options.

Screenshots:
- `../screenshots/round-export-menu.png`
- `../screenshots/square-export-menu.png`

## Row Actions

Each editable grid row includes row actions for adding a row below and deleting a row. Copy Previous Length is controlled from Settings and applies when adding rows.

Screenshots:
- `../screenshots/round-row-actions-add-delete.png`
- `../screenshots/square-row-actions-add-delete.png`

## Status Bar

The status bar shows row count, gross CBM/CFT, unsaved count, save progress, saved state, and readiness.

Screenshots:
- `../screenshots/round-statusbar-unsaved.png`
- `../screenshots/round-statusbar-saved.png`
- `../screenshots/square-statusbar-unsaved.png`
- `../screenshots/square-statusbar-saved.png`

## Validation

Validation prevents incomplete or invalid tally data from being saved. Round validation covers required length/girth and configured ranges. Square validation covers required width, thickness, length, and pieces.

Screenshots:
- `../screenshots/round-validation-error.png`
- `../screenshots/square-validation-example.png`

## Mobile View

The Tally Sheet list was captured in a mobile viewport to verify responsive behavior.

Screenshot:
- `../screenshots/round-mobile-responsive.png`

## Import and AI Import

The toolbar includes Import and AI Import actions. Source inspection verifies:
- Import supports file-based tally import with configure, upload/map, and preview steps.
- AI Import supports image-based extraction for handwritten tally sheets and shows AI credit usage.

In this capture run, the production automation session could not open those dialogs reliably, so dialog screenshots were not included.
