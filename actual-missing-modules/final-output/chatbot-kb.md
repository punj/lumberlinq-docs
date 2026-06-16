# Chatbot Knowledge Base - Missing Modules

This knowledge base is written for LumberLinq in-app help. Use it to answer user questions about Inventory, Dashboard V5, Transport Units, Utilities, Subscriptions, Storage, Support Tickets, Company Profile and Branding, and Account/User Profile.

## Inventory

### What this module is for

Inventory tracks timber stock after tally receiving and before shipment, processing, or final movement. It helps users understand available stock, assigned stock, shipped stock, and processing activity.

### Common Questions

Q: Where do I see current stock?

A: Open Inventory Overview at `/inventory/overview`. It shows stock status, inventory pipeline, location or loading site information, and summary activity.

Q: Where can I audit why stock changed?

A: Use Inventory In/Out at `/inventory/in-out`. It works as the inventory movement ledger and helps trace receiving, assignment, adjustment, processing, and shipment movements.

Q: When should I use an inventory adjustment?

A: Use an adjustment only to correct inventory. Enter the required values and add a clear note explaining why the correction was made.

Q: Why is a transport unit not available for shipment?

A: Check whether it has been received into inventory, whether it is already assigned to another shipment, whether it is in processing, or whether it has already shipped.

Q: What is Inventory Processing?

A: Inventory Processing is used when input stock is converted into output stock. Start a processing run, select input transport units, enter processing details, and review the generated inventory movement.

### Related Screenshots

- `../../actual-reports-manage-users-rbac/screenshots/inventory-01-overview-rich.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-03-in-out-ledger.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-04-adjustment-dialog.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-05-processing-runs.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-06-processing-wizard-step-1.png`
- `../../actual-reports-manage-users-rbac/screenshots/inventory-07-processing-wizard-input-tus.png`

## Dashboard V5

### What this module is for

Dashboard V5 is the management landing screen. It summarizes business activity across shipments, inventory, payments, reconciliation, loading sites, processing, and subscriptions.

### Common Questions

Q: What should I check first on Dashboard V5?

A: Start with shipment pipeline, inventory position, reconciliation status, payment flow, volume trend, loading site utilization, and processing runs.

Q: Why is a chart empty?

A: Empty charts usually mean there is no matching data for the selected period, the underlying module has no records, or the required records have not reached the status used by the dashboard.

Q: What should I do if Pending Reconciliation is not zero?

A: Open the relevant shipment or reconciliation workflow and review the pending party, payment, inventory, or document items.

Q: What does Volume Trend show?

A: Volume Trend shows timber volume activity over time, usually in CBM. Use it to identify changes in received, processed, or shipped volume.

Q: What does Loading Site Utilization show?

A: Loading Site Utilization shows how stock or activity is distributed across loading sites. If it is empty, confirm that records are linked to loading sites.

### Related Screenshot

- `../../actual-shipments/screenshots/dashboard-v5-full-data.png`

## Transport Units

### What this module is for

Transport Units represent physical timber lots created from tally workflows. They connect tally sheets, inventory, shipments, and reports.

### Common Questions

Q: What is a transport unit?

A: A transport unit is a physical timber lot or unit generated from tally data. It carries product, party, loading site, measurement, volume, inventory, and shipment context.

Q: How do I use a transport unit in a shipment?

A: Save the tally sheet, make sure the transport unit is received into inventory, then add the available transport unit to the shipment.

Q: Why can I see a transport unit in tally but not in shipment?

A: It may not be received into inventory yet, it may already be assigned, it may be in processing, or it may already be shipped.

Q: Where can I review linked transport units?

A: Review them from the shipment transport units tab, shipment view, inventory screens, and transport unit report screens.

### Related Screenshots

- `../../actual-shipments/screenshots/shipments-11-transport-units-tab.png`
- `../../actual-shipments/screenshots/shipments-21-transport-units-linked.png`
- `../../actual-shipments/screenshots/shipments-25-shipment-view-with-transport-units.png`
- `../../actual-shipments/screenshots/shipments-26-shipment-view-second-transport-unit.png`
- `../../actual-reports-manage-users-rbac/screenshots/tallysheet-transport-01-view-trans.png`

## Utilities

### What this module is for

Utilities provide built-in timber calculation tools: Unit Conversion, Volume Estimates, and Slab Generator.

### Common Questions

Q: How do I convert units?

A: Open `/utility/unit-conversion`, enter the source value, select the source and target units, choose decimal places, and review the converted value. Use Reverse to switch direction and Add to keep a row.

Q: How do I estimate CBM or CFT?

A: Open `/utility/volume-estimates`, enter width, thickness, length, quantity, and units. The page calculates volume values and totals.

Q: When should I use common units?

A: Use common units when all rows use the same measurement system. Keep row-level units when different rows use different units.

Q: What is Slab Generator used for?

A: Slab Generator creates size-based price slabs from rate, slab CFT, slab price size, slab size, upper slabs, and lower slabs.

Q: Why does my volume estimate look wrong?

A: Check width, thickness, length, quantity, and unit selections. Mixed units are the most common reason for unexpected volume results.

### Related Screenshots

- `../screenshots/utilities-01-unit-conversion.png`
- `../screenshots/utilities-02-volume-estimates.png`
- `../screenshots/utilities-03-volume-common-units-toggle.png`
- `../screenshots/utilities-04-slab-generator-inputs.png`
- `../screenshots/utilities-05-slab-generator-results.png`

## Subscriptions and Plan Limits

### What this module is for

Subscriptions show the current plan, transaction history, plan purchase options, checkout flow, payment billing details, and payment statuses.

### Common Questions

Q: Where do I see my current plan?

A: Open `/subscriptions` and review the current subscription section.

Q: Where do I see payment history?

A: Use the transaction history section. It shows previous transactions and statuses.

Q: What payment statuses can appear?

A: The captured payment status set includes Success, Captured, Pending, Created, Failed, Cancelled, Initiated, and Free Trial.

Q: Why can I not create more users, shipments, files, or records?

A: The company may have reached a plan limit. Check the subscription package and plan limits for users, storage, AI credits, tally sheets, shipments, transport units, products, and business partners.

Q: How do I buy or upgrade a plan?

A: Open the purchase section in Subscriptions, choose the package and billing options, then continue through the checkout and payment flow.

### Related Screenshots

- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-01-current-subscription.png`
- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-02-transaction-history.png`
- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-03-purchase-package-selection.png`
- `../../actual-reports-manage-users-rbac/screenshots/subscription-component-08-payment-billing-order-summary.png`
- `../../actual-reports-manage-users-rbac/screenshots/payment-status-10-transaction-history-all-statuses.png`

## Storage

### What this module is for

Storage shows company file usage, quota, free space, file count, and uploaded files.

### Common Questions

Q: Where can I see storage usage?

A: Open `/storage`. The usage section shows used storage, quota, free storage, file count, and usage percentage.

Q: What files are included in Storage?

A: Storage can include general documents, photos, business partner documents, shipment documents, loading site documents, and other uploaded files.

Q: What should I do if uploads fail?

A: Check available storage, refresh the Storage page, and confirm whether the company plan has enough quota.

Q: How do I refresh the storage list?

A: Use the Refresh action on the Storage page.

### Related Screenshots

- `../screenshots/storage-01-usage-and-files.png`
- `../screenshots/storage-02-refreshed-usage.png`

## Support Tickets

### What this module is for

Support Tickets let users create and track help requests inside LumberLinq.

### Common Questions

Q: How do I create a ticket?

A: Open `/support/tickets`, choose the new ticket action, select a category, describe the issue, and submit it.

Q: What should I include in a support ticket?

A: Include the module name, shipment number, tally sheet reference, transport unit identifier, product name, business partner name, screenshot, or exact error message.

Q: Where do I see ticket replies?

A: Open the ticket detail page to view the conversation and updates.

Q: How do I track ticket status?

A: Use the ticket list and ticket detail view. They show current ticket information and updates.

### Related Screenshots

- `../../actual-reports-manage-users-rbac/screenshots/support-01-ticket-list-rich.png`
- `../../actual-reports-manage-users-rbac/screenshots/support-02-ticket-detail.png`
- `../../actual-reports-manage-users-rbac/screenshots/support-03-new-ticket-form.png`
- `../../actual-reports-manage-users-rbac/screenshots/support-04-new-ticket-category-dropdown.png`

## Company Profile and Branding

### What this module is for

Company Profile and Branding manage the business identity used across LumberLinq.

### Common Questions

Q: Where do I edit company details?

A: Open `/company`. The company details screen includes Identity, Location, and Profile sections.

Q: What is Company ID used for?

A: Company ID identifies the company account. It is useful when requesting help because support can use it to locate the correct company.

Q: What fields are in the Identity section?

A: Identity can include company name, tax ID, phone numbers, email, website, legal entity type, and individual/company selection.

Q: What fields are in the Location section?

A: Location includes country, state, city, address lines, and postal code.

Q: What fields are in the Profile section?

A: Profile includes industry type, company size, role in company, and logo URL where available.

Q: How do I update the company logo?

A: Open `/company/branding`, enter or update the logo URL, review the preview, and use Save. Use Default if the company should return to default branding.

### Related Screenshots

- `../../actual-reports-manage-users-rbac/screenshots/company-01-details-identity-company-id.png`
- `../../actual-reports-manage-users-rbac/screenshots/company-02-details-location-tab.png`
- `../../actual-reports-manage-users-rbac/screenshots/company-03-details-profile-tab.png`
- `../../actual-reports-manage-users-rbac/screenshots/company-04-branding-logo.png`
- `../../actual-reports-manage-users-rbac/screenshots/global-01-header-company-id-help-font-theme.png`

## Account and User Profile

### What this module is for

Account/User Profile stores settings for the logged-in user, including personal information, mobile details, timezone, and password changes.

### Common Questions

Q: Where do I edit my user profile?

A: Open `/edit/account-details`.

Q: What is the difference between Company Profile and User Profile?

A: Company Profile describes the business account. User Profile describes the individual logged-in user.

Q: Can I change my email?

A: Email may be read-only depending on how the account was created. Use the Account Details screen to review the current email.

Q: How do I update my mobile number?

A: Open Account Details, update country code and mobile number, and complete verification if the page asks for OTP verification.

Q: Where do I change timezone?

A: Use the Timezone section on `/edit/account-details`, select the timezone, and save it. This affects how timestamps display for the user.

Q: How do I change my password?

A: Use Change Password on the Account Details page. Enter the old password, new password, and confirm password. Resolve validation errors before submitting.

Q: Why do I not see Change Password?

A: Some social-login accounts may not use the same password-change workflow.

### Related Screenshots

- `../screenshots/profile-01-account-details.png`
- `../screenshots/profile-02-timezone-section.png`
- `../screenshots/profile-03-change-password-dialog.png`
