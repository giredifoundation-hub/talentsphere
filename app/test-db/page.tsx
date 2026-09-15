"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDatabase() {
  const [message, setMessage] = useState("Testing database connection...");

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .limit(1);

      if (error) {
        console.error(error);
        setMessage("Database connection failed: " + error.message);
        return;
      }

      setMessage(
        "Database connected successfully! Opportunities found: " +
          data.length
      );
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="rounded-xl bg-white p-10 text-center shadow">
        <h1 className="text-2xl font-bold">
          TalentSphere Database Test
        </h1>

        <p className="mt-4 text-gray-600">
          {message}
        </p>
      </div>
    </main>
  );
}