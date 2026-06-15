# Reports, Manage User, and RBAC User Guide

This guide explains how to use LumberLinq reports and user access controls for timber and logistics operations.

## Reports

Open **Reports** and choose the report you need. Each report is designed for a different operational view:

- **Business Partner Report**: Review buyer, supplier, shipper, consignee, and service-party records.
- **Product Report**: Review timber product master data.
- **Loading Site Report**: Review yards, mills, depots, and site-level information.
- **Transport Unit Report**: Review transport-unit activity and related stock movement.
- **Tally Report**: Review tally-sheet records and timber volume information.
- **Reconciliation Report**: Review matched, pending, and discrepancy records.
- **Shipment Report**: Review shipments by trade type, payment status, volume, ports, parties, and BL number.
- **Financial Report**: Review receivables, payables, overdue amounts, partner balances, and monthly trends.
- **Inventory Report**: Review available stock, in-process stock, shipped stock, adjustments, and processing runs.
- **Users Report**: Review users, roles, status, timezone, and joined date.
- **App Usage Report**: Review application activity and usage patterns.

## Report Filters

Most reports include date filters. Some reports also include filters such as trade type, status, currency, movement type, or report-specific dropdowns.

Use **Generate** or **Refresh** after changing filters. Wait for the report data, charts, and tables to load before exporting.

## Report Tabs

Some reports contain tabs:

- **Shipment Report**: Overview, Transactions, Financial.
- **Financial Report**: Overview, By Currency, Partners, Trend, Transactions.
- **Inventory Report**: Movement Log, Adjustments, Processing Runs.

Use tabs when you need more detail than the dashboard cards show.

## Exporting Reports

Reports with export support show **Excel** and **PDF** buttons in the header. Use Excel for analysis and PDF for sharing a readable report with management, buyers, suppliers, or operations teams.

## Manage User

Open **Manage User** to view company members, active/inactive status, login type, last active time, pending invitations, and user actions.

The page includes:

- User count and active/inactive summary.
- Member table with name, email, role, status, login type, and last active time.
- Pending invitation table with resend, revoke, and delete actions where allowed.
- Invite User dialog for adding team members.
- Access Rights panel for managing per-user permissions when RBAC is enabled.

## Invite Users

Click **Invite User**. Enter one or more email addresses separated by comma, space, or new line.

If RBAC is enabled, choose a role template before sending the invite:

- **Field Operator**: Tally add and view access.
- **Supervisor**: Tally, shipment view, and export access.
- **Analyst**: View and export operational reports without edit access.
- **Manager**: Broad operational access, excluding full user administration.
- **Custom**: Manual permission configuration.

Invalid email addresses are shown before sending.

## RBAC Settings

Open **Role-Based Access Control** from settings to manage company-level user permissions.

When RBAC is enabled, the screen shows:

- Total users.
- Configured users.
- Users with no access.
- Average permission coverage.
- Per-user permission count.
- Last modified user and date where available.

Click **Configure** to open the Access Rights sidebar.

## Access Rights Sidebar

The Access Rights panel lets an administrator:

- Apply a role template.
- Expand permission modules.
- Enable or disable individual permissions.
- Enable all or disable all permissions within a module.
- Save changes.

Permission modules shown include Dashboard, Tally Sheet, Shipments, Business Partner, Reports, Storage, and Users & Company.

## Disabling RBAC

The RBAC page includes a disable confirmation dialog. Disabling RBAC gives users full access according to their broader role; saved permission settings are preserved and can apply again if RBAC is re-enabled.

## Mobile View

Reports and Manage User screens are responsive. On smaller screens, tables and controls remain available with scrollable layouts where needed.
