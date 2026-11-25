"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmailVerifiedPage() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    async function verifyAccount() {
      try {
        const hash = new URLSearchParams(
          window.location.hash.substring(1)
        );

        const query = new URLSearchParams(
          window.location.search
        );

        if (hash.has("error") || query.has("error")) {
          setStatus("error");
          return;
        }

        const { data, error } = await supabase.auth.getUser();

        if (!error && data.user?.email_confirmed_at) {
          setStatus("verified");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }

    verifyAccount();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">

        <a href="/" className="text-3xl font-bold text-blue-700">
          TalentSphere
        </a>

        {status === "checking" && (
          <p className="mt-8 text-gray-600">
            Checking your email verification...
          </p>
        )}

        {status === "verified" && (
          <>
            <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
              {"\u2713"}
            </div>

            <h1 className="mt-6 text-2xl font-bold text-green-700">
              Email Verified Successfully!
            </h1>

            <p className="mt-4 text-gray-600">
              Your TalentSphere account is verified.
              You can now access our AI CV Builder and
              explore career opportunities.
            </p>

            <a
              href="/dashboard"
              className="mt-8 block rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800"
            >
              Continue to Dashboard
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mt-8 text-2xl font-bold text-red-700">
              Verification Could Not Be Confirmed
            </h1>

            <p className="mt-4 text-gray-600">
              Your link may have expired or your session
              could not be confirmed. Please try signing in.
            </p>

            <a
              href="/login"
              className="mt-8 block rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white"
            >
              Continue to Login
            </a>
          </>
        )}

        <a
          href="/"
          className="mt-6 block text-sm font-semibold text-blue-700"
        >
          Back to Homepage
        </a>
      </div>
    </main>
  );
}
