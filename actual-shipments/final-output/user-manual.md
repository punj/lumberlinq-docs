# Shipments User Guide

## Purpose

The Shipments module helps timber and logistics teams manage export, import, domestic sale, domestic purchase, and trading shipments in one place. It brings together shipment details, parties, transport units, documents, invoice values, payment tracking, export reports, share links, and audit/status information.

## Open the Shipments List

Go to **Shipments > List**.

The list shows:

- BL number or bill number
- Shipment type
- Shipment date
- Shipper
- Consignee
- Status stepper
- Transport-unit count
- Route summary
- Row actions for view, share, download/export, edit, payments, and delete

Screenshot: `../screenshots/shipments-01-list-page.png`

## Search and Filter Shipments

Use the global search box to find shipments by BL number, partner, buyer order number, exporter reference, or related shipment text.

The list also includes column filters for BL number, shipper, consignee, and status. Use these when the global search returns too many results.

Screenshots:

- `../screenshots/shipments-02-search-filter.png`
- `../screenshots/shipments-03-column-filter.png`

## Create a Shipment

Select **New** from the Shipments list.

The create screen is organized into tabs:

- **Shipment Details**: shipment type, mode, dates, ports, vessel/flight/vehicle details, and Incoterms or payment terms
- **Consignment Info**: shipper, consignee, notify party, exporter reference, buyer order, origin, and destination
- **Transport Units**: search and add available transport units
- **Documents**: BL, packing list, invoice, certificate, phyto, fumigation, and other shipment documents
- **Financials & Payments**: invoice amount, currency, insurance, freight terms, payment terms, payment summary, and payment history
- **Local Goods & Audit**: local tax/delivery fields, status, approved by, and remarks

Screenshot: `../screenshots/shipments-07-create-details-tab.png`

## Required Field Validation

If required shipment fields are missing, LumberLinq marks the relevant fields and tabs with validation indicators. Complete the mandatory fields before saving.

Common required information includes shipment type, mode of transport, required route details, Incoterms/payment terms, and party information.

Screenshot: `../screenshots/shipments-08-validation-required-fields.png`

## Edit Shipment Details

Open a shipment from the BL number link or the pencil icon.

Use the edit screen to update:

- Core shipment and route information
- Shipper, consignee, and notify party
- Linked transport units
- Document numbers and attachments
- Invoice and payment information
- Shipment status and remarks

Screenshots:

- `../screenshots/shipments-09-edit-details-tab.png`
- `../screenshots/shipments-10-consignment-tab.png`
- `../screenshots/shipments-20-party-consignment-details.png`
- `../screenshots/shipments-15-local-goods-audit-tab.png`

## Transport Units

The Transport Units tab lets users search available units and link them to a shipment.

Only eligible, unassigned units are available. If a transport unit has not been received into inventory, the system prevents shipment assignment. This protects inventory accuracy before dispatch.

Screenshots:

- `../screenshots/shipments-11-transport-units-tab.png`
- `../screenshots/shipments-21-transport-units-linked.png`
- `../screenshots/shipments-25-shipment-view-with-transport-units.png`
- `../screenshots/shipments-26-shipment-view-second-transport-unit.png`

## Documents

Use the Documents tab to maintain shipment document numbers and upload files. Supported document areas include BL, packing list, commercial invoice, certificate-related documents, and other attachments.

Screenshot: `../screenshots/shipments-12-documents-tab.png`

## Financials and Payments

The Financials & Payments tab tracks invoice value, currency, insurance, freight terms, payment terms, due date, payment status, and payment history.

Use **Record Payment** to add a received or paid amount with date, mode, reference number, amount, currency, and notes.

Screenshots:

- `../screenshots/shipments-13-financials-payments-tab.png`
- `../screenshots/shipments-14-record-payment-form.png`
- `../screenshots/shipments-22-payments-summary-detailed.png`
- `../screenshots/shipments-23-payments-record-form-detailed.png`

## Export Shipment Reports

Use the **Export** action from the shipment edit screen or the download action from the list. The export dialog supports access-level options, report format choices, watermark, company logo, photo inclusion, UOM row, and chart/stat options where available.

Screenshots:

- `../screenshots/shipments-16-export-dialog.png`
- `../screenshots/shipments-24-export-with-transport-units.png`

## Share Shipment Links

Use the share action from the list to create public, protected, or private shipment links. The share dialog lets users control duration, access limits, download permission, and document visibility.

Screenshot: `../screenshots/shipments-04-share-menu.png`

## Lock a Shipment

Use the **Lock** action on the edit screen when a shipment should no longer be changed. Locked shipments show a lock badge and prevent normal editing.

Screenshot: `../screenshots/shipments-17-lock-confirmation-dialog.png`

## Read-Only View

The view action opens a read-only shipment view for reviewing shipment details without editing.

Screenshot: `../screenshots/shipments-18-read-only-view.png`

## Inventory and Reconciliation

Shipment assignment is connected to inventory. Transport units must be received into inventory before they can be linked to a shipment. Inventory screens help teams review available stock, movement history, adjustments, processing runs, reconciliation, and inventory reports.

Screenshots:

- `../screenshots/shipments-27-inventory-overview.png`
- `../screenshots/shipments-28-inventory-in-out-ledger.png`
- `../screenshots/shipments-29-inventory-adjustment-dialog.png`
- `../screenshots/shipments-30-inventory-processing-runs.png`
- `../screenshots/shipments-31-processing-run-wizard.png`
- `../screenshots/shipments-32-reconciliation-report.png`
- `../screenshots/shipments-33-inventory-report.png`

## Mobile View

The Shipments list is responsive and can be used on smaller screens for search, review, and follow-up actions.

Screenshot: `../screenshots/shipments-19-mobile-list-view.png`
