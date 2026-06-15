SET @company_id := 2;
SET @tenant_id := 2;
SET @admin_user_id := 2;

UPDATE company_tally_sheet
SET rbac_enabled = 1
WHERE id = @company_id AND tenant_id = @tenant_id;

UPDATE users
SET
  first_name = CASE email
    WHEN 'll-help-demo-ops@lumberlinq.example' THEN 'Amit'
    WHEN 'll-help-demo-finance@lumberlinq.example' THEN 'Meera'
    WHEN 'll-help-demo-field@lumberlinq.example' THEN 'Ravi'
    WHEN 'll-help-demo-viewer@lumberlinq.example' THEN 'Sara'
    ELSE first_name
  END,
  last_name = CASE email
    WHEN 'll-help-demo-ops@lumberlinq.example' THEN 'Yard Supervisor'
    WHEN 'll-help-demo-finance@lumberlinq.example' THEN 'Finance Analyst'
    WHEN 'll-help-demo-field@lumberlinq.example' THEN 'Field Operator'
    WHEN 'll-help-demo-viewer@lumberlinq.example' THEN 'Viewer'
    ELSE last_name
  END,
  is_blocked = CASE email WHEN 'll-help-demo-viewer@lumberlinq.example' THEN 1 ELSE 0 END,
  is_invited_user = 1,
  is_subscription_valid = b'1',
  registration_status = b'1',
  company_registered = b'1',
  onboarding_completed = b'1',
  timezone = 'Asia/Kolkata',
  user_type = CASE email WHEN 'll-help-demo-viewer@lumberlinq.example' THEN 2 ELSE 1 END,
  tenant_id = @tenant_id,
  company_id = @company_id,
  last_accessed_at = CASE email
    WHEN 'll-help-demo-ops@lumberlinq.example' THEN DATE_SUB(NOW(6), INTERVAL 12 MINUTE)
    WHEN 'll-help-demo-finance@lumberlinq.example' THEN DATE_SUB(NOW(6), INTERVAL 2 HOUR)
    WHEN 'll-help-demo-field@lumberlinq.example' THEN DATE_SUB(NOW(6), INTERVAL 1 DAY)
    WHEN 'll-help-demo-viewer@lumberlinq.example' THEN DATE_SUB(NOW(6), INTERVAL 9 DAY)
    ELSE last_accessed_at
  END,
  last_modified_by = 'LL Help Demo',
  last_modified_date = NOW(6)
WHERE email IN (
  'll-help-demo-ops@lumberlinq.example',
  'll-help-demo-finance@lumberlinq.example',
  'll-help-demo-field@lumberlinq.example',
  'll-help-demo-viewer@lumberlinq.example'
);

INSERT INTO users (
  created_by, created_date, last_modified_by, last_modified_date,
  email, first_name, last_name, is_blocked, is_email_verified, is_invited_user,
  is_mobile_verified, is_subscription_valid, social_login, social_login_provider,
  registration_status, company_registered, onboarding_completed,
  timezone, user_type, tenant_id, company_id, last_accessed_at,
  failed_login_attempts
)
SELECT 'LL Help Demo', NOW(6), 'LL Help Demo', NOW(6), 'll-help-demo-ops@lumberlinq.example', 'Amit', 'Yard Supervisor', 0, b'1', 1, b'1', b'1', 0, 'LOCAL', b'1', b'1', b'1', 'Asia/Kolkata', 1, @tenant_id, @company_id, DATE_SUB(NOW(6), INTERVAL 12 MINUTE), 0
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'll-help-demo-ops@lumberlinq.example')
UNION ALL
SELECT 'LL Help Demo', NOW(6), 'LL Help Demo', NOW(6), 'll-help-demo-finance@lumberlinq.example', 'Meera', 'Finance Analyst', 0, b'1', 1, b'1', b'1', 0, 'LOCAL', b'1', b'1', b'1', 'Asia/Kolkata', 1, @tenant_id, @company_id, DATE_SUB(NOW(6), INTERVAL 2 HOUR), 0
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'll-help-demo-finance@lumberlinq.example')
UNION ALL
SELECT 'LL Help Demo', NOW(6), 'LL Help Demo', NOW(6), 'll-help-demo-field@lumberlinq.example', 'Ravi', 'Field Operator', 0, b'1', 1, b'1', b'1', 0, 'LOCAL', b'1', b'1', b'1', 'Asia/Kolkata', 1, @tenant_id, @company_id, DATE_SUB(NOW(6), INTERVAL 1 DAY), 0
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'll-help-demo-field@lumberlinq.example')
UNION ALL
SELECT 'LL Help Demo', NOW(6), 'LL Help Demo', NOW(6), 'll-help-demo-viewer@lumberlinq.example', 'Sara', 'Viewer', 1, b'1', 1, b'1', b'1', 0, 'LOCAL', b'1', b'1', b'1', 'Asia/Kolkata', 2, @tenant_id, @company_id, DATE_SUB(NOW(6), INTERVAL 9 DAY), 0
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'll-help-demo-viewer@lumberlinq.example');

INSERT IGNORE INTO user_role (id, role_id, user_roles)
SELECT 900000 + id, 4, id
FROM users
WHERE email LIKE 'll-help-demo-%@lumberlinq.example';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT id, 900000 + id
FROM users
WHERE email LIKE 'll-help-demo-%@lumberlinq.example';

DELETE FROM user_permissions
WHERE tenant_pk = @tenant_id
  AND user_id IN (SELECT id FROM users WHERE email LIKE 'll-help-demo-%@lumberlinq.example');

INSERT INTO user_permissions (granted_at, granted_by, permission_code, tenant_pk, user_id)
SELECT NOW(6), @admin_user_id, p.code, @tenant_id, u.id
FROM users u
JOIN permission_definitions p ON p.code IN (
  'DASHBOARD_ACCESS',
  'TALLY_ACCESS', 'TALLY_ADD', 'TALLY_EDIT', 'TALLY_EXPORT',
  'SHIPMENT_ACCESS', 'SHIPMENT_EXPORT'
)
WHERE u.email = 'll-help-demo-ops@lumberlinq.example';

INSERT INTO user_permissions (granted_at, granted_by, permission_code, tenant_pk, user_id)
SELECT NOW(6), @admin_user_id, p.code, @tenant_id, u.id
FROM users u
JOIN permission_definitions p ON p.code IN (
  'DASHBOARD_ACCESS', 'TALLY_ACCESS', 'TALLY_EXPORT',
  'SHIPMENT_ACCESS', 'SHIPMENT_EXPORT',
  'BP_ACCESS', 'REPORT_ACCESS', 'REPORT_EXPORT', 'STORAGE_ACCESS'
)
WHERE u.email = 'll-help-demo-finance@lumberlinq.example';

INSERT INTO user_permissions (granted_at, granted_by, permission_code, tenant_pk, user_id)
SELECT NOW(6), @admin_user_id, p.code, @tenant_id, u.id
FROM users u
JOIN permission_definitions p ON p.code IN (
  'DASHBOARD_ACCESS', 'TALLY_ACCESS', 'TALLY_ADD'
)
WHERE u.email = 'll-help-demo-field@lumberlinq.example';

INSERT INTO user_permissions (granted_at, granted_by, permission_code, tenant_pk, user_id)
SELECT NOW(6), @admin_user_id, p.code, @tenant_id, u.id
FROM users u
JOIN permission_definitions p ON p.code IN (
  'DASHBOARD_ACCESS', 'REPORT_ACCESS'
)
WHERE u.email = 'll-help-demo-viewer@lumberlinq.example';

INSERT INTO permission_audit_log (action, done_at, done_by, permission_code, tenant_pk, user_id)
SELECT 'GRANT', DATE_SUB(NOW(6), INTERVAL 1 DAY), @admin_user_id, up.permission_code, up.tenant_pk, up.user_id
FROM user_permissions up
JOIN users u ON u.id = up.user_id
WHERE u.email LIKE 'll-help-demo-%@lumberlinq.example'
  AND NOT EXISTS (
    SELECT 1 FROM permission_audit_log pal
    WHERE pal.tenant_pk = up.tenant_pk
      AND pal.user_id = up.user_id
      AND pal.permission_code = up.permission_code
      AND pal.action = 'GRANT'
  );

UPDATE invitations
SET
  accepted = b'0',
  expiry_at = CASE email
    WHEN 'll-help-demo-new-yard@lumberlinq.example' THEN DATE_ADD(NOW(6), INTERVAL 22 HOUR)
    WHEN 'll-help-demo-reporting@lumberlinq.example' THEN DATE_ADD(NOW(6), INTERVAL 8 HOUR)
    WHEN 'll-help-demo-revoked@lumberlinq.example' THEN DATE_ADD(NOW(6), INTERVAL 3 HOUR)
    ELSE expiry_at
  END,
  invited_by_user_id = @admin_user_id,
  company_tallysheet_id = @company_id,
  tenant_id = @tenant_id,
  default_access_template = CASE email
    WHEN 'll-help-demo-new-yard@lumberlinq.example' THEN 'FIELD_OPERATOR'
    WHEN 'll-help-demo-reporting@lumberlinq.example' THEN 'ANALYST'
    WHEN 'll-help-demo-revoked@lumberlinq.example' THEN 'MANAGER'
    ELSE default_access_template
  END,
  revoked = CASE email WHEN 'll-help-demo-revoked@lumberlinq.example' THEN 1 ELSE 0 END
WHERE email IN (
  'll-help-demo-new-yard@lumberlinq.example',
  'll-help-demo-reporting@lumberlinq.example',
  'll-help-demo-revoked@lumberlinq.example'
);

INSERT INTO invitations (
  accepted, default_access_template, email, expiry_at, invited_by_user_id,
  token, company_id, company_tallysheet_id, tenant_id, revoked
)
SELECT b'0', 'FIELD_OPERATOR', 'll-help-demo-new-yard@lumberlinq.example', DATE_ADD(NOW(6), INTERVAL 22 HOUR), @admin_user_id, CONCAT('ll-help-demo-yard-', UNIX_TIMESTAMP()), NULL, @company_id, @tenant_id, 0
WHERE NOT EXISTS (SELECT 1 FROM invitations WHERE email = 'll-help-demo-new-yard@lumberlinq.example')
UNION ALL
SELECT b'0', 'ANALYST', 'll-help-demo-reporting@lumberlinq.example', DATE_ADD(NOW(6), INTERVAL 8 HOUR), @admin_user_id, CONCAT('ll-help-demo-reporting-', UNIX_TIMESTAMP()), NULL, @company_id, @tenant_id, 0
WHERE NOT EXISTS (SELECT 1 FROM invitations WHERE email = 'll-help-demo-reporting@lumberlinq.example')
UNION ALL
SELECT b'0', 'MANAGER', 'll-help-demo-revoked@lumberlinq.example', DATE_ADD(NOW(6), INTERVAL 3 HOUR), @admin_user_id, CONCAT('ll-help-demo-revoked-', UNIX_TIMESTAMP()), NULL, @company_id, @tenant_id, 1
WHERE NOT EXISTS (SELECT 1 FROM invitations WHERE email = 'll-help-demo-revoked@lumberlinq.example');
