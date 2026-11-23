
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const CV_PRICE_KOBO = 100_000; // ₦1,000
export const CV_CURRENCY = "NGN";

export function getPaystackSecretKey(): string {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const mode = process.env.PAYSTACK_MODE;

  if (mode !== "test" && mode !== "live") {
    throw new Error("PAYSTACK_MODE must be test or live.");
  }

  if (!secretKey) {
    throw new Error("Paystack secret key is not configured.");
  }

  const expectedPrefix =
    mode === "live" ? "sk_live_" : "sk_test_";

  if (!secretKey.startsWith(expectedPrefix)) {
    throw new Error(
      "Paystack secret key does not match PAYSTACK_MODE."
    );
  }

  if (
    mode === "live" &&
    process.env.VERCEL_ENV !== "production"
  ) {
    throw new Error(
      "Live Paystack payments require Vercel production."
    );
  }

  return secretKey;
}

export async function paystackRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const secretKey = getPaystackSecretKey();

  const response = await fetch(
    `${PAYSTACK_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Paystack request failed: ${response.status}`
    );
  }

  return response.json();
}
