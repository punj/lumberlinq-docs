# Shipments Screenshot Inventory

Generated under `actual-shipments/screenshots`.

| File | Coverage |
|---|---|
| `shipments-01-list-page.png` | Shipments list page |
| `shipments-02-search-filter.png` | Global search/filter |
| `shipments-03-column-filter.png` | Column filter example |
| `shipments-04-share-menu.png` | Share action/menu |
| `shipments-05-download-export-menu.png` | Download/export menu from list |
| `shipments-06-quick-payment-panel.png` | Payment quick panel |
| `shipments-07-create-details-tab.png` | Create shipment, details tab |
| `shipments-08-validation-required-fields.png` | Required-field validation |
| `shipments-09-edit-details-tab.png` | Edit shipment, details tab |
| `shipments-10-consignment-tab.png` | Consignment info tab |
| `shipments-11-transport-units-tab.png` | Transport units tab |
| `shipments-12-documents-tab.png` | Documents tab |
| `shipments-13-financials-payments-tab.png` | Financials & Payments tab |
| `shipments-14-record-payment-form.png` | Record payment form |
| `shipments-15-local-goods-audit-tab.png` | Local Goods & Audit tab |
| `shipments-16-export-dialog.png` | Export dialog |
| `shipments-17-lock-confirmation-dialog.png` | Lock confirmation dialog |
| `shipments-18-read-only-view.png` | Read-only shipment view |
| `shipments-19-mobile-list-view.png` | Mobile responsive list view |
| `shipments-20-party-consignment-details.png` | Party/consignment details with shipper, consignee, references, origin, and destination |
| `shipments-21-transport-units-linked.png` | Shipment edit screen with linked transport units |
| `shipments-22-payments-summary-detailed.png` | Detailed payment summary and financial cards |
| `shipments-23-payments-record-form-detailed.png` | Detailed payment record form |
| `shipments-24-export-with-transport-units.png` | Export dialog after transport units are linked |
| `shipments-25-shipment-view-with-transport-units.png` | Shipment view with first linked transport unit |
| `shipments-26-shipment-view-second-transport-unit.png` | Shipment view with second linked transport unit |
| `shipments-27-inventory-overview.png` | Inventory overview with material pipeline and stock by location |
| `shipments-28-inventory-in-out-ledger.png` | Inventory In/Out movement ledger |
| `shipments-29-inventory-adjustment-dialog.png` | Inventory adjustment dialog |
| `shipments-30-inventory-processing-runs.png` | Inventory processing runs page |
| `shipments-31-processing-run-wizard.png` | New processing run wizard |
| `shipments-32-reconciliation-report.png` | Reconciliation report |
| `shipments-33-inventory-report.png` | Inventory report |
| `shipments-34-list-with-linked-tu-count.png` | Shipment list after linked transport-unit count is visible |
| `dashboard-v5-full-data.png` | Dashboard V5 full-page populated business, financial, inventory, processing, and reconciliation dashboard |

## Capture Notes

- Screenshots were captured from the actual VPS application UI.
- The demo shipment used BL number `LL-DEMO-SHP-SEA-001`.
- The LL Help Demo round and square tally transport units were received into inventory and linked to the demo shipment so shipment view, transport units, export, inventory, and reconciliation screenshots show the connected workflow.
- No `tms-ng` or `tms-sb` source files were modified.
- Dashboard V5 Volume Trend is currently returned as an empty list by the backend; the `dashboard-v5-full-data.png` capture injects trend points only at Playwright screenshot time so the existing chart UI is visible without code changes.
