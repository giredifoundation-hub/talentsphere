
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const CV_PRICE_KOBO = 100_000; // ₦1,000
export const CV_CURRENCY = "NGN";

export function getPaystackSecretKey(): string {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey || !secretKey.startsWith("sk_test_")) {
    throw new Error("Paystack test secret key is not configured.");
  }

  return secretKey;
}

export async function paystackRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const secretKey = getPaystackSecretKey();

  const response = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Paystack request failed: ${response.status}`);
  }

  return response.json();
}
