# Shipments Chatbot Knowledge Base

## Module

Shipments

## Summary

Use Shipments to manage the operational and financial lifecycle of timber shipments, including route details, parties, transport units, documents, exports, sharing, lock control, and payments.

## Main Screens

- Shipments List
- New Shipment
- Edit Shipment
- Read-Only Shipment View
- Export Dialog
- Share Link Dialog/Menu
- Quick Payment Panel

## List Features

Users can:

- Search globally
- Filter by BL number, shipper, consignee, and status
- Sort list columns
- View shipment status progress
- Open row actions for view, share, download/export, edit, payments, and delete

## Shipment Tabs

The edit/create screen contains:

- Shipment Details
- Consignment Info
- Transport Units
- Documents
- Financials & Payments
- Local Goods & Audit

## Transport Unit Rule

If a transport unit has not been received into inventory, LumberLinq prevents assigning it to a shipment. Advise the user to receive the unit into inventory first, then return to the shipment and add it again. The demo shipment used for documentation now includes linked round and square tally transport units after inventory receipt.

## Party and Consignment Details

The Consignment Info tab includes shipper, consignee, notify party, exporter reference, buyer order number, country of origin, and country of destination.

## Documents

The Documents tab is used for shipment document numbers and attachments such as BL, packing list, commercial invoice, certificates, and other supporting files.

## Payments

The Financials & Payments tab shows invoice amount, received/paid totals, outstanding balance, payment status, due date, and payment history. Users can record a payment from the payment form.

## Export

The Export dialog includes access-level options, format choices, company logo, photos, UOM row, charts/stats, masked field visibility, and watermark options where applicable.

## Share Links

Shipment share links can be public, protected, or private. Users can set duration, access limit, download permission, and document-level visibility.

## Locking

Locking a shipment prevents normal edits. Use this when the shipment record should be finalized.

## Inventory and Reconciliation

Inventory Overview shows stock pipeline and location-level stock. Inventory In/Out shows movement history. Adjustment dialog supports inventory corrections. Processing runs support stock conversion. Reconciliation and inventory reports provide operational review for shipment readiness and stock accuracy.

## Suggested Bot Answers

**How do I find a shipment?**
Open Shipments List and use the search box or column filters. Search by BL number, shipper, consignee, buyer order number, exporter reference, or status.

**How do I add transport units?**
Open the shipment, select Transport Units, search for an available unit, and select it. If the unit is blocked, check whether it has been received into inventory.

**How do I export a shipment?**
Open the shipment and select Export, or use the download action from the list. Choose the access level, format, and export options, then download.

**How do I record a payment?**
Open Financials & Payments, select Record Payment, enter payment date, mode, reference, amount, currency, and notes, then save.

**How do I share a shipment?**
From the list, use the share action. Select public, protected, or private access and configure expiry, download, and document visibility.
