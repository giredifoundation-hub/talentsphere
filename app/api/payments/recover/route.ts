
import { getAuthenticatedUser } from "@/lib/auth-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

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

    const { data: payment, error: paymentError } =
      await supabaseAdmin
        .from("cv_payments")
        .select("id, status, used_at, reserved_at, reservation_id")
        .eq("reference", reference)
        .eq("user_id", user.id)
        .eq("service_type", "cv_builder")
        .maybeSingle();

    if (paymentError) {
      throw new Error("Payment lookup failed.");
    }

    if (!payment) {
      return Response.json(
        { success: false, error: "Payment not found." },
        { status: 404 }
      );
    }

    if (payment.status !== "success") {
  return Response.json({
    success: true,
    recovered: false,
    paymentStatus: payment.status,
    canRetry: false,
  });
}

if (!payment.used_at) {
  const hasReservation =
    payment.reserved_at !== null ||
    payment.reservation_id !== null;

  return Response.json({
    success: true,
    recovered: false,
    paymentStatus: hasReservation
      ? "processing"
      : "ready_for_retry",
    canRetry: !hasReservation,
  });
}

    const { data: generation, error: generationError } =
      await supabaseAdmin
        .from("cv_generations")
        .select(
          "professional_summary, experience, skills, ats_keywords, missing_skills, cover_letter"
        )
        .eq("payment_reference", reference)
        .eq("user_id", user.id)
        .maybeSingle();

    if (generationError) {
      throw new Error("CV recovery lookup failed.");
    }

    if (!generation) {
      return Response.json(
        {
          success: false,
          error: "Payment was used, but CV recovery is unavailable.",
        },
        { status: 409 }
      );
    }

    return Response.json({
      success: true,
      recovered: true,
      data: {
        professionalSummary: generation.professional_summary,
        experience: generation.experience,
        skills: generation.skills,
        atsKeywords: generation.ats_keywords,
        missingSkills: generation.missing_skills,
        coverLetter: generation.cover_letter,
      },
    });
  } catch (error) {
    console.error("CV payment recovery failed:", {
      errorType:
        error instanceof Error ? error.name : "UnknownError",
    });

    return Response.json(
      { success: false, error: "Unable to recover CV." },
      { status: 500 }
    );
  }
}
