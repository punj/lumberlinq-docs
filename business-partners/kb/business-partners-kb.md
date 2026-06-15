# Chatbot Knowledge Base: Business Partners

## Scope

This knowledge base answers user questions about managing Business Partners in LumberLinq.

## Core Definition

A Business Partner is a buyer, seller, exporter, importer, or trading company used across LumberLinq transactions. Business Partners are referenced in shipments, tallysheets, inventory, documents, and reports.

## Navigation

To view partners, go to Business Partners > View Business Partners.

To create a partner, go to Business Partners > Add Business Partner or click New Partner from the list.

## List Page Capabilities

The Business Partners list supports:

- Global search by name, email, contact, and tax ID.
- Status filtering by Active, Inactive, or All.
- Column sorting.
- Column filters for selected columns.
- Multiple row selection.
- Edit, activate/deactivate, and delete actions.

## Create and Edit Partner

The partner form contains five tabs:

- Identity
- Contact & Location
- Operations
- Attachments
- Bank Accounts

Required Identity fields are Company Name, Party Type, Registration Type, Tax ID or GSTIN, and Party Category.

Required Contact & Location fields are Email, Phone 1, Address Line 1, Country, and Zip Code.

## Party Type

Party Type can be Buyer, Seller, or Both.

Use Buyer for customers who purchase goods.

Use Seller for vendors or suppliers.

Use Both when the same company can act as both buyer and seller.

## Party Category

Party Category can be Domestic or International.

## Tax ID and GSTIN

The Tax ID field is required. When country is India, the field is validated as GSTIN.

## Attachments

Attachments are available only after the partner is saved.

Supported attachments include images, PDF, Word, Excel, CSV, PowerPoint, text, ZIP, JSON, and XML.

Maximum file size is 10 MB per file.

Users can view, download, and remove uploaded files.

## Bank Accounts

A partner can have one or more bank accounts. Each account can include Bank Name, Account Number, IFSC / SWIFT, and Currency.

## Active and Inactive Partners

Active partners are visible in new transactions.

Inactive partners are hidden from new transactions.

The owner company cannot be deactivated.

## Delete Rules

Business Partners can be deleted from the list or edit page.

Deletion may fail if the partner is referenced by active shipments or related records.

The owner company cannot be deleted.

## Recommended Bot Answers

Question: How do I add a new business partner?

Answer: Open Business Partners, click New Partner, fill the required Identity and Contact & Location fields, then click Save Partner. You can add attachments after the partner is saved.

Question: Why can I not upload files while creating a partner?

Answer: Attachments require an existing partner record. Save the partner first, then open the Attachments tab and upload files.

Question: What does inactive mean?

Answer: Inactive partners are kept for history but are hidden from new transactions.

Question: Why can I not delete a partner?

Answer: The partner may be used by shipments or other active records, or it may be the owner company. In those cases, LumberLinq blocks deletion to protect transaction history.
