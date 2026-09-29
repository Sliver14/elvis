import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL is missing in .env.local')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function updatePaymentSettingsInDb() {
  console.log('Updating payment settings and formats in Neon DB...')

  const updatedSettings = {
    presale_active: true,
    expected_release_date: '2026-11-06T09:00:00+01:00',
    early_delivery_enabled: false,
    shipping_fee_domestic: 10.00,
    shipping_fee_international: 25.00,
    currency: 'USD',
    formats: [
      {
        format: 'digital_ebook',
        name: 'Ebook / PDF Edition',
        description: 'Complete high-definition digital eBook (PDF & EPUB). Delivered directly to your inbox upon official release.',
        price: 22.00,
        currency: 'USD',
        is_physical: false,
        available: true,
      },
      {
        format: 'audiobook',
        name: 'Audiobook Edition',
        description: 'Studio narrated audio masterclass edition with full chapter commentary and mindset exercises.',
        price: 28.00,
        currency: 'USD',
        is_physical: false,
        available: true,
      },
      {
        format: 'printed_hardcover',
        name: 'Hard Copy Edition',
        description: 'Executive clothbound hardcover with embossed gold foil lettering, delivered directly to your doorstep.',
        price: 45.00,
        currency: 'USD',
        is_physical: true,
        available: true,
      },
    ],
    bank: {
      enabled: false,
      bank_name: 'Standard Chartered Bank / Zenith Bank',
      account_name: "MUZAKIR'S ENTERPRISE",
      account_number: '0100234891100',
      routing_or_sort_code: 'SCBLGHAC',
      swift_bic: 'SCBLGHACXXX',
      currency: 'USD / GHS',
      instructions: 'Please initiate a wire or bank transfer for the exact total amount. Use your unique Order Reference Number as the transfer narrative/memo. Once transfer is completed, upload your transfer receipt below.',
    },
    mtn_momo: {
      enabled: true,
      provider_name: 'MTN Mobile Money',
      account_name: "MUZAKIR'S ENTERPRISE",
      phone_or_merchant_id: '0597433167',
      country: 'Ghana / West Africa',
      currency: 'GHS',
      instructions: "Send money to MTN MoMo line: 0597433167 (MUZAKIR'S ENTERPRISE). Enter your unique Order Number in the Reference field. Submit the Transaction ID or screenshot after sending.",
    },
    vodafone_momo: {
      enabled: true,
      provider_name: 'Vodafone Cash / Telecel Cash',
      account_name: "MUZAKIR'S ENTERPRISE",
      phone_or_merchant_id: '339042',
      country: 'Ghana',
      currency: 'GHS',
      instructions: "Send payment to Vodafone / Telecel Cash Till No: 339042 (MUZAKIR'S ENTERPRISE). Include your Order Number in reference notes. Submit the transaction ID or screenshot after sending.",
    },
    btc: {
      enabled: true,
      wallet_address: '1kPLHZutsrkFsf9DoTPuhDkQs6uKaTvb1',
      network: 'BTC',
      network_name: 'Bitcoin Mainnet',
      instructions: 'Send the exact amount in BTC to our verified Bitcoin Mainnet address: 1kPLHZutsrkFsf9DoTPuhDkQs6uKaTvb1. Copy the transaction hash (TxID) from your wallet and paste it below after broadcasting.',
    },
    usdt: {
      enabled: true,
      trc20_address: 'TM9Nhjsonrw5f15ePBoJG6cXpw5xZ5aggb',
      erc20_address: '',
      bep20_address: '',
      instructions: 'Send USDT via TRON (TRC20) network to our official address: TM9Nhjsonrw5f15ePBoJG6cXpw5xZ5aggb. Verify the selected network before transferring. Submit the Transaction Hash (TxID) below.',
    },
  }

  await sql`
    INSERT INTO admin_settings (key, value, updated_at)
    VALUES ('payment_settings', ${JSON.stringify(updatedSettings)}, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP;
  `

  console.log('Payment settings and formats updated successfully in Database!')
}

updatePaymentSettingsInDb().catch((err) => {
  console.error('Error updating payment settings:', err)
  process.exit(1)
})
