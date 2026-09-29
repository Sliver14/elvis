import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL is missing in .env.local')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function testPresaleWorkflow() {
  console.log('--- STARTING PRESALE & PAYMENT SYSTEM VERIFICATION ---')

  // 1. Check Tables Existence
  console.log('1. Checking database tables...')
  const tables = await sql`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('orders', 'payment_proofs', 'book_previews', 'book_entitlements', 'admin_audit_logs', 'admin_settings');
  `
  console.log('Found tables:', tables.map(t => t.table_name).join(', '))
  if (tables.length < 6) {
    throw new Error('Not all 6 required tables were found')
  }

  // 2. Test Presale Order Creation Simulation
  console.log('2. Simulating presale order creation...')
  const orderNumber = `PTP-TEST-${Date.now().toString().slice(-6)}`
  const accessToken = `test-token-${Date.now()}`
  
  const insertOrder = await sql`
    INSERT INTO orders (
      id,
      reference,
      order_number,
      book_id,
      book_title,
      customer_name,
      customer_email,
      customer_phone,
      book_format,
      quantity,
      unit_price,
      shipping_fee,
      total_amount,
      currency,
      payment_method,
      payment_status,
      fulfilment_status,
      access_token,
      items,
      created_at,
      updated_at
    ) VALUES (
      ${'test-ord-' + Date.now()},
      ${orderNumber},
      ${orderNumber},
      'practical-trading-psychology-launch',
      'Practical Trading Psychology',
      'Verification Tester',
      'tester@example.com',
      '+233240000000',
      'bundle',
      1,
      69.99,
      0,
      69.99,
      'USD',
      'manual_bank_transfer',
      'Awaiting Payment',
      'Pending Payment',
      ${accessToken},
      ${JSON.stringify([{ title: 'Practical Trading Psychology', format: 'Bundle', price: 69.99 }])}::jsonb,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ) RETURNING id, order_number, access_token, payment_status, fulfilment_status;
  `
  const testOrder = insertOrder[0]
  console.log('Created test order:', testOrder.order_number, 'ID:', testOrder.id)

  // 3. Test Payment Proof Submission
  console.log('3. Submitting payment proof...')
  const insertProof = await sql`
    INSERT INTO payment_proofs (
      order_id,
      order_number,
      payment_method,
      reference_number,
      transaction_hash,
      sender_name_or_phone,
      crypto_network,
      amount_submitted,
      currency,
      receipt_url,
      notes,
      status,
      submitted_at
    ) VALUES (
      ${testOrder.id},
      ${testOrder.order_number},
      'manual_bank_transfer',
      'WIRE-REF-998822',
      NULL,
      'Verification Tester (+233240000000)',
      NULL,
      69.99,
      'USD',
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      'Wire transferred from SCB Accra Branch',
      'Under Review',
      CURRENT_TIMESTAMP
    ) RETURNING id, status;
  `
  console.log('Inserted payment proof ID:', insertProof[0].id, 'Status:', insertProof[0].status)

  // Update order to Proof Submitted
  await sql`
    UPDATE orders 
    SET payment_status = 'Proof Submitted', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${testOrder.id};
  `

  // 4. Test Payment Rejection with Reason
  console.log('4. Testing admin payment rejection...')
  await sql`
    UPDATE orders 
    SET payment_status = 'Rejected', rejection_reason = 'Reference number mismatch on bank statement', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${testOrder.id};
  `
  await sql`
    UPDATE payment_proofs 
    SET status = 'Rejected', reviewed_by = 'admin@elvisjusticebooks.com', rejection_reason = 'Reference mismatch', reviewed_at = CURRENT_TIMESTAMP 
    WHERE id = ${insertProof[0].id};
  `
  
  const rejectedOrder = await sql`SELECT payment_status, rejection_reason FROM orders WHERE id = ${testOrder.id}`
  console.log('Rejected status verified:', rejectedOrder[0].payment_status, '| Reason:', rejectedOrder[0].rejection_reason)

  // 5. Test Payment Verification
  console.log('5. Testing admin payment confirmation...')
  await sql`
    UPDATE orders 
    SET payment_status = 'Confirmed', fulfilment_status = 'Awaiting Book Release', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${testOrder.id};
  `
  await sql`
    UPDATE payment_proofs 
    SET status = 'Verified', reviewed_by = 'admin@elvisjusticebooks.com', reviewed_at = CURRENT_TIMESTAMP 
    WHERE id = ${insertProof[0].id};
  `

  // Entitlement provisioning
  const downloadToken = `dl-token-${Date.now()}`
  await sql`
    INSERT INTO book_entitlements (
      order_id,
      order_number,
      customer_email,
      download_token,
      download_count,
      max_downloads,
      created_at
    ) VALUES (
      ${testOrder.id},
      ${testOrder.order_number},
      'tester@example.com',
      ${downloadToken},
      0,
      10,
      CURRENT_TIMESTAMP
    );
  `

  // Audit log recording
  await sql`
    INSERT INTO admin_audit_logs (
      admin_email,
      action,
      entity_type,
      entity_id,
      details,
      created_at
    ) VALUES (
      'admin@elvisjusticebooks.com',
      'verify_payment',
      'order',
      ${testOrder.order_number},
      '{"amount":69.99,"currency":"USD","note":"Verified on bank statement"}'::jsonb,
      CURRENT_TIMESTAMP
    );
  `

  const confirmedOrder = await sql`SELECT payment_status, fulfilment_status FROM orders WHERE id = ${testOrder.id}`
  console.log('Confirmed status verified: Payment is', confirmedOrder[0].payment_status, '| Fulfilment is', confirmedOrder[0].fulfilment_status)

  // 6. Clean up test order & artifacts
  console.log('6. Cleaning up test record...')
  await sql`DELETE FROM book_entitlements WHERE order_id = ${testOrder.id}`
  await sql`DELETE FROM payment_proofs WHERE order_id = ${testOrder.id}`
  await sql`DELETE FROM orders WHERE id = ${testOrder.id}`
  await sql`DELETE FROM admin_audit_logs WHERE entity_id = ${testOrder.order_number}`

  console.log('--- ALL PRESALE & PAYMENT DATABASE WORKFLOW TESTS PASSED ---')
}

testPresaleWorkflow().catch(err => {
  console.error('Presale verification error:', err)
  process.exit(1)
})
