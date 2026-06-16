# LumberLinq Knowledge Base — Products and Loading Sites

## What is a Product in LumberLinq?

A Product in LumberLinq is a timber catalog entry that defines the type of timber your company trades. Examples: Teak Round Logs, Pine Sawn Boards, Rubber Wood Sleepers, Merbau Square Timber. Products are used across tally sheets, transport units, shipments, inventory, and reports.

The most critical function of a product is determining the **measurement formula** — whether the timber is measured as Round Logs or as Square/Sawn timber. This formula choice controls which fields appear in the tally sheet grid and how volume (CBM/CFT) is calculated. Every Transport Unit (and therefore every tally sheet) is linked to one product.

## Product Formula Types — Round Log vs Square/Sawn

This is the most important setting when creating a product:

**Round Log formula**: used for round, unprocessed logs. Volume is calculated using the quarter-girth (Hoppus) method: Volume = (Girth ÷ 4)² × Length. When a TU uses a Round Log product, the tally sheet grid shows Length and Girth columns.

**Square / Sawn formula**: used for sawn, dressed, or rectangular timber (boards, planks, sleepers, beams). Volume is calculated as: CFT = (Width × Thickness × Length × Pieces) ÷ 144. When a TU uses a Square/Sawn product, the tally grid shows Width, Thickness, Length, and Pieces columns.

**Important**: you cannot change a product's formula after it has been used in a tally sheet. If you created a product with the wrong formula and it has tally data, you must create a new product with the correct formula and reassign future TUs to it. Existing tally data cannot be converted.

## Required Fields When Creating a Product

To save a product you must provide:
- **Product Name**: a clear, descriptive name (e.g., "Teak Round Logs Grade A", "Pine Sawn Boards 25mm")
- **Formula**: Round Log or Square/Sawn — this cannot be changed later
- **HS Code**: the Harmonized System customs code for this timber type. Must be numeric. Common timber HS codes are in chapters 44 and 47. The field validates format and length.

Optional but recommended fields:
- **Species**: the timber species (e.g., Tectona grandis for Teak, Pinus sylvestris for Pine). Used in reports and documentation.
- **Product Code**: your internal SKU or reference code for this product
- **Description**: additional details about grade, treatment, quality, or certification

## How to Create a Product — Step by Step

1. Open **Products** from the main navigation menu.
2. Click the **add product** action (usually a + button or "New Product").
3. Enter the Product Name.
4. Select the Formula: Round Log or Square / Sawn. Think carefully — this determines the tally sheet type.
5. Enter the HS Code. Use your country's customs authority website to confirm the correct code for this timber species and form.
6. Optionally enter Species, Product Code, and Description.
7. Click **Save**.

The product is now available for selection when creating Transport Units.

## Editing a Product

Open the Products list, find the product (use search if needed), open the row, make changes, and save. You can update Name, Species, Product Code, Description, and HS Code at any time. You cannot change the Formula after the product has been used.

If you need to update an HS Code (e.g., due to customs reclassification), do so in the Products module. The new HS Code will apply to future shipments; existing shipment documents will retain the old HS Code from when they were created.

## Deleting a Product

Use the delete action from the list or edit page. A confirmation dialog appears. Deletion fails if the product is already referenced by:
- Existing Transport Units
- Tally sheets
- Historical shipment records

In such cases, you cannot delete the product. Instead, leave it active (it will not cause problems) or deactivate/archive it if that option is available.

## Searching Products

Open the Products list and type in the search box. The search covers product name, species, HS code, product code, and description. For example, searching "teak" returns all teak products regardless of formula or grade.

## What is a Loading Site?

A Loading Site is a physical location where timber is stored, processed, staged, or loaded. It represents where the timber physically exists before being transported. Examples of loading sites include:
- Timber yard or depot
- Forest or harvesting site
- Sawmill or processing facility
- Port terminal or container yard
- Warehouse

Loading Sites are linked to Transport Units — each TU records which loading site it originated from. This enables location-based tracking, inventory management, and reporting by site.

## Loading Site Types — What Each Means

The **Site Type** field classifies the role of the loading site:
- **Yard**: a storage or staging yard where timber is held before loading
- **Forest**: a harvesting or felling site directly in the forest
- **Mill**: a sawmill or processing facility
- **Port**: a port terminal, container yard, or dock
- **Warehouse**: an enclosed warehouse or godown

Site Type is informational and used for filtering in reports and the Loading Sites list. It does not change the behaviour of the site in transactions.

## Required Fields for Loading Sites

To save a Loading Site you must provide:
- **Site Name**: a unique, descriptive name for this location (e.g., "Mumbai Port Yard 3", "Teak Forest Plot A", "Main Processing Mill")
- **Country**: the country where the site is located

Optional but useful fields:
- **State / Province**: the state or region (loaded from country selection)
- **City**: the city or town
- **Address**: full street address
- **Postal Code**: postal or ZIP code
- **Contact Person**: name of the site manager or primary contact
- **Phone**: site contact phone number
- **Operating Hours**: when the site is open (e.g., "Mon-Sat 08:00-18:00")
- **Capacity**: total timber storage capacity in CBM or number of logs
- **Current Volume**: current stock level at the site
- **Machines Installed**: list of equipment at the site (useful for mill and processing sites)
- **Site Type**: Yard, Forest, Mill, Port, or Warehouse
- **Notes**: any additional information about the site

## How to Create a Loading Site — Step by Step

1. Open **Loading Sites** from the main navigation menu.
2. Click the **add loading site** action.
3. Enter the Site Name.
4. Select Country. Then select State and City if available.
5. Fill in Address, Postal Code, Contact Person, Phone, Operating Hours, Capacity, and Site Type as needed.
6. Click **Save**.

The loading site is now available in the Transport Unit form when creating tally sheets.

## Editing a Loading Site

Open the Loading Sites list, find the site (use search), open the row, update any field, and save. Site Name must remain unique — if you rename a site to a name already used, a validation error appears.

## Deleting a Loading Site

Deletion is blocked if the site is linked to:
- Existing Transport Units
- Container records
- Bill of lading records

If a site has linked records, leave it active or update the address/contact details as needed. Historical records will retain the site information from the time of their creation.

## Searching Loading Sites

The Loading Sites list search covers: site name, contact person, country, state, city, capacity, machines installed, and notes. Type any keyword to filter the list. Column sorting is available for all visible columns.

## Common Problems with Products and Loading Sites

**"I chose the wrong formula (Round Log instead of Square/Sawn)"**
If no tally data has been entered yet: delete the TU, create a new product with the correct formula, and create a new TU. If tally data exists: you cannot change the formula. Create a new product with the correct formula, add a new TU, and re-enter the tally data. Contact support if this is a large dataset.

**"My HS Code is being rejected"**
HS codes must be numeric only (no hyphens or spaces) and must match the expected length for your system configuration (typically 6 or 8 digits). Check the exact format required by your country's customs authority.

**"I can't delete my product"**
The product is referenced by existing records. You cannot delete a product that has been used. If the product is no longer needed for future TUs, simply do not select it — it will not affect performance. If it appears incorrectly in dropdowns, contact your administrator.

**"The Loading Site is not appearing in the TU form"**
Check that the site is active (not deactivated). Also confirm you are on the correct tab — Transport Unit creation > Loading Site field. If the dropdown is empty, check whether you have permission to view Loading Sites.

**"The City dropdown is empty after selecting Country and State"**
Not all countries have state and city data loaded. For countries or regions without city data, type the city name manually in the address field.

## How Products and Loading Sites Connect to Other Modules

- **Tally Sheets / Transport Units**: every TU requires both a Product (determines Round or Square tally type) and a Loading Site (origin of the timber). These are set when creating the TU and cannot be changed later.
- **Inventory**: the Inventory module groups stock by Loading Site — the site becomes a location dimension in the inventory ledger. Inventory Overview can show stock by site.
- **Shipments**: product details (species, HS code) appear in shipment export documents. Loading site information appears in TU details within the shipment.
- **Reports**: Product Report shows all product records. Loading Site Report shows site-level information. Tally Report can filter by product or loading site.
- **Business Partners**: no direct link, but if a loading site is owned or managed by a Business Partner (e.g., a seller's yard), the relationship is tracked through the Operations notes on the BP record.
