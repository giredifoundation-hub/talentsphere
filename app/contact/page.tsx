"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            TalentSphere
          </a>

          <a
            href="/"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-700 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">
          Contact TalentSphere
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          Have a question, suggestion, or want to stay connected with
          TalentSphere? Reach us through any of the options below.
        </p>
      </section>

      {/* Contact Options */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">
            Get in Touch
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <a
              href="tel:+2348083044560"
              className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">📞</div>

              <h3 className="mt-4 text-lg font-bold">
                Call Us
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                +234 808 304 4560
              </p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029VbE1Y70F6smrpt12HY0j"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">💬</div>

              <h3 className="mt-4 text-lg font-bold">
                WhatsApp Channel
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Follow our WhatsApp updates
              </p>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/TalentSphereJobs"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">✈️</div>

              <h3 className="mt-4 text-lg font-bold">
                Telegram
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Join TalentSphere Jobs
              </p>
            </a>

            {/* Email */}
            <a
              href="mailto:admin.talentsphere@gmail.com"
              className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">📧</div>

              <h3 className="mt-4 text-lg font-bold">
                Email
              </h3>

              <p className="mt-2 break-all text-sm text-gray-600">
                admin.talentsphere@gmail.com
              </p>
            </a>
          </div>

          {/* Message Form */}
          <div className="mt-10 rounded-xl border bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="py-10 text-center">
                <div className="text-5xl">✅</div>

                <h2 className="mt-5 text-2xl font-bold">
                  Message Received
                </h2>

                <p className="mt-3 text-gray-600">
                  Thank you for contacting TalentSphere.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">
                  Send Us a Message
                </h2>

                <p className="mt-2 text-gray-600">
                  You can also send us a message directly.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label className="mb-2 block font-semibold">
                      Your Name
                    </label>

                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Email Address
                    </label>

                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Subject
                    </label>

                    <input
                      required
                      type="text"
                      placeholder="How can we help?"
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Message
                    </label>

                    <textarea
                      required
                      rows={6}
                      placeholder="Write your message..."
                      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-10 text-center text-gray-400">
        <p>© 2026 TalentSphere. All rights reserved.</p>
      </footer>
    </main>
  );
}