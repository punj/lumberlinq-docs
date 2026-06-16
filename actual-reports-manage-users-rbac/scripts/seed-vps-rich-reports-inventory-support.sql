SET @tenant_id := 2;
SET @company_id := 2;

UPDATE shipments SET shipment_date='2026-01-18', estimated_departure='2026-01-18 08:00:00', estimated_arrival='2026-02-03 12:00:00', payment_due_date='2026-02-20' WHERE bl_number='LL-DEMO-SHP-SEA-001' AND tenant_id=@tenant_id;
UPDATE shipments SET shipment_date='2026-02-12', estimated_departure='2026-02-12 09:00:00', estimated_arrival='2026-02-18 15:00:00', payment_due_date='2026-03-10' WHERE bl_number='LL-DEMO-SHP-AIR-002' AND tenant_id=@tenant_id;
UPDATE shipments SET shipment_date='2026-03-09', estimated_departure='2026-03-09 10:00:00', estimated_arrival='2026-03-29 18:00:00', payment_due_date='2026-04-18' WHERE bl_number='LL-DEMO-SHP-IMP-003' AND tenant_id=@tenant_id;
UPDATE shipments SET shipment_date='2026-04-15', estimated_departure='2026-04-15 07:00:00', estimated_arrival='2026-04-19 20:00:00', payment_due_date='2026-05-16' WHERE bl_number='LL-DEMO-SHP-ROAD-004' AND tenant_id=@tenant_id;
UPDATE shipments SET shipment_date='2026-05-08', estimated_departure='2026-05-08 06:00:00', estimated_arrival='2026-05-21 16:00:00', payment_due_date='2026-06-05' WHERE bl_number='LL-DEMO-SHP-RAIL-005' AND tenant_id=@tenant_id;
UPDATE shipments SET shipment_date='2026-05-28', estimated_departure='2026-05-28 11:00:00', estimated_arrival='2026-06-10 13:00:00', payment_due_date='2026-06-20' WHERE bl_number='LL-DEMO-SHP-TRD-006' AND tenant_id=@tenant_id;
UPDATE shipments SET shipment_date='2026-06-04', estimated_departure='2026-06-04 09:30:00', estimated_arrival='2026-06-11 17:00:00', payment_due_date='2026-06-25' WHERE bl_number='LL-DEMO-SHP-PAID-007' AND tenant_id=@tenant_id;
UPDATE shipments SET shipment_date='2026-06-14', estimated_departure='2026-06-14 06:45:00', estimated_arrival='2026-06-25 08:30:00', payment_due_date='2026-07-10' WHERE bl_number='LL-DEMO-SHP-ARR-008' AND tenant_id=@tenant_id;

UPDATE tally_master tm
JOIN transport_units tu ON tu.tally_master_id = tm.id
LEFT JOIN shipments s ON s.id = tu.shipment_id
SET tm.created_date = CASE
  WHEN s.bl_number='LL-DEMO-SHP-SEA-001' THEN '2026-01-17 08:20:00'
  WHEN s.bl_number='LL-DEMO-SHP-AIR-002' THEN '2026-02-11 09:15:00'
  WHEN s.bl_number='LL-DEMO-SHP-IMP-003' THEN '2026-03-08 10:10:00'
  WHEN s.bl_number='LL-DEMO-SHP-ROAD-004' THEN '2026-04-14 07:40:00'
  WHEN s.bl_number='LL-DEMO-SHP-RAIL-005' THEN '2026-05-07 06:25:00'
  WHEN s.bl_number='LL-DEMO-SHP-TRD-006' THEN '2026-05-27 11:45:00'
  WHEN s.bl_number='LL-DEMO-SHP-PAID-007' THEN '2026-06-03 09:55:00'
  WHEN s.bl_number='LL-DEMO-SHP-ARR-008' THEN '2026-06-13 06:55:00'
  WHEN tu.transport_id LIKE 'LL Help Demo%' THEN '2026-06-10 10:00:00'
  ELSE tm.created_date
END,
    tm.last_modified_date = NOW(6)
WHERE tm.tenant_id=@tenant_id AND (s.bl_number LIKE 'LL-DEMO-SHP-%' OR tu.transport_id LIKE 'LL Help Demo%');

UPDATE shipment_payments p
JOIN shipments s ON s.id = p.shipment_id
SET p.payment_date = CASE s.bl_number
  WHEN 'LL-DEMO-SHP-SEA-001' THEN '2026-01-25'
  WHEN 'LL-DEMO-SHP-AIR-002' THEN '2026-02-20'
  WHEN 'LL-DEMO-SHP-IMP-003' THEN '2026-03-18'
  WHEN 'LL-DEMO-SHP-ROAD-004' THEN '2026-04-22'
  WHEN 'LL-DEMO-SHP-RAIL-005' THEN '2026-05-18'
  WHEN 'LL-DEMO-SHP-TRD-006' THEN '2026-06-02'
  WHEN 'LL-DEMO-SHP-PAID-007' THEN '2026-06-08'
  WHEN 'LL-DEMO-SHP-ARR-008' THEN '2026-06-15'
  ELSE p.payment_date
END,
    p.last_modified_date = NOW(6)
WHERE p.tenant_id=@tenant_id AND s.bl_number LIKE 'LL-DEMO-SHP-%';

UPDATE loading_site SET capacity='1200', current_volume='735' WHERE tenant_id=@tenant_id AND name LIKE '%North Yard%';
UPDATE loading_site SET capacity='2500', current_volume='1680' WHERE tenant_id=@tenant_id AND name LIKE '%Port Loading Bay%';
UPDATE loading_site SET capacity='800', current_volume='520' WHERE tenant_id=@tenant_id AND name LIKE '%East Sawmill%';
UPDATE loading_site SET capacity='600', current_volume='385' WHERE tenant_id=@tenant_id AND name LIKE '%Forest Depot%';
UPDATE loading_site SET capacity='1500', current_volume='1040' WHERE tenant_id=@tenant_id AND name LIKE '%Warehouse Stack A%';

INSERT INTO inventory_movements (
  created_by, created_date, last_modified_by, last_modified_date,
  business_partner_name, cbm, encoded_id, loading_site_id, loading_site_name,
  movement_at, movement_type, notes, pieces, product_name, reference_code,
  reference_id, reference_type, tally_type, transport_unit_id, tenant_id
)
SELECT 'LL Help Demo', NOW(6), 'LL Help Demo', NOW(6), bp, cbm, enc, site_id, site_name, moved_at, mov_type, notes, pieces, product, ref_code, ref_id, ref_type, tally_type, tu_id, @tenant_id
FROM (
  SELECT 'Mahadev Export' bp, 18.4200 cbm, 'LLHELP-INV-MOV-001' enc, 1 site_id, 'North Yard' site_name, '2026-01-17 08:30:00' moved_at, 'IN' mov_type, 'Received round logs into yard' notes, 115 pieces, 'Teak Round Logs' product, 'LL-DEMO-SHP-SEA-001' ref_code, 1 ref_id, 'SHIPMENT' ref_type, 'ROUND' tally_type, 1 tu_id
  UNION ALL SELECT 'Saw Mill Partner', 8.7500, 'LLHELP-INV-MOV-002', 3, 'East Sawmill', '2026-02-11 09:20:00', 'IN', 'Short logs received for processing', 74, 'Acacia Round Logs', 'LL-DEMO-SHP-AIR-002', 2, 'SHIPMENT', 'ROUND', 4
  UNION ALL SELECT 'Kandla Timber Buyer', 11.3000, 'LLHELP-INV-MOV-003', 4, 'Forest Depot', '2026-03-08 10:20:00', 'IN', 'Imported stock received', 92, 'Gurjan Round Logs', 'LL-DEMO-SHP-IMP-003', 3, 'SHIPMENT', 'ROUND', 5
  UNION ALL SELECT 'Mumbai Timber Buyer', -2.1500, 'LLHELP-INV-MOV-004', 1, 'North Yard', '2026-03-20 15:00:00', 'ADJUSTMENT', 'Moisture shrinkage adjustment', -8, 'Teak Round Logs', 'TU-AVAIL-004', 4, 'TRANSPORT_UNIT', 'ROUND', 4
  UNION ALL SELECT 'Internal Processing', 24.4000, 'LLHELP-INV-MOV-005', 3, 'East Sawmill', '2026-04-15 07:40:00', 'PROC_IN', 'Sent to mill for cutting', 180, 'Teak Round Logs', 'LL-PR-2026-APR-01', 1, 'PROCESSING_RUN', 'ROUND', 5
  UNION ALL SELECT 'Internal Processing', 10.4000, 'LLHELP-INV-MOV-006', 5, 'Warehouse Stack A', '2026-04-17 18:10:00', 'PROC_OUT', 'Processed square boards returned', 520, 'Teak Square Boards', 'LL-PR-2026-APR-01', 1, 'PROCESSING_RUN', 'SQUARE', 6
  UNION ALL SELECT 'Export Customer', 31.8500, 'LLHELP-INV-MOV-007', 2, 'Port Loading Bay', '2026-05-08 06:40:00', 'IN_SHIPMENT', 'Moved to export shipment staging', 680, 'Meranti Boards', 'LL-DEMO-SHP-RAIL-005', 5, 'SHIPMENT', 'SQUARE', 2
  UNION ALL SELECT 'Export Customer', -0.8500, 'LLHELP-INV-MOV-008', 2, 'Port Loading Bay', '2026-05-14 11:25:00', 'ADJUSTMENT', 'Bundle count correction after inspection', -12, 'Meranti Boards', 'LL-DEMO-SHP-RAIL-005', 5, 'SHIPMENT', 'SQUARE', 2
  UNION ALL SELECT 'Warehouse Stock', 16.8000, 'LLHELP-INV-MOV-009', 5, 'Warehouse Stack A', '2026-06-03 09:20:00', 'IN', 'Finished boards added to stock', 640, 'Teak Square Boards', 'TU-SHIPPED-006', 6, 'TRANSPORT_UNIT', 'SQUARE', 6
  UNION ALL SELECT 'Domestic Customer', 13.4000, 'LLHELP-INV-MOV-010', 5, 'Warehouse Stack A', '2026-06-08 12:40:00', 'OUT', 'Released to domestic sales order', 420, 'Teak Square Boards', 'LL-DEMO-SHP-PAID-007', 7, 'SHIPMENT', 'SQUARE', 6
  UNION ALL SELECT 'Field Supervisor', 7.9500, 'LLHELP-INV-MOV-011', 4, 'Forest Depot', '2026-06-12 16:05:00', 'IN', 'Additional small-diameter logs', 66, 'Pine Round Logs', 'LL-DEMO-SHP-ARR-008', 8, 'SHIPMENT', 'ROUND', 3
  UNION ALL SELECT 'Quality Team', -1.2500, 'LLHELP-INV-MOV-012', 4, 'Forest Depot', '2026-06-14 10:35:00', 'ADJUSTMENT', 'Rejected cracked ends after grading', -5, 'Pine Round Logs', 'LL-DEMO-SHP-ARR-008', 8, 'SHIPMENT', 'ROUND', 3
) x
WHERE NOT EXISTS (SELECT 1 FROM inventory_movements im WHERE im.encoded_id = x.enc);

UPDATE processing_runs SET
  processing_date = CASE run_code
    WHEN 'LL-PR-2026-APR-01' THEN '2026-04-15'
    WHEN 'LL-PR-2026-JUN-02' THEN '2026-06-03'
    WHEN 'LL-PR-2026-JUN-03' THEN '2026-06-13'
    ELSE processing_date
  END,
  started_at = CASE run_code
    WHEN 'LL-PR-2026-APR-01' THEN '2026-04-15 07:45:00'
    WHEN 'LL-PR-2026-JUN-02' THEN '2026-06-03 09:00:00'
    WHEN 'LL-PR-2026-JUN-03' THEN '2026-06-13 08:15:00'
    ELSE started_at
  END,
  completed_at = CASE run_code
    WHEN 'LL-PR-2026-APR-01' THEN '2026-04-17 18:00:00'
    WHEN 'LL-PR-2026-JUN-02' THEN '2026-06-05 17:30:00'
    ELSE completed_at
  END,
  last_modified_date = NOW(6)
WHERE tenant_id=@tenant_id AND run_code LIKE 'LL-PR-2026-%';

INSERT INTO processing_runs (
  created_by, created_date, last_modified_by, last_modified_date, completed_at, encoded_id,
  input_cbm, input_pieces, input_product_name, loss_cbm, mill_site_id, mill_site_name,
  notes, output_cbm, output_method, output_pieces, output_product_name, output_site_id,
  output_site_name, outturn_ratio, processing_date, run_code, started_at, status, tenant_id
)
SELECT 'LL Help Demo', NOW(6), 'LL Help Demo', NOW(6), completed_at, enc, input_cbm, input_pieces, input_product, loss_cbm, mill_site_id, mill_site_name, notes, output_cbm, output_method, output_pieces, output_product, output_site_id, output_site_name, outturn, proc_date, run_code, started_at, status, @tenant_id
FROM (
  SELECT '2026-02-18 16:15:00' completed_at, 'LLHELP-PROC-FEB-01' enc, 19.8500 input_cbm, 155 input_pieces, 'Acacia Round Logs' input_product, 7.2500 loss_cbm, 3 mill_site_id, 'East Sawmill' mill_site_name, 'Demo conversion to pallet boards' notes, 12.6000 output_cbm, 'DIRECT' output_method, 480 output_pieces, 'Acacia Pallet Boards' output_product, 5 output_site_id, 'Warehouse Stack A' output_site_name, 0.6348 outturn, '2026-02-16' proc_date, 'LL-PR-2026-FEB-01' run_code, '2026-02-16 08:00:00' started_at, 'COMPLETED' status
  UNION ALL SELECT '2026-05-20 18:20:00', 'LLHELP-PROC-MAY-02', 31.2000, 220, 'Meranti Round Logs', 11.4000, 3, 'East Sawmill', 'Demo export board production', 19.8000, 'DIRECT', 760, 'Meranti Export Boards', 2, 'Port Loading Bay', 0.6346, '2026-05-18', 'LL-PR-2026-MAY-02', '2026-05-18 07:30:00', 'COMPLETED'
  UNION ALL SELECT NULL, 'LLHELP-PROC-JUN-DRAFT', 14.6000, 96, 'Pine Round Logs', NULL, 4, 'Forest Depot', 'Demo draft awaiting mill slot', NULL, 'DIRECT', NULL, NULL, NULL, NULL, NULL, '2026-06-15', 'LL-PR-2026-JUN-DRAFT', NULL, 'DRAFT'
) x
WHERE NOT EXISTS (SELECT 1 FROM processing_runs pr WHERE pr.run_code = x.run_code AND pr.tenant_id=@tenant_id);

INSERT INTO support_ticket (
  assigned_to, category, company_id, company_name, created_at, description,
  last_replied_at, last_replied_by, priority, raised_by_email, raised_by_name,
  reply_count, resolved_at, status, tags, ticket_number, title, updated_at
)
SELECT x.assigned_to, x.category, @company_id, 'Mahadev Export', x.created_at, x.description, x.last_replied_at, x.last_replied_by, x.priority, 'shiv-vps@mahadev.com', 'Shiv Mahadev', x.reply_count, x.resolved_at, x.status, x.tags, x.ticket_number, x.title, x.updated_at
FROM (
  SELECT 'Support Team' assigned_to, 'TECHNICAL' category, '2026-06-03 09:15:00' created_at, 'Unable to export shipment report for a large month-end file.' description, '2026-06-03 14:20:00' last_replied_at, 'LumberLinq Support' last_replied_by, 'HIGH' priority, 2 reply_count, NULL resolved_at, 'IN_PROGRESS' status, 'reports,export,shipment' tags, 'LL-HELP-1001' ticket_number, 'Shipment report export needs review' title, '2026-06-03 14:20:00' updated_at
  UNION ALL SELECT 'Billing Desk', 'BILLING', '2026-06-05 11:05:00', 'Need GST details updated on subscription invoice.', '2026-06-05 13:45:00', 'LumberLinq Support', 'MEDIUM', 1, '2026-06-06 10:00:00', 'RESOLVED', 'billing,invoice,gst', 'LL-HELP-1002', 'Update billing details on invoice', '2026-06-06 10:00:00'
  UNION ALL SELECT 'Product Team', 'FEATURE_REQUEST', '2026-06-09 16:30:00', 'Request to add yard-wise utilization alert for loading sites.', NULL, NULL, 'LOW', 0, NULL, 'OPEN', 'loading-site,utilization', 'LL-HELP-1003', 'Yard utilization alert request', '2026-06-09 16:30:00'
  UNION ALL SELECT 'Technical Desk', 'DATA_RECOVERY', '2026-06-10 08:40:00', 'Need help recovering deleted tally attachment from last week.', '2026-06-10 09:55:00', 'LumberLinq Support', 'CRITICAL', 3, NULL, 'AWAITING_USER', 'documents,tally,recovery', 'LL-HELP-1004', 'Recover tally document attachment', '2026-06-10 09:55:00'
  UNION ALL SELECT 'Account Desk', 'SUBSCRIPTION', '2026-06-12 15:05:00', 'Review user limit and upgrade options for new branch users.', '2026-06-13 10:15:00', 'LumberLinq Support', 'MEDIUM', 2, NULL, 'IN_PROGRESS', 'subscription,users,rbac', 'LL-HELP-1005', 'Need additional user seats', '2026-06-13 10:15:00'
  UNION ALL SELECT 'Support Team', 'OTHER', '2026-06-14 18:20:00', 'General question about company ID for faster help.', NULL, NULL, 'LOW', 0, NULL, 'OPEN', 'company-id,help', 'LL-HELP-1006', 'Where to find Company ID for support', '2026-06-14 18:20:00'
) x
WHERE NOT EXISTS (SELECT 1 FROM support_ticket st WHERE st.ticket_number = x.ticket_number);

INSERT INTO ticket_reply (is_admin_reply, attachment_name, attachment_size, attachment_url, created_at, is_internal, message, replied_by_email, replied_by_name, ticket_id)
SELECT r.is_admin, r.attachment_name, r.attachment_size, r.attachment_url, r.created_at, r.is_internal, r.message, r.email, r.name, st.id
FROM support_ticket st
JOIN (
  SELECT 'LL-HELP-1001' ticket_number, 1 is_admin, NULL attachment_name, NULL attachment_size, NULL attachment_url, '2026-06-03 14:20:00' created_at, 0 is_internal, 'We are checking the export logs and will update shortly.' message, 'support@lumberlinq.com' email, 'LumberLinq Support' name
  UNION ALL SELECT 'LL-HELP-1004', 1, 'recovery-checklist.pdf', 184000, '/demo/recovery-checklist.pdf', '2026-06-10 09:55:00', 0, 'Please confirm the transport unit number and approximate upload time.', 'support@lumberlinq.com', 'LumberLinq Support'
  UNION ALL SELECT 'LL-HELP-1005', 1, NULL, NULL, NULL, '2026-06-13 10:15:00', 0, 'Your current plan usage has been reviewed. Upgrade options are available.', 'support@lumberlinq.com', 'LumberLinq Support'
) r ON r.ticket_number = st.ticket_number
WHERE NOT EXISTS (SELECT 1 FROM ticket_reply tr WHERE tr.ticket_id=st.id AND tr.created_at=r.created_at AND tr.message=r.message);
