export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold text-blue-700">
            TalentSphere
          </a>

          <a
            href="/"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Back to Home
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Disclaimer
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last updated: September 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                1. General Information
              </h2>

              <p className="mt-3">
                The information provided on TalentSphere is for general
                informational purposes only. While we make reasonable efforts
                to provide useful and accurate information, we do not guarantee
                that all information is complete, accurate, reliable, or
                up-to-date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                2. No Guarantee of Opportunities
              </h2>

              <p className="mt-3">
                Listing an opportunity on TalentSphere does not guarantee that
                the opportunity is still available, that you are eligible, or
                that you will be selected.
              </p>

              <p className="mt-3">
                Users are responsible for checking the official source of each
                opportunity before submitting an application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                3. External Links
              </h2>

              <p className="mt-3">
                TalentSphere may provide links to external websites belonging
                to organizations, employers, educational institutions,
                governments, companies, or other third parties.
              </p>

              <p className="mt-3">
                We do not control or guarantee the accuracy, security,
                availability, or reliability of external websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Applications and Selection
              </h2>

              <p className="mt-3">
                TalentSphere is not responsible for the outcome of any
                application submitted through an opportunity listed on the
                website.
              </p>

              <p className="mt-3">
                Hiring, scholarship, grant, fellowship, internship, training,
                and admission decisions are made solely by the respective
                organizations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                5. Financial and Professional Disclaimer
              </h2>

              <p className="mt-3">
                TalentSphere does not provide financial, legal, immigration,
                employment, educational, or professional advice through its
                opportunity listings.
              </p>

              <p className="mt-3">
                Users should obtain appropriate professional advice where
                necessary before making important decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                6. Fraud Awareness
              </h2>

              <p className="mt-3">
                Users should be cautious of fraudulent opportunities, fake
                recruitment offers, requests for money, requests for sensitive
                information, and suspicious application links.
              </p>

              <p className="mt-3">
                Never send money or sensitive personal information unless you
                have independently verified the legitimacy of the organization
                and opportunity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                7. Accuracy of Information
              </h2>

              <p className="mt-3">
                Deadlines, eligibility requirements, application procedures,
                contact information, and other opportunity details may change
                without notice.
              </p>

              <p className="mt-3">
                Always confirm important details directly with the official
                organization responsible for the opportunity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                8. No Liability
              </h2>

              <p className="mt-3">
                To the extent permitted by applicable law, TalentSphere is not
                liable for any loss, damage, missed deadline, unsuccessful
                application, fraud, or other consequence resulting from
                reliance on information published on the website or from the
                use of external websites linked through TalentSphere.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Changes to This Disclaimer
              </h2>

              <p className="mt-3">
                We may update this Disclaimer from time to time. Any changes
                will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                10. Contact Us
              </h2>

              <p className="mt-3">
                If you have questions or concerns about information published
                on TalentSphere, please contact us at:
              </p>

              <p className="mt-3 font-medium">
                Email:{" "}
                <a
                  href="mailto:admin.talentsphere@gmail.com"
                  className="text-blue-700 hover:underline"
                >
                  admin.talentsphere@gmail.com
                </a>
              </p>

              <p className="mt-2 font-medium">
                Phone:{" "}
                <a
                  href="tel:+2348083044560"
                  className="text-blue-700 hover:underline"
                >
                  +234 808 304 4560
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-500">
          © 2026 TalentSphere. All rights reserved.
        </div>
      </footer>
    </main>
  );
}