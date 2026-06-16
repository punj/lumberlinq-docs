# LumberLinq Knowledge Base — Reports, User Management, and RBAC

## What Reports Are Available in LumberLinq?

LumberLinq has 11 built-in reports accessible from the **Reports** section of the main menu. Each report is designed for a different operational or financial view:

1. **Business Partner Report**: list of all your trading partners with their details, party type, contact information, and status. Use this for KYC reviews, partner audits, or compliance checks.

2. **Product Report**: your timber product catalog — product names, formulas, HS codes, species, and codes. Use this to verify your product master data.

3. **Loading Site Report**: all your registered loading sites with location, contact, capacity, and site type. Use to audit site records or check site capacity.

4. **Transport Unit Report**: activity report on all TUs — volume, product, loading site, status (in-stock, in-shipment, shipped), and linked tally sheet data. Use to track which TUs are where and how much timber is in each.

5. **Tally Report**: detailed timber measurement records from tally sheets. Filterable by date, product, loading site, and tally type. Use to review total measured volume for a period or to verify tally data.

6. **Reconciliation Report**: compares your tally measurements against counter-tallies (buyer, surveyor, or inspector tallies). Shows matched, pending, and discrepancy rows. Use before finalising shipment payments.

7. **Shipment Report**: operational and financial summary of all shipments. Covers shipment counts, total CBM, total pieces, trade type breakdown, party information, port details, BL numbers, payment status, and financial totals. Has three tabs: Overview, Transactions, and Financial.

8. **Financial Report**: detailed receivables and payables tracking. Shows actual received, actual paid, outstanding receivables, outstanding payables, overdue amounts, partner balances, currency breakdown, and monthly trends. Has five tabs: Overview, By Currency, Partners, Trend, Transactions. Use this for cash flow review and payment follow-up.

9. **Inventory Report**: stock position and movement history. Shows available stock, in-process stock, in-shipment stock, shipped-this-month totals, movement log, inventory adjustments, and processing runs. Has three tabs: Movement Log, Adjustments, Processing Runs.

10. **Users Report**: list of all users in your company with their name, email, role, account status, login type (email/social), timezone, and date joined. Use for access audits and user management reviews.

11. **App Usage Report**: application activity analysis — which features are used, by whom, and how frequently. Use to understand adoption and identify inactive users.

## How to Generate and Use a Report

1. Open **Reports** from the main menu.
2. Click the report you want.
3. Set the filters — most reports include a **date range** filter. Some reports have additional filters:
   - Shipment Report: trade type, status
   - Financial Report: currency, partner
   - Inventory Report: movement type, site
4. Click **Generate** or **Refresh** to load the data.
5. Wait for the data, charts, and table rows to load before exporting.

If a report shows no data, check the date range first — the default range may not include the period you need. Widen the date range and refresh.

## Exporting Reports to Excel or PDF

Reports that support export show **Excel** and **PDF** buttons in the report header area. 

- **Excel**: downloads a structured spreadsheet with all report rows. Best for further analysis in accounting software or for sharing raw data with auditors and managers.
- **PDF**: formatted, printable document. Best for presenting to management, buyers, or regulatory authorities.

Not all reports have export support — the buttons appear only on reports where export is available.

## Shipment Report — Tabs Explained

The Shipment Report has three tabs:
- **Overview**: summary cards showing total shipments, total CBM, total pieces, and breakdowns by trade type and status. Charts for volume trends over time.
- **Transactions**: row-level shipment list with BL number, type, route, parties, dates, volume, and payment status. Filterable and sortable.
- **Financial**: invoice totals, received amounts, outstanding amounts, and currency breakdowns across all shipments in the filtered period.

## Financial Report — Tabs Explained

The Financial Report has five tabs:
- **Overview**: total receivables, payables, overdue amounts, and summary cards for the period.
- **By Currency**: same metrics broken down by invoice currency (useful for multi-currency businesses).
- **Partners**: receivables and payables grouped by Business Partner — shows which buyers owe you and which suppliers you owe.
- **Trend**: monthly trend chart of cash inflows and outflows over the selected period.
- **Transactions**: row-level list of all payment records with date, partner, mode, reference, and amount.

## Manage Users — What Administrators Can Do

Open **Manage User** (from Settings or from the admin area) to see all users in your company account.

The Manage User page shows:
- **User count summary**: total users, active users, inactive users
- **Member table**: name, email, role, account status (active/inactive), login type (email, Google, Microsoft, Facebook, LinkedIn), last active timestamp
- **Pending invitations**: users who have been invited but have not yet accepted — with options to resend, revoke, or delete the invitation

From this page an administrator can:
- Invite new users
- Deactivate or reactivate user accounts
- Manage pending invitations
- Open the Access Rights panel for individual users (when RBAC is enabled)

## How to Invite a New User

1. Open **Manage User**.
2. Click **Invite User**.
3. Enter one or more email addresses. You can enter multiple addresses separated by commas, spaces, or new lines — LumberLinq will send separate invitations to each address.
4. If RBAC is enabled on your account, select a **Role Template** before sending (see Role Templates below).
5. Click **Send Invite**.

The invitee receives an email with a link to accept the invitation and set up their account. Accepted invitations move from the Pending section to the active Members table.

If an email address is invalid, LumberLinq shows a validation error before sending. Invalid addresses are highlighted so you can correct them.

## Role Templates — What Each Means

When RBAC is enabled, you must assign a role template when inviting a user. Role templates are pre-configured permission sets:

- **Field Operator**: for workers entering tally sheet data in the field. Has access to add tally rows and view tally sheets. Does not have access to shipments, reports, or user management.

- **Supervisor**: for site supervisors or foremen. Has access to tally sheets, can view shipment information, and can export tally reports. Cannot edit shipments or manage users.

- **Analyst**: for internal reporting and analysis staff. Has view-only and export access to reports without the ability to create or edit operational records (tallies, shipments).

- **Manager**: broad operational access for department managers. Can access most modules including tally, shipments, inventory, reports, and business partners. Cannot manage users or company settings.

- **Custom**: manually configure each permission. Select this when none of the templates match the user's role exactly. You will need to enable or disable each permission individually in the Access Rights panel.

Role template assignments can be changed at any time after inviting a user — open the user's Access Rights panel and adjust.

## What is RBAC (Role-Based Access Control)?

RBAC is LumberLinq's system for controlling which parts of the application each user can access. When RBAC is enabled by an administrator, every user's access is governed by their configured permissions rather than just their role (User, Admin, etc.).

Without RBAC: all company users have broad access based only on their role tier (User gets standard access, Admin gets full access).

With RBAC enabled: you can restrict a specific user so they can only access Tally Sheets but not Shipments, or only view reports but not edit any records. This is useful for companies with many users in different departments.

## The RBAC Settings Page

Open **Role-Based Access Control** from Settings. The page shows:
- **RBAC status**: enabled or disabled toggle
- **Total users**: how many users are in your company
- **Configured users**: how many users have custom RBAC permissions set
- **Users with no access**: users who have RBAC enabled but no permissions granted (they can log in but see nothing)
- **Average permission coverage**: percentage of permissions enabled across configured users
- **Per-user permission count**: a table showing how many permissions each user has
- **Last modified**: which user's permissions were last changed and when

## Access Rights Sidebar — Configuring Permissions

Click **Configure** next to a user (or from Manage User click the shield/access icon) to open the Access Rights sidebar for that user.

The sidebar shows permission modules, each expandable:

**Available permission modules:**
- **Dashboard**: access to the main dashboard (V4, V5)
- **Tally Sheet**: create, view, edit, delete tally sheets and TUs
- **Shipments**: create, view, edit, delete shipments; record payments
- **Business Partner**: create, view, edit, delete business partners
- **Reports**: view and export each report type; sub-permissions per report category
- **Storage**: access to the storage and file management module
- **Users & Company**: manage users, company profile, branding, and subscription

For each module you can:
- **Enable All**: grant all permissions in that module with one click
- **Disable All**: remove all permissions in that module
- **Toggle individual permissions**: enable or disable specific actions (e.g., can view shipments but not delete them)

After making changes click **Save Changes**. Changes take effect the next time the user loads or refreshes a page — they do not need to log out and back in.

## Disabling RBAC

If you no longer want per-user permission control, you can disable RBAC from the RBAC settings page. A confirmation dialog explains the impact.

When RBAC is disabled:
- All company users revert to access based on their role tier (User, Admin, Super Admin)
- Previously configured RBAC permissions are preserved in the database — they are not deleted
- If you re-enable RBAC later, all previous permission configurations are restored automatically

Disabling RBAC is an irreversible action in the sense that it immediately gives all users broad access based on role. Re-enabling it restores the saved configurations.

## Common Questions About Reports

**"Which report should I use for receivables?"**
Use the Financial Report. Open Reports → Financial Report, set the date range, and check the Overview or Partners tab for outstanding receivables by partner.

**"Which report shows what stock I have available?"**
Use the Inventory Report. The Movement Log tab shows all receipts and issues. The main overview cards show available stock total.

**"My report shows no data even though I have records"**
Check two things: (1) the date range — your records may fall outside the selected period; (2) any additional filters — a trade type or status filter may be excluding your records. Reset all filters and refresh.

**"I need to show a report to my management in a presentation"**
Export to PDF for a formatted, printable version. Use Excel if they need to do their own analysis.

## Common Questions About Users and RBAC

**"A user says they can't see the Shipments menu"**
With RBAC enabled, check their Access Rights — they may not have the Shipments permission enabled. Open Manage User → their Access Rights → Shipments module → Enable All, then Save.

**"A pending invitation is expired"**
Use the Resend action in the Pending Invitations table. This sends a new invitation email with a fresh link.

**"I want to remove a user's access without deleting their account"**
Use the Deactivate action on their row in the Manage User table. A deactivated user cannot log in but their historical records (shipments they created, tallies they entered) are preserved.

**"Can I have different permissions for different modules for the same user?"**
Yes, this is exactly what RBAC is designed for. Open that user's Access Rights and enable/disable specific module permissions individually. For example: enable Tally Sheet (full) + Reports (view only) and disable Shipments entirely.

## How Reports and User Management Connect to Other Modules

- All reports pull data from operational modules: Tally Sheets, Shipments, Business Partners, Products, Loading Sites, Inventory.
- The Financial Report aggregates payment records from the Financials & Payments tab on each shipment.
- The Reconciliation Report pulls from the Reconciliation tab on individual tally sheets.
- User permissions (RBAC) affect which menu items and modules each user can see. A user without Tally Sheet permission cannot see the Tally Sheets menu item at all.
- The Users Report (under Reports) gives an audit log of who has access to the system.
- The App Usage Report under Reports → Analytics helps identify which features are heavily used and which are ignored.
