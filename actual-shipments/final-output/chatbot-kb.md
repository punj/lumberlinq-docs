# LumberLinq Knowledge Base — Shipments

## What is a Shipment in LumberLinq?

A shipment is the central record for moving timber goods from one party to another. It brings together every piece of information about a single consignment: the parties involved (shipper, consignee, notify party), the route (ports, vessel/truck details), the timber being shipped (Transport Units), the documents (BL, invoice, certificates), the money (invoice value, payments received), and the status.

Shipments support five trade types: Export, Import, Domestic Sale, Domestic Purchase, and Trading. Each type has the same structure but different required fields — for example, Export and Import require port information while Domestic records use road or rail details instead.

Shipments are used by logistics teams, finance teams, and management. Finance tracks payment status and outstanding balances. Operations tracks which Transport Units are shipped and when. Management reviews volumes, revenues, and partner performance through the Shipment Report and Financial Report.

## Shipment List — What You See and What You Can Do

Open **Shipments** from the main menu to see the Shipments list.

Each row shows:
- BL number (Bill of Lading) or internal bill number — the primary reference
- Shipment type (Export, Import, Domestic Sale, etc.)
- Shipment date
- Shipper name
- Consignee name
- Status stepper — shows the shipment lifecycle stage (created, in transit, arrived, delivered, etc.)
- Transport Unit count — how many TUs are linked
- Route summary — origin port/city to destination port/city
- Row actions: view (read-only), share, download/export, edit (pencil), payments, and delete

You can search shipments using the global search box at the top — it searches across BL number, partner names, buyer order number, and exporter reference. You can also filter by specific columns (BL number, shipper, consignee, status) when the global search returns too many results.

## Creating a New Shipment — All Tabs Explained

Click **New** from the Shipments list. The form has six tabs:

**Tab 1 — Shipment Details**: Core logistics information.
- Shipment type (Export, Import, Domestic Sale, Domestic Purchase, Trading)
- Mode of transport (Sea, Air, Road, Rail, Multi-modal)
- Shipment date and ETD (Estimated Time of Departure)
- ETA (Estimated Time of Arrival) or delivery date
- Vessel name, flight number, or vehicle registration (depending on mode)
- Port of loading and port of discharge (for sea shipments)
- Incoterms (FOB, CIF, CNF, DAP, etc.) — determines who is responsible for freight and insurance costs
- Payment terms (advance, sight LC, usance LC, etc.)

**Tab 2 — Consignment Info**: Party details.
- Shipper: the party sending the goods (usually your company or a seller)
- Consignee: the party receiving the goods (buyer or importer)
- Notify Party: the party to notify upon arrival (often the consignee's agent or a bank)
- Exporter reference: your internal export reference number
- Buyer order number: the buyer's purchase order reference
- Country of origin and country of destination

All party fields (Shipper, Consignee, Notify Party) are selected from your Business Partners list. You must create the Business Partner before you can add them to a shipment.

**Tab 3 — Transport Units**: Link timber to the shipment.
Search for available Transport Units and add them. Only TUs that have been received into inventory can be linked. If a TU appears in the search but cannot be added, check the error — it usually means inventory receipt is pending.

**Tab 4 — Documents**: Document numbers and file uploads.
- BL number / AWB number
- Packing list number
- Commercial invoice number
- Certificate of origin number
- Phytosanitary certificate number
- Fumigation certificate number
- Other supporting documents
You can enter document reference numbers and also upload the actual files. Uploaded files are visible in the share view depending on the access level.

**Tab 5 — Financials & Payments**: Money tracking.
- Invoice amount and currency
- Insurance value
- Freight terms and freight cost
- Payment terms (days, type)
- Due date
- Payment history (list of recorded payments)
- Outstanding balance (auto-calculated: Invoice amount minus total received/paid)
Use **Record Payment** to add each payment as it arrives or is made.

**Tab 6 — Local Goods & Audit**: Status and compliance.
- Local tax / VAT information
- Local delivery details
- Shipment status (manually updated lifecycle stage)
- Approved by (name and date of internal approval)
- Remarks (internal notes)

## Transport Units — Why a TU Cannot Be Added

If you try to add a TU to the Transport Units tab and the system blocks it, the reason is almost always that the TU has not been received into inventory.

LumberLinq enforces this rule to protect inventory accuracy: you cannot ship stock that the system does not recognise as received. The workflow is:

1. Create the tally sheet and measure the timber.
2. Receive the TU into inventory: go to **Inventory → In/Out** and record the inward movement.
3. Return to the shipment and add the TU — it will now be available.

If a TU still cannot be added after inventory receipt, check whether it is already linked to another shipment. A TU can only be assigned to one active shipment at a time.

## Documents Tab — Uploading Shipment Files

The Documents tab stores both document reference numbers and actual files. To upload a file:
1. Open the shipment for editing.
2. Go to the Documents tab.
3. Click the upload button next to the relevant document type.
4. Select the file from your computer.

Supported document types include: Bill of Lading, Packing List, Commercial Invoice, Certificate of Origin, Phytosanitary Certificate, Fumigation Certificate, and Other. There is no file size limit shown in the UI but very large files may take longer to upload.

Document visibility in share links is controlled at the share link level — you can allow or block document access for each share link independently.

## Recording and Tracking Payments

Open a shipment and go to **Financials & Payments**. This tab shows:
- Invoice total and currency
- Total received or paid so far
- Outstanding balance
- Payment status (unpaid, partial, paid, overdue)
- Due date
- Full payment history list

To record a payment click **Record Payment** and fill in:
- Payment date
- Payment mode (bank transfer, LC, cheque, cash, etc.)
- Reference number (bank transfer ID, cheque number, etc.)
- Amount
- Currency (can be different from the invoice currency)
- Notes

Each payment is appended to the history. Outstanding balance updates automatically. You can record multiple partial payments over time.

If a shipment is overdue (due date has passed with outstanding balance remaining), the Financial Report will flag it in the overdue section.

## Exporting a Shipment Report

Use the **Export** action (from the shipment edit screen or the download icon on the list) to generate a shipment document.

The export dialog includes:
- **Access level**: Public, Protected, or Private — controls how much detail is included in the export. Public shows basic shipment summary; Private includes all fields.
- **Format**: Excel (data spreadsheet) or PDF (formatted document)
- **Include photos**: whether TU photos are included (Bundle format adds them as attachments)
- **Company logo**: include your company logo on the PDF header
- **Watermark**: add a watermark text (e.g., "DRAFT", "CONFIDENTIAL") to the PDF
- **UOM row**: whether to include a row showing the units of measurement
- **Charts/Stats**: include summary charts for CBM, CFT, or piece counts per TU

For a complete package with measurements and photos: use Export → Bundle. This creates a ZIP file with the PDF report and all uploaded TU photos.

## Share Links — Sharing Shipment Details Externally

From the Shipments list, click the share icon on any shipment row. You can create a shareable link to the shipment view.

Three access tiers:
- **Public**: anyone with the link can view, no login required. Shows a summary view with basic shipment details.
- **Protected**: recipient must be logged into a LumberLinq account. Shows more detail.
- **Private**: recipient must be logged in and be part of your organisation. Shows all fields.

Share link configuration:
- **Duration / Expiry**: set an expiry date after which the link stops working
- **Access limit**: maximum number of times the link can be opened
- **Download permission**: allow or block PDF download from the shared view
- **Document visibility**: control whether uploaded documents (BL, invoice, certificates) are visible to the link holder

Buyers, freight forwarders, and banks are typical recipients of Public links. Use Protected or Private for internal stakeholders who have LumberLinq accounts.

## Locking a Shipment

When a shipment record is finalised and should not be modified, use **Lock** (available on the edit screen). Locking:
- Prevents all normal editing of the shipment
- Adds a lock badge to the shipment in the list view
- Protects the record from accidental changes after the shipment is completed and paid

To unlock a locked shipment, you need administrator access. Locked shipments are still visible in reports and the read-only view.

## Read-Only View

The view action (eye icon on the list) opens a clean, read-only version of the shipment for reviewing details without risk of accidental edits. This is the same view that appears in some share link contexts.

## Inventory and Reconciliation — Connection to Shipments

Inventory controls which TUs are available for shipment:
- **Inventory Overview**: shows total stock across all categories (available, in-process, in-shipment, shipped)
- **Inventory In/Out**: the ledger of all stock movements — receipts (TU arrives at yard), issues (TU assigned to shipment), adjustments
- **Adjustment dialog**: use to correct inventory discrepancies — for example, if a TU was damaged and volume needs to be reduced
- **Processing runs**: support stock conversion — for example, round logs processed into sawn timber creates a new TU from an old one
- **Reconciliation report**: compares expected vs actual stock based on tally data and shipment records

For a new shipment to include a TU, that TU must show as "received" in the Inventory In/Out ledger.

## Common Problems and Fixes

**"I can't find my shipment"**
Use the global search with the BL number, buyer order number, or consignee name. If that fails, check whether you are in the correct company account (some users have access to multiple tenants).

**"The party dropdown is empty when creating a shipment"**
You must first create the Business Partner (shipper, consignee) in the Business Partners module. Only existing Business Partners appear in shipment party fields.

**"The TU I want to add is not showing in the Transport Units search"**
The TU may not have been received into inventory yet. Go to Inventory → In/Out and record the receipt, then return to the shipment. Also check if the TU is already linked to another shipment.

**"The payment outstanding balance shows wrong"**
Check the currency of each recorded payment — if payments are in a different currency from the invoice, the balance calculation uses the amounts as-is without currency conversion. Ensure all payment amounts are entered in the invoice currency or use the notes field to track multi-currency payments separately.

**"I locked the shipment by mistake"**
Contact your LumberLinq administrator. Unlocking requires admin access. The locked status protects the record but can be reversed by an admin.

**"Validation errors appear across multiple tabs"**
LumberLinq marks tabs with a warning indicator when required fields on that tab are incomplete. Click each highlighted tab and fill in the missing required fields before saving.

## How Shipments Connect to Other Modules

- **Business Partners**: Shipper, Consignee, and Notify Party are all Business Partners. Create all parties in Business Partners before creating shipments.
- **Transport Units / Tally Sheets**: each TU linked to a shipment was created in the Tally Sheets module. The TU volume data appears in the shipment and in shipment exports.
- **Inventory**: TUs must be received into inventory before they can be added to a shipment. Shipment assignment changes TU status from "available" to "in-shipment."
- **Products**: the product on each TU (Round Log or Square/Sawn) determines how volume is calculated and reported in the shipment.
- **Loading Sites**: TUs are linked to loading sites. Loading site information appears in TU details within the shipment.
- **Reports**: Shipment Report, Financial Report, and Inventory Report all use shipment and TU data. The Transport Unit Report shows which TUs are shipped vs in stock.
