import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function checkJobReaderRateLimit(
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
    "check_job_reader_rate_limit"
  );

  if (error) {
    console.error(
      "Job Reader rate limit check failed:",
      error.message
    );
    return false;
  }

  return data === true;
}