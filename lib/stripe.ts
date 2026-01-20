import Stripe from "stripe";

// Environment variable kontrolü ve debug
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set in environment variables.\n" +
    "Please check your .env.local file in the root directory.\n" +
    "Make sure the file contains: STRIPE_SECRET_KEY=sk_test_..."
  );
}

// Key format kontrolü
if (secretKey.includes("your_secret_key_here") || secretKey.includes("placeholder")) {
  throw new Error(
    "STRIPE_SECRET_KEY contains placeholder value.\n" +
    "Please replace 'sk_test_your_secret_key_here' with your actual Stripe secret key from:\n" +
    "https://dashboard.stripe.com/test/apikeys\n\n" +
    "Current value starts with: " + secretKey.substring(0, 20) + "..."
  );
}

if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
  throw new Error(
    "STRIPE_SECRET_KEY format is invalid.\n" +
    "Secret key must start with 'sk_test_' (for test mode) or 'sk_live_' (for live mode).\n" +
    "Current value starts with: " + secretKey.substring(0, 10) + "..."
  );
}

// 2026 için: API version belirtilmezse Stripe SDK otomatik olarak
// en son stabil versiyonu kullanır (her zaman güncel kalır)
const stripe = new Stripe(secretKey);

export default stripe;