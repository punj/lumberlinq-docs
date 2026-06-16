# LumberLinq Knowledge Base — Business Partners

## What is a Business Partner and Why Does it Matter?

A Business Partner (BP) in LumberLinq is any company or contact that your organisation trades with or interacts with professionally. This includes buyers of your timber, sellers you purchase from, exporters, importers, agents, freight forwarders, clearing agents, and other trade parties.

Business Partners are a shared reference list that is reused across all modules: when you create a shipment you pick the shipper and consignee from your Business Partners list; when generating reports you can filter by partner; when creating invoices the billing information comes from the BP record. Keeping BP records accurate and up to date ensures consistency across all your transaction records.

A BP with incorrect contact details, an outdated bank account, or a wrong party type will cause errors downstream in shipments, documents, and reports.

## Party Types — Buyer, Seller, and Both

Every Business Partner has a Party Type that defines their role in your transactions:

- **Buyer**: a company that purchases timber from you. Used as Consignee in Export shipments.
- **Seller**: a company that sells timber to you. Used as Shipper in Import shipments.
- **Both**: the company acts as both buyer and seller. Common for trading partners and agents.

Party Type affects which fields appear in the BP form (for example, buyer-specific fields like buyer credit limit may appear for Buyer type). It also filters the partner dropdowns in the shipment form — when selecting a Consignee, the system shows Buyer and Both type partners.

## Party Category

Party Category is a classification field that further describes the BP's role: options include Trader, Manufacturer, Freight Forwarder, Clearing Agent, Surveyor, Bank, and others. This field is used for filtering in reports and is required when creating a partner.

## Required Fields — What You Must Fill In

A Business Partner record requires the following fields before it can be saved:

**Identity tab:**
- Company Name: the full legal or trading name of the company
- Party Type: Buyer, Seller, or Both
- Registration Type: the type of business registration (e.g., Private Limited, LLP, Partnership, Sole Proprietor, Foreign Entity)
- Tax ID / GSTIN: the tax identification number. Format depends on the country.
- Party Category: classification of the BP's role

**Contact & Location tab:**
- Email: primary contact email address
- Phone 1: primary phone number (including country code)
- Address Line 1: street or building address
- Country: selected from a dropdown. This is required and enables state and city dropdowns.
- Zip Code: postal code

All other fields (Address Line 2, State, City, Phone 2, Fax, Contact Person, Website) are optional but strongly recommended for complete records.

## How to Create a Business Partner — Step by Step

1. Go to **Business Partners** → **View Business Partners** from the main menu.
2. Click **New Partner**.
3. Fill in the **Identity** tab: Company Name, Party Type, Registration Type, Tax ID, Party Category.
4. Switch to the **Contact & Location** tab: Email, Phone 1, Address Line 1, Country, Zip Code. Select Country first — this loads the State dropdown, and selecting State loads the City dropdown.
5. Optionally go to **Operations** tab: enter linked user ID, external code, tags, and notes for internal reference.
6. Click **Save Partner**. The record is created.
7. After saving, open the partner again to add **Attachments** (documents) and **Bank Accounts**.

Note: the Attachments tab and Bank Accounts tab are only accessible after the partner has been saved for the first time. You cannot add these during the initial create step.

## Editing a Business Partner

Open the Business Partners list, find the partner (use search if needed), and click the edit action (pencil icon). You can update any field and click **Update Partner** to save changes.

Editing a partner does not affect historical shipment records that already used that partner — the historical records keep a snapshot of the partner information at the time of the transaction.

## The Operations Tab — Internal Fields

The Operations tab contains fields for internal reference only — they are not printed on documents or shared with external parties:

- **Linked User ID**: if the BP is associated with a LumberLinq user account (for partner portal access)
- **External Code**: your internal code or legacy system ID for this partner (useful for cross-referencing with ERP or accounting software)
- **Tags**: freeform labels for filtering and grouping partners in reports
- **Notes**: any internal notes about this partner (payment behaviour, communication preferences, etc.)

## Attachments — Uploading Documents for a Partner

After saving a partner, open the **Attachments** tab to upload documents. Common attachments include:
- Tax registration certificates
- GST/VAT registration documents
- Trade licence copies
- Compliance certificates (ISO, organic, FSC, etc.)
- KYC documents

To upload: open the saved partner, select Attachments, click the upload button, and select your file. There is no limit to the number of attachments. Files can be of any type (PDF, image, Word, Excel).

Attachments are visible only to your organisation's users — they are not shared through shipment share links or partner-facing documents.

## Bank Accounts — Adding and Managing

The **Bank Accounts** tab stores the banking details of the Business Partner. This is essential for recording payment information correctly and for verifying payment destinations.

To add a bank account:
1. Open the saved partner.
2. Go to **Bank Accounts** tab.
3. Click **Add Bank Account**.
4. Enter: Bank Name, Account Number, IFSC code (for Indian banks) or SWIFT/BIC code (for international banks), Account Name, Currency, and Branch details.
5. Save.

A partner can have multiple bank accounts in different currencies. Each account is shown as a card. You can delete a bank account that is no longer needed (this does not affect historical payment records that referenced it).

## Activating and Deactivating Partners

Use the status toggle action (from the list or the edit form) to deactivate a partner that you no longer work with.

**Deactivating** a partner:
- The partner becomes inactive and is hidden from all new transaction dropdowns (shipment parties, report filters for active partners)
- Historical records that used this partner are unaffected — they retain the partner reference
- The partner still appears when you search for "inactive" partners

**Reactivating** a partner:
- Use the same toggle action — switch from Inactive to Active
- The partner immediately becomes available again in transaction dropdowns

**Why you might deactivate instead of delete**: Deleting a partner is blocked if it is referenced by any transaction records (shipments, tally sheets, etc.). If a partner has historical records, you cannot delete it. Deactivate it instead to stop it appearing in new transaction forms while preserving the historical data.

## Why You Cannot Delete a Business Partner

Deletion is blocked when the partner is:
- Referenced by existing shipment records (as shipper, consignee, or notify party)
- Referenced by tally sheets or transport units
- The owner company itself (your own company cannot be deleted)

In these cases, use deactivation instead of deletion. If you genuinely need to remove a partner and it is referenced by data, you must first remove or reassign all the linked records — which is generally not recommended as it affects historical accuracy.

## Duplicate Partner Warning

When creating or editing a partner, LumberLinq checks for existing records with the same Company Name or Tax ID. If a match is found, a warning is shown before saving. This prevents duplicate entries that would cause confusion in reports and transaction dropdowns.

If you receive a duplicate warning and the partner already exists, cancel the creation and use the existing record instead. If the warning appears but the existing record is different, verify the Tax ID or Company Name is correct.

## Searching and Filtering Partners

The Business Partners list includes a search box that searches across: Company Name, Email, Contact Person, and Tax ID. Type any of these values to filter the list.

You can also filter by status: Active (shown by default), Inactive, or All. Use the status filter when looking for a deactivated partner that you want to reactivate.

Clicking a column header sorts the list by that column. The list is paginated — if you have many partners, use search rather than scrolling.

## How Business Partners Connect to Other Modules

- **Shipments**: Shipper, Consignee, and Notify Party fields on shipments are all Business Partners. You cannot select a party on a shipment that does not exist as a BP.
- **Reports**: Business Partner Report shows all partners with their details. Financial Report can filter by partner to see receivables and payables for a specific buyer or supplier.
- **Inventory**: partner information flows into inventory reports when shipments are linked to TUs.
- **Documents**: BP contact and address details can appear on exported PDF documents (invoice, packing list headers).
- **Users**: an internal user can be linked to a BP record for partner portal access, where enabled by your plan.
