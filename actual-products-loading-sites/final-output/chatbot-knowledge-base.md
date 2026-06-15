# Chatbot Knowledge Base: Products and Loading Sites

Use this file as source content for a LumberLinq help chatbot. Answers are based on verified captured UI behavior.

## Products

Intent: `explain_products`

User examples:
- What are Products?
- What is the Products module used for?
- Why do I need product records?

Answer:
Products are timber catalog records used across LumberLinq workflows. A product can represent round logs, sawn boards, sleepers, planks, poles, or other timber items. Product records help teams keep formula, HS code, species, product code, and description details consistent.

Intent: `open_products`

User examples:
- How do I open Products?
- Where is the Products page?

Answer:
Sign in to LumberLinq and open Products from the application menu. The Products page shows a product count, an Add New Product action, a searchable table, and product row actions.

Intent: `search_products`

User examples:
- How do I search products?
- Can I filter by product code?
- How do I find a product quickly?

Answer:
Open the Products page and use the search field above the table. You can search using product details such as name, species, product code, HS code, or description.

Intent: `create_product`

User examples:
- How do I create a product?
- How do I add a new timber product?

Answer:
Open Products, click Add New Product, enter the product name, select the formula, enter the HS code, add optional details such as species, product code, and description, then save.

Intent: `product_required_fields`

User examples:
- Which product fields are mandatory?
- Why can I not save a product?

Answer:
The captured validation state shows that Product Name, Formula, and HS Code are required. Complete these fields correctly before saving.

Intent: `product_formula_help`

User examples:
- Should I choose ROUND or SQUARE?
- Which formula is correct for sawn timber?

Answer:
Choose ROUND for round logs and pole-style products. Choose SQUARE for sawn or rectangular timber such as boards, planks, and sleepers.

Intent: `edit_product`

User examples:
- How do I edit a product?
- Can I update a product code?

Answer:
Open Products, search for the record if needed, open it using the row action, update the product details, and save the changes.

Intent: `delete_product`

User examples:
- How do I delete a product?
- Why do I see a delete confirmation?

Answer:
Use the delete action from the Products list or product form. LumberLinq shows a confirmation dialog before deletion. If the product is linked to operational records, deletion may be restricted.

## Loading Sites

Intent: `explain_loading_sites`

User examples:
- What are Loading Sites?
- What is the Loading Sites module used for?

Answer:
Loading Sites are physical places where timber is stored, processed, staged, or loaded. They can represent yards, mills, forests, ports, warehouses, or similar operational locations.

Intent: `open_loading_sites`

User examples:
- How do I open Loading Sites?
- Where are loading yards managed?

Answer:
Sign in to LumberLinq and open Loading Sites from the application menu. The page shows loading site records with search, add, edit, and delete actions.

Intent: `search_loading_sites`

User examples:
- How do I search loading sites?
- Can I find a site by city?

Answer:
Open Loading Sites and use the search field above the table. You can search by visible site details such as name, contact, country, state, city, capacity, machines, or notes.

Intent: `create_loading_site`

User examples:
- How do I create a loading site?
- How do I add a new yard?

Answer:
Open Loading Sites, click the add action, enter the site name, select the country, add optional location and operational details, then save.

Intent: `loading_site_required_fields`

User examples:
- Which loading site fields are mandatory?
- Why can I not save a loading site?

Answer:
The captured validation state shows that Site Name and Country are required. Complete these fields correctly before saving.

Intent: `edit_loading_site`

User examples:
- How do I edit a loading site?
- Can I update capacity or contact information?

Answer:
Open Loading Sites, search for the site if needed, open it using the row action, update the location, contact, capacity, operating, or notes fields, and save.

Intent: `delete_loading_site`

User examples:
- How do I delete a loading site?
- Why do I see a delete confirmation for a site?

Answer:
Use the delete action from the Loading Sites list or edit form. LumberLinq shows a confirmation dialog before deletion. If the site is linked to operational records, deletion may be restricted.

## Shared Guidance

Intent: `master_data_best_practice`

User examples:
- How should we maintain master data?
- How can we avoid duplicate products and sites?

Answer:
Use clear names, consistent product codes, accurate HS codes, and complete site details. Clean master data helps teams search faster, reduce duplicate records, and improve reporting across timber logistics operations.
