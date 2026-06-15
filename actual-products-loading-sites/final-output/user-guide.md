# Products and Loading Sites User Guide

This guide explains how to use the Products and Loading Sites modules in LumberLinq. The steps are based on the captured VPS application flow and the existing screenshots in `../screenshots`.

## Products

Products are timber catalog records used by operational workflows such as tally sheets, containers, transport units, measurements, and reports. A product record keeps the product name, measurement formula, HS code, species, product code, description, and related actions in one place.

### Open Products

1. Sign in to LumberLinq.
2. Open **Products** from the application menu.
3. Review the Products list.

The Products page shows a summary count, an **Add New Product** action, a searchable table, and action controls for each product.

Screenshot: `../screenshots/products-01-list-page.png`

### Search Products

1. Open the Products list.
2. Use the search field above the table.
3. Enter a product name, species, product code, HS code, or description.

The list filters to matching product records. In the captured flow, the search term `LL Help Demo` shows documentation demo products such as round logs, sawn boards, sleepers, planks, and utility poles.

Screenshot: `../screenshots/products-02-search-filter-demo.png`

### Create a Product

1. Click **Add New Product**.
2. Enter the product name.
3. Select the product formula.
4. Enter the HS code.
5. Add optional details such as species, product code, and description.
6. Save the product.

Use **ROUND** for round logs and poles. Use **SQUARE** for sawn or rectangular timber such as boards, planks, and sleepers.

Screenshot: `../screenshots/products-04-create-form.png`

### Product Validation

The form validates required product information before saving. The captured validation state shows that Product Name, Formula, and HS Code must be completed correctly.

Screenshot: `../screenshots/products-05-validation-state.png`

### Edit a Product

1. Open the Products list.
2. Search for the product if needed.
3. Open the product using the row action.
4. Update the product details.
5. Save the changes.

Screenshot: `../screenshots/products-06-edit-form.png`

### Delete a Product

Use the delete action from the Products list or product form. LumberLinq displays a confirmation dialog before deleting a product.

If a product is already used in operational records, deletion may be restricted to protect historical and linked transaction data.

Screenshot: `../screenshots/products-03-delete-confirmation.png`

## Loading Sites

Loading Sites are physical locations where timber is stored, processed, staged, or loaded. Examples include yards, mills, forests, ports, and warehouses.

### Open Loading Sites

1. Sign in to LumberLinq.
2. Open **Loading Sites** from the application menu.
3. Review the Loading Sites list.

The Loading Sites page shows a list of sites with search, add, edit, and delete actions.

Screenshot: `../screenshots/loading-sites-01-list-page.png`

### Search Loading Sites

1. Open the Loading Sites list.
2. Use the search field above the table.
3. Enter a site name, contact, country, state, city, capacity, machine detail, or note.

The list filters to matching loading site records. In the captured flow, `LL Help Demo` filters the page to documentation demo records.

Screenshot: `../screenshots/loading-sites-02-search-filter-demo.png`

### Create a Loading Site

1. Click the add loading site action.
2. Enter the site name.
3. Select the country.
4. Add optional location details such as state, city, address, and postal code.
5. Add optional operational details such as contact person, phone, operating hours, capacity, current volume, machines installed, site type, and notes.
6. Save the loading site.

Screenshot: `../screenshots/loading-sites-04-create-form.png`

### Loading Site Validation

The form validates required loading site information before saving. The captured validation state shows that Site Name and Country must be completed correctly.

Screenshot: `../screenshots/loading-sites-05-validation-state.png`

### Edit a Loading Site

1. Open the Loading Sites list.
2. Search for the site if needed.
3. Open the site using the row action.
4. Update location, contact, capacity, operating, or notes fields.
5. Save the changes.

Screenshot: `../screenshots/loading-sites-06-edit-form.png`

### Delete a Loading Site

Use the delete action from the Loading Sites list or edit form. LumberLinq displays a confirmation dialog before deleting the site.

If the loading site is linked to operational records, deletion may be restricted to protect transaction history.

Screenshot: `../screenshots/loading-sites-03-delete-confirmation.png`

## Recommended Operating Practice

Keep product names, HS codes, and loading site names consistent across the company. This reduces duplicate records, improves reporting, and helps teams search records quickly during daily timber logistics work.
