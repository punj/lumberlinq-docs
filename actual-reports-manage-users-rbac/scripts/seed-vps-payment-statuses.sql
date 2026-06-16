USE lumberlinq_vps;

INSERT INTO purchase (
  created_by, created_date, last_modified_by, last_modified_date,
  company_name, currency, discount_amount, offer_price, payable_amount,
  payment_due_date, payment_method, payment_status,
  razorpay_order_id, razorpay_payment_id,
  external_order_id, external_payment_id, payment_gateway,
  subscription_start, subscription_end,
  tenure, total_price, tenant_id, company_id, subscription_package_id,
  auto_renewal
)
SELECT
  'll-help', v.created_date, 'll-help', v.created_date,
  'LL Help Payment Status Demo', v.currency, 0.00, v.payable_amount, v.payable_amount,
  v.payment_due_date, v.payment_method, v.payment_status,
  v.razorpay_order_id, v.razorpay_payment_id,
  v.external_order_id, v.external_payment_id, v.payment_gateway,
  v.subscription_start, v.subscription_end,
  v.tenure, v.payable_amount, 2, 2, v.subscription_package_id,
  0
FROM (
  SELECT 'CREATED' payment_status, 'CARD' payment_method, 'RAZORPAY' payment_gateway, 'INR' currency, 17110.00 payable_amount, 2 subscription_package_id, 'YEARLY' tenure,
         'LLHELP-PAY-CREATED-2026' razorpay_order_id, NULL razorpay_payment_id, NULL external_order_id, NULL external_payment_id,
         '2026-06-10 09:00:00.000000' created_date, '2026-06-17 09:00:00.000000' payment_due_date,
         '2026-06-10 09:00:00.000000' subscription_start, '2027-06-10 09:00:00.000000' subscription_end
  UNION ALL SELECT 'PENDING', 'UPI', 'CASHFREE', 'INR', 17110.00, 2, 'YEARLY',
         NULL, NULL, 'LLHELP-CF-PENDING-2026', NULL,
         '2026-06-11 10:00:00.000000', '2026-06-18 10:00:00.000000',
         '2026-06-11 10:00:00.000000', '2027-06-11 10:00:00.000000'
  UNION ALL SELECT 'CAPTURED', 'NETBANKING', 'CASHFREE', 'INR', 28320.00, 3, 'YEARLY',
         NULL, NULL, 'LLHELP-CF-CAPTURED-2026', 'LLHELP-CFPAY-CAPTURED-2026',
         '2026-06-12 11:00:00.000000', '2026-06-12 11:00:00.000000',
         '2026-06-12 11:00:00.000000', '2027-06-12 11:00:00.000000'
  UNION ALL SELECT 'FAILED', 'CARD', 'CASHFREE', 'INR', 17110.00, 2, 'YEARLY',
         NULL, NULL, 'LLHELP-CF-FAILED-2026', 'LLHELP-CFPAY-FAILED-2026',
         '2026-06-13 12:00:00.000000', '2026-06-20 12:00:00.000000',
         '2026-06-13 12:00:00.000000', '2027-06-13 12:00:00.000000'
  UNION ALL SELECT 'CANCELLED', 'UPI', 'CASHFREE', 'INR', 17110.00, 2, 'YEARLY',
         NULL, NULL, 'LLHELP-CF-CANCELLED-2026', 'LLHELP-CFPAY-CANCELLED-2026',
         '2026-06-14 13:00:00.000000', '2026-06-21 13:00:00.000000',
         '2026-06-14 13:00:00.000000', '2027-06-14 13:00:00.000000'
  UNION ALL SELECT 'FREE_TRIAL', 'FREE_TRIAL', 'FREE_TRIAL', 'INR', 0.00, 1, 'MONTHLY',
         NULL, 'LLHELP-FREE-TRIAL-2026', NULL, NULL,
         '2026-06-09 08:00:00.000000', '2026-06-09 08:00:00.000000',
         '2026-06-09 08:00:00.000000', '2026-06-23 08:00:00.000000'
) v
WHERE NOT EXISTS (
  SELECT 1
  FROM purchase p
  WHERE p.company_id = 2
    AND (
      p.razorpay_order_id = v.razorpay_order_id
      OR p.razorpay_payment_id = v.razorpay_payment_id
      OR p.external_order_id = v.external_order_id
      OR p.external_payment_id = v.external_payment_id
    )
);
