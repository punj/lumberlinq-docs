# Missing Modules User Guide

This guide covers LumberLinq modules that were missing or previously too thin in the help center: Inventory, Dashboard V5, Transport Units, Utilities, Subscriptions and Plan Limits, Storage, Support Tickets, Company Profile and Branding, and Account/User Profile.

The guidance is based on captured VPS application screens and existing LumberLinq workflows.

## Inventory

Inventory tracks timber after it has been received from tally and before it is shipped, processed, reconciled, or moved. It helps operations teams answer three questions: what stock is available, where it is located, and what has happened to it.

Open Inventory from:

- `/inventory/overview`
- `/inventory/in-out`
- `/inventory/processing`

### Inventory Overview

Use Inventory Overview for a high-level view of stock across the company. The page is useful for daily operations reviews because it combines stock quantities, movement status, loading site utilization, and inventory health in one place.

Typical information shown on the overview includes:

- Available stock
- In-process stock
- Processed stock
- Stock assigned to shipments
- Shipped stock
- Stock by loading site or location
- Stock utilization summaries
- Recent inventory activity

Use this screen before planning a shipment. If a transport unit is not available here, it may still be in draft tally, already assigned to another shipment, currently in processing, or already shipped.

### Inventory In/Out

Inventory In/Out is the movement ledger. Use it when you need to audit why inventory changed.

Common movement reasons include:

- Receiving timber into inventory
- Assigning material to a shipment
- Releasing or reversing a movement
- Processing input timber into output stock
- Adjusting inventory after review
- Shipping material out

The ledger is useful for reconciliation because it shows the flow of material over time. When investigating a mismatch, start with the transport unit, product, loading site, and movement date.

### Inventory Adjustments

Use adjustments only for corrections. Good adjustment notes are important because they explain why recorded stock no longer matches the previous system balance.

Before saving an adjustment:

- Confirm the product or transport unit is the correct one.
- Confirm the stock status.
- Enter the required quantity or volume fields shown in the dialog.
- Add a clear reason in the notes or remarks field.
- Recheck the inventory overview after saving.

Avoid using adjustments as a replacement for normal receiving, processing, or shipment workflows.

### Inventory Processing

Inventory Processing supports conversion workflows, such as converting selected input transport units into processed output stock.

The processing workflow normally follows this pattern:

1. Open `/inventory/processing`.
2. Start a new processing run.
3. Select the input transport units.
4. Enter the required processing details.
5. Review output stock values.
6. Save or complete the processing run.
7. Review the resulting inventory movement.

Processing runs may appear as draft, in progress, completed, or cancelled depending on the workflow state. If a run has no input transport units, it will not provide useful output values.

### Inventory Best Practices

- Use Inventory Overview for planning.
- Use In/Out for audit and reconciliation.
- Use Processing for conversion workflows.
- Use adjustments sparingly and with clear notes.
- Check inventory status before linking transport units to shipments.

Related screenshots:

- `../../actual-reports-manage-users-rbac/screenshots/inventory-01-overview-rich.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-03-in-out-ledger.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-04-adjustment-dialog.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-05-processing-runs.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-06-processing-wizard-step-1.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-07-processing-wizard-input-tus.png`

## Dashboard V5

Dashboard V5 is the main landing dashboard for business visibility. It is designed for managers and operations users who need a fast view of shipments, inventory, payments, reconciliation, and current activity.

Open:

- `/dashboard-v5`

### What Dashboard V5 Shows

Dashboard V5 includes business summary sections such as:

- Shipment pipeline
- Inventory position
- Volume trend in CBM
- Loading site utilization
- Financial health
- Payment flow
- Reconciliation status
- Processing activity
- Business partner and product activity
- Subscription status or plan visibility

Use this dashboard at the start of the day to understand what needs attention. A well-populated dashboard should show non-empty charts, useful status counts, and recent operational activity.

### How to Use the Dashboard

Use the dashboard as a first stop, then open the detail module from the matching business area.

- If reconciliation shows pending items, open the relevant shipment or reconciliation screen.
- If volume trend changes sharply, review tally sheets, inventory, and shipment volume.
- If loading site utilization is low or empty, check whether received inventory is assigned to loading sites.
- If payment or financial widgets show pending values, review shipment payments and subscription transactions.
- If processing runs show active work, open Inventory Processing for details.

Related screenshot:

- `../../actual-shipments/screenshots/dashboard-v5-full-data.png`

## Transport Units

Transport Units represent physical timber lots created from tally workflows and reused across inventory, shipments, and reports. They are one of the most important links between field tally data and logistics execution.

Transport Units are used in:

- New Tallysheet
- Inventory
- Shipments
- Reports

### Transport Unit Workflow

The normal workflow is:

1. Create or save a tally sheet.
2. Generate or review the transport unit from the tally workflow.
3. Confirm product, party, loading site, and measurement data.
4. Receive the transport unit into inventory.
5. Link the available transport unit to a shipment.
6. Track it from shipment view, inventory, and reports.

### What to Check Before Linking to a Shipment

If a transport unit cannot be linked to a shipment, check:

- The transport unit exists and was saved.
- It has been received into inventory.
- It is not already assigned to another shipment.
- It is not in process.
- It has not already been shipped.
- Product and party selections match the intended shipment.

### Transport Unit Details

Transport unit screens commonly help users review:

- Transport unit identifier or reference
- Product
- Business partner or party
- Loading site
- Round-log or square-log tally details
- Volume and measurement totals
- Shipment linkage
- Inventory status

Related screenshots:

- `../../actual-shipments/screenshots/shipments-11-transport-units-tab.png`
- `../../actual-shipments/screenshots/shipments-21-transport-units-linked.png`
- `../../actual-shipments/screenshots/shipments-25-shipment-view-with-transport-units.png`
- `../../actual-shipments/screenshots/shipments-26-shipment-view-second-transport-unit.png`
- `../../actual-reports-manage-users-rbac/screenshots/tallysheet-transport-01-view-trans.png`

## Utilities

Utilities provide practical timber calculation tools inside LumberLinq so users do not need to maintain separate spreadsheets for everyday conversions and volume checks.

Open:

- `/utility/unit-conversion`
- `/utility/volume-estimates`
- `/utility/slab-generator`

### Unit Conversion

Use Unit Conversion to convert measurements between supported units.

Typical controls include:

- Decimal places
- From value
- From unit
- To unit
- Converted value
- Reverse
- Clear
- Add

Use Reverse when you want to switch the conversion direction. Use Add when you want to keep a conversion row for comparison or later reference.

### Volume Estimates

Use Volume Estimates to calculate timber volume from dimensions and quantity. The page supports CBM and CFT style estimation workflows.

Typical entry values include:

- Width
- Thickness
- Length
- Quantity
- Unit selection
- Optional price or rate fields where available
- CBM result
- CFT result
- Total values

Use the common units toggle when every row uses the same unit setup. Keep row-specific units when your material list contains mixed measurement systems.

### Slab Generator

Use Slab Generator when timber pricing changes by size range and users need a quick slab table.

Typical slab inputs include:

- Rate
- Slab CFT
- Slab price size
- Slab size
- Upper slabs
- Lower slabs

After entering the values, use Calculate to generate slab outputs. Use the Slab Price tab to review the generated price table.

Related screenshots:

- `../screenshots/utilities-01-unit-conversion.png`
- `../screenshots/utilities-02-volume-estimates.png`
- `../screenshots/utilities-03-volume-common-units-toggle.png`
- `../screenshots/utilities-04-slab-generator-inputs.png`
- `../screenshots/utilities-05-slab-generator-results.png`

## Subscriptions and Plan Limits

Subscriptions show the company plan, transaction history, available packages, checkout flow, and payment status information.

Open:

- `/subscriptions`

### Current Subscription

The current subscription area shows the active package and subscription details. Use it to confirm what plan the company is currently using before buying or upgrading.

### Transaction History

Transaction history shows payment records and status. It is useful when users ask whether a payment succeeded, failed, is pending, or is still being processed.

Common payment statuses shown in the payment documentation include:

- Success
- Captured
- Pending
- Created
- Failed
- Cancelled
- Initiated
- Free Trial

### Purchase Plans

The purchase section shows available subscription packages. Users can review package details, select a plan, choose supported billing options, and continue to payment.

### Plan Limits

Plan limits may control usage such as:

- Storage
- Users or team members
- AI credits
- Tally sheets
- Shipments
- Transport units
- Products
- Business partners
- Priority support
- Analytics

If a user cannot create more records, upload files, invite users, or use a paid feature, check the current plan and plan limit details first.

Related screenshots:

- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-01-current-subscription.png`
- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-02-transaction-history.png`
- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-03-purchase-package-selection.png`
- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-08-payment-billing-order-summary.png`
- `../../actual-reports-manage-users-rbac/screenshots/payment-status-10-transaction-history-all-statuses.png`

## Storage

Storage shows company file usage and uploaded files across modules.

Open:

- `/storage`

### Storage Usage

The usage area shows:

- Used storage
- Storage quota
- Free storage
- File count
- Usage percentage

Use this page when uploads fail, when users need to understand storage consumption, or when a plan limit may be blocking new files.

### File List

The file list can include documents and photos from several modules, such as:

- General documents
- Photos
- Business partner documents
- Shipment documents
- Loading site documents

Typical columns include type, name, size, added by, and date.

Use Refresh to reload the latest usage and file list after uploads or cleanup.

Related screenshots:

- `../screenshots/storage-01-usage-and-files.png`
- `../screenshots/storage-02-refreshed-usage.png`

## Support Tickets

Support Tickets let users raise, review, and follow help requests from inside LumberLinq.

Open:

- `/support/tickets`

### Ticket List

The ticket list shows existing support requests. Use it to check current status, category, subject, and recent activity.

### Ticket Detail

Open a ticket to review the full issue, replies, status information, and conversation history. Use the detail page when following up on a support case.

### New Ticket

Use the new ticket form to submit a request. Select the category, enter the issue clearly, and include useful business references such as:

- Shipment number
- Tally sheet reference
- Transport unit identifier
- Product name
- Business partner name
- Screenshot or exact error message

Good ticket descriptions reduce back-and-forth and help support teams identify the affected workflow quickly.

Related screenshots:

- `../../actual-reports-manage-users-rbac/screenshots/support-01-ticket-list-rich.png`
- `../../actual-reports-manage-users-rbac/screenshots/support-02-ticket-detail.png`
- `../../actual-reports-manage-users-rbac/screenshots/support-03-new-ticket-form.png`
- `../../actual-reports-manage-users-rbac/screenshots/support-04-new-ticket-category-dropdown.png`

## Company Profile and Branding

Company Profile and Branding control the business identity used throughout LumberLinq. These settings are important because they affect company records, help identification, and branded output.

Open:

- `/company`
- `/company/branding`

### Company Details

The company details screen is organized into Identity, Location, and Profile sections.

Identity fields include:

- Company ID
- Company name
- Tax ID
- Phone numbers
- Email
- Website
- Legal entity type
- Individual/company selection where available

The Company ID is especially important when requesting help, because it helps support identify the correct company account.

Location fields include:

- Country
- State
- City
- Address line 1
- Address line 2
- Postal code

Profile fields include:

- Industry type
- Company size
- Role in company
- Company logo URL where available

Review these values before inviting users, generating documents, or setting up branded outputs.

### Branding

The Branding page manages the logo used by the company. The screen includes a logo preview, logo URL field, Save action, and Use Default option.

Use Save after entering or changing the logo URL. Use Default when the company should return to the default LumberLinq branding.

Related screenshots:

- `../../actual-reports-manage-users-rbac/screenshots/company-01-details-identity-company-id.png`
- `../../actual-reports-manage-users-rbac/screenshots/company-02-details-location-tab.png`
- `../../actual-reports-manage-users-rbac/screenshots/company-03-details-profile-tab.png`
- `../../actual-reports-manage-users-rbac/screenshots/company-04-branding-logo.png`
- `../../actual-reports-manage-users-rbac/screenshots/global-01-header-company-id-help-font-theme.png`

## Account and User Profile

Account/User Profile is for individual user settings. It is separate from company settings. Company settings describe the business; user profile settings describe the logged-in person.

Open:

- `/edit/account-details`

### Account Details

The Account Details section includes the user email and mobile information. Email may be read-only depending on how the account was created.

Mobile fields include country code and mobile number. Where verification is required, the page can show an OTP or verification action.

### Personal Details

Personal details include:

- First name
- Last name
- Date of birth
- Gender
- Country
- State
- City
- Address line 1
- Address line 2
- Postal code

Keep these values current because they can appear in audit trails, support context, and user management views.

### Timezone

The Timezone section controls how timestamps display for the user. This is important for shipment dates, inventory movement timing, support replies, and reports.

After changing the timezone, use Save Timezone where available.

### Password Change

Use Change Password to update login credentials. The dialog includes old password, new password, and confirm password fields.

Before submitting:

- Enter the current password.
- Enter a new password that passes validation.
- Confirm the new password exactly.
- Check validation messages for length, required fields, or mismatch errors.

Users who signed in using a social login may not see the same password-change workflow.

Related screenshots:

- `../screenshots/profile-01-account-details.png`
- `../screenshots/profile-02-timezone-section.png`
- `../screenshots/profile-03-change-password-dialog.png`
