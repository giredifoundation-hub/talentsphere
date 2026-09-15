export default function TermsAndConditions() {
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
            Terms & Conditions
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last updated: September 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Acceptance of Terms
              </h2>

              <p className="mt-3">
                By accessing or using TalentSphere, you agree to be bound by
                these Terms & Conditions. If you do not agree with these terms,
                please do not use the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                2. About TalentSphere
              </h2>

              <p className="mt-3">
                TalentSphere is an opportunities platform that helps users
                discover jobs, grants, scholarships, fellowships, internships,
                trainings, and other opportunities.
              </p>

              <p className="mt-3">
                TalentSphere may provide links to external websites where users
                can obtain additional information or submit applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Use of the Website
              </h2>

              <p className="mt-3">
                You agree to use TalentSphere only for lawful purposes and in a
                way that does not interfere with the operation or security of
                the website.
              </p>

              <p className="mt-3">You must not:</p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Use the website for fraudulent or unlawful activities.</li>
                <li>
                  Attempt to gain unauthorized access to the website or its
                  systems.
                </li>
                <li>
                  Interfere with the availability, security, or functionality
                  of the website.
                </li>
                <li>
                  Submit misleading or harmful information through the website.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Opportunity Information
              </h2>

              <p className="mt-3">
                TalentSphere makes reasonable efforts to present useful
                opportunity information, but we do not guarantee that every
                listing is accurate, complete, current, available, or suitable
                for every user.
              </p>

              <p className="mt-3">
                Users should independently verify important details such as
                eligibility requirements, deadlines, fees, application
                procedures, and organization information before applying.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                5. Third-Party Websites
              </h2>

              <p className="mt-3">
                TalentSphere may contain links to websites operated by third
                parties. We do not control those websites and are not
                responsible for their content, policies, security, products,
                services, or practices.
              </p>

              <p className="mt-3">
                Your use of a third-party website is subject to that
                website's own terms and policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                6. Applications
              </h2>

              <p className="mt-3">
                TalentSphere does not make hiring, scholarship, grant,
                fellowship, or admission decisions on behalf of organizations
                that publish opportunities.
              </p>

              <p className="mt-3">
                Any application submitted through an external application
                website is handled by the relevant organization or
                third-party service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                7. Intellectual Property
              </h2>

              <p className="mt-3">
                Unless otherwise stated, the TalentSphere website, branding,
                design, text, and original materials are protected by
                applicable intellectual property laws.
              </p>

              <p className="mt-3">
                You may not reproduce, modify, distribute, or commercially
                exploit TalentSphere materials without appropriate
                authorization.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                8. Disclaimer of Warranties
              </h2>

              <p className="mt-3">
                TalentSphere is provided on an "as is" and "as available"
                basis. We do not guarantee uninterrupted availability,
                error-free operation, or that all information on the website
                will always be complete or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Limitation of Liability
              </h2>

              <p className="mt-3">
                To the extent permitted by applicable law, TalentSphere shall
                not be responsible for losses, damages, missed opportunities,
                application outcomes, or other consequences arising from the
                use of the website or reliance on information provided through
                it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                10. Changes to These Terms
              </h2>

              <p className="mt-3">
                We may update these Terms & Conditions from time to time.
                Updated terms will be posted on this page together with a
                revised update date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                11. Contact
              </h2>

              <p className="mt-3">
                If you have questions about these Terms & Conditions, contact
                us at:
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