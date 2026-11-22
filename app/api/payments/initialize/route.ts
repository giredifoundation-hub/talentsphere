
import { getAuthenticatedUser } from "@/lib/auth-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  CV_CURRENCY,
  CV_PRICE_KOBO,
  paystackRequest,
} from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

   if (!user.email) {
  return Response.json(
    { success: false, error: "Account email is required." },
    { status: 400 }
  );
}

// Generate a unique payment reference
const reference = `ts_cv_${crypto.randomUUID()}`;

const result = await paystackRequest(
  "/transaction/initialize",
  {
    method: "POST",
    body: JSON.stringify({
  email: user.email,
  amount: CV_PRICE_KOBO,
  currency: CV_CURRENCY,
  reference,
  callback_url:
  process.env.NODE_ENV === "production"
    ? "https://talentsphere.name.ng/cv-builder"
    : "http://localhost:3000/cv-builder",
}),
  }
);

    const paymentData = result.data;

   if (
  result.status !== true ||
  typeof paymentData?.authorization_url !== "string" ||
  typeof paymentData?.reference !== "string" ||
  !paymentData.authorization_url ||
  !paymentData.reference ||
  paymentData.reference !== reference
) {
  throw new Error("Invalid Paystack initialization response.");
}

    const supabaseAdmin = createSupabaseAdminClient();

    const { error: paymentError } = await supabaseAdmin
      .from("cv_payments")
     .insert({
  user_id: user.id,
  reference: paymentData.reference,
  service_type: "cv_builder",
  amount_kobo: CV_PRICE_KOBO,
  currency: CV_CURRENCY,
  status: "pending",
});

    if (paymentError) {
      console.error("Payment record creation failed:", {
        code: paymentError.code,
      });

      return Response.json(
        {
          success: false,
          error: "Unable to prepare payment. Please try again.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      authorizationUrl: paymentData.authorization_url,
      reference: paymentData.reference,
    });
  } catch (error) {
    console.error("Payment initialization failed:", {
      errorType:
        error instanceof Error ? error.name : "UnknownError",
    });

    return Response.json(
      {
        success: false,
        error: "Unable to initialize payment.",
      },
      { status: 500 }
    );
  }
}
