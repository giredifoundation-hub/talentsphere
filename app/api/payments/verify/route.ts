
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

    const body = await request.json().catch(() => null);
    const reference = body?.reference;

    if (
      typeof reference !== "string" ||
      !/^ts_cv_[0-9a-f-]{36}$/.test(reference)
    ) {
      return Response.json(
        { success: false, error: "Invalid payment reference." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createSupabaseAdminClient();

    const { data: payment, error: lookupError } =
      await supabaseAdmin
        .from("cv_payments")
        .select(
  "id, user_id, reference, service_type, amount_kobo, currency, status, used_at"
)
        .eq("reference", reference)
        .eq("user_id", user.id)
        .maybeSingle();

    if (lookupError) {
      throw new Error("Payment lookup failed.");
    }

    if (!payment) {
      return Response.json(
        { success: false, error: "Payment not found." },
        { status: 404 }
      );
    }

    if (
      payment.service_type !== "cv_builder" ||
      payment.amount_kobo !== CV_PRICE_KOBO ||
      payment.currency !== CV_CURRENCY
    ) {
      return Response.json(
        { success: false, error: "Payment details mismatch." },
        { status: 400 }
      );
    }

if (payment.used_at !== null) {
  return Response.json(
    {
      success: false,
      verified: false,
      error: "This payment has already been used.",
    },
    { status: 409 }
  );
}

    const result = await paystackRequest(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );

    const transaction = result.data;

    if (
  result.status !== true ||
  transaction?.reference !== reference ||
  transaction?.amount !== CV_PRICE_KOBO ||
  transaction?.currency !== CV_CURRENCY
) {
  return Response.json(
    {
      success: false,
      verified: false,
      error: "Payment verification details mismatch.",
    },
    { status: 400 }
  );
}

if (transaction?.status !== "success") {
  return Response.json(
    {
      success: false,
      verified: false,
      paymentStatus:
  transaction?.status === "failed"
    ? "failed"
    : transaction?.status === "abandoned"
      ? "abandoned"
      : "pending",
      error: "Payment has not been confirmed.",
    },
    { status: 400 }
  );
}


const { data: updatedPayment, error: updateError } =
  await supabaseAdmin
    .from("cv_payments")
    .update({
      status: "success",
      verified_at: new Date().toISOString(),
    })
    .eq("id", payment.id)
    .eq("user_id", user.id)
    .is("used_at", null)
    .select("id")
    .maybeSingle();

if (updateError) {
  throw new Error("Payment update failed.");
}

if (!updatedPayment) {
  return Response.json(
    {
      success: false,
      verified: false,
      error: "Payment is no longer available for verification.",
    },
    { status: 409 }
  );
}

    return Response.json({
      success: true,
      verified: true,
      reference,
    });
  } catch (error) {
    console.error("Payment verification failed:", {
      errorType:
        error instanceof Error ? error.name : "UnknownError",
    });

    return Response.json(
      {
        success: false,
        error: "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}
