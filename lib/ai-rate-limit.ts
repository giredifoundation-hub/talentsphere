import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function checkAiRateLimit(
  accessToken: string
): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data, error } = await supabase.rpc(
    "check_ai_cv_rate_limit"
  );

  if (error) {
    console.error("AI rate limit check failed:", error.message);
    return false;
  }

  return data === true;
}