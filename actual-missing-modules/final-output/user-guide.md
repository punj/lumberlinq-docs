# Missing Modules User Guide

This guide covers standalone help for modules that were previously missing or only covered inside another guide: Inventory, Dashboard V5, Transport Units, Utilities, Subscriptions and Plan Limits, Storage, and Support Tickets.

## Inventory

Use Inventory to track timber stock after tally sheets are received and before material is shipped or processed.

Open Inventory from:
- `/inventory/overview`
- `/inventory/in-out`
- `/inventory/processing`

Inventory Overview shows stock pipeline, available material, in-process material, material assigned to shipments, shipped stock, site utilization, and stock by location.

Inventory In/Out shows movement history. Use it to review when transport units were received, adjusted, processed, assigned, shipped, or moved.

Inventory Processing supports conversion workflows, such as converting input transport units into processed output stock. The processing wizard lets users choose input transport units, enter processing details, and review resulting inventory movement.

Use inventory adjustments only for corrections. Add clear notes so later reconciliation remains understandable.

## Dashboard V5

Dashboard V5 is the landing dashboard for high-level business visibility.

Open:
- `/dashboard-v5`

It summarizes business activity, shipment pipeline, inventory position, financial health, payment flow, reconciliation status, processing activity, loading site utilization, and subscription status.

Use Dashboard V5 at the start of the day to understand what needs attention:
- Pending reconciliation
- Stock movement
- Shipment volume
- Payment status
- Processing runs
- Utilization gaps

## Transport Units

Transport Units represent physical timber lots or units created from tally sheets.

Transport Units are used across:
- New Tallysheet
- Inventory
- Shipments
- Reports

The normal workflow is:
1. Create a transport unit from a tally sheet.
2. Enter round-log or square-log measurements.
3. Save the tally sheet.
4. Receive the transport unit into inventory.
5. Link the available transport unit to a shipment.
6. Review it from shipment view, inventory, and reports.

If a transport unit cannot be linked to a shipment, check whether it has been received into inventory and whether it is already assigned, shipped, or in process.

## Utilities

Utilities help timber teams calculate and convert values without spreadsheets.

Open:
- `/utility/unit-conversion`
- `/utility/volume-estimates`
- `/utility/slab-generator`

### Unit Conversion

Use Unit Conversion to convert measurements between supported units. Enter a source value, source unit, target unit, and decimal places. Use Reverse to switch direction. Use Add to keep conversion rows for comparison.

### Volume Estimates

Use Volume Estimates to calculate CBM and CFT from width, thickness, length, quantity, and optional price information.

You can use common units for all rows or row-specific units. Use common units when all material follows the same measurement system.

### Slab Generator

Use Slab Generator to create price slabs from a base rate, slab CFT, slab price size, slab size, upper slabs, and lower slabs.

Use it when timber pricing changes by size range and users need a quick rate table.

## Subscriptions and Plan Limits

Open:
- `/subscriptions`

Subscriptions include:
- Current subscription
- Transaction history
- Purchase plans
- Payment checkout
- Payment status pages

The Current Subscription tab shows the active package and subscription details.

The Transaction History tab shows payment records and statuses such as Success, Captured, Pending, Created, Failed, Cancelled, Initiated, and Free Trial.

The Purchase tab shows available packages, currency and tenure choices, and plan selection.

Plan limits control usage such as storage, users, AI credits, tally sheets, shipments, transport units, products, business partners, priority support, and analytics, depending on the package configuration.

## Storage

Open:
- `/storage`

Storage shows how much company file storage is used, the quota, remaining free space, and file count.

The file table lists stored documents and photos with type, name, size, added-by user, and date.

Storage can include:
- General documents
- Photos
- Business partner documents
- Shipment documents
- Loading site documents

Use Refresh to reload the latest usage and file list.

## Support Tickets

Open:
- `/support/tickets`

Support Tickets let users raise and track help requests.

The ticket list shows existing tickets with status and category. The ticket detail screen shows the conversation, ticket information, replies, and updates. The new ticket form lets users choose a category, enter the issue, and submit the ticket.

Use clear subject lines and include the module name, shipment number, tally sheet reference, or screenshot when possible.
