export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold text-blue-700">
            OPPORTUNITY SPHERE
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
      <section className="bg-blue-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            About OPPORTUNITY SPHERE
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
            Connecting people with meaningful opportunities around the world.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Who We Are
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              OPPORTUNITY SPHERE is an opportunity discovery platform designed to
              help people find jobs, grants, scholarships, fellowships and
              other career and educational opportunities.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Our goal is to make opportunity discovery simple, accessible
              and easier for students, graduates, professionals,
              entrepreneurs and other people looking to grow.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              What We Do
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              We publish and organize opportunities into categories so that
              visitors can quickly discover opportunities that may match
              their interests and goals.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-5">
                <div className="text-3xl">💼</div>
                <h3 className="mt-3 font-bold">Jobs</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Career and employment opportunities.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <div className="text-3xl">💰</div>
                <h3 className="mt-3 font-bold">Grants</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Funding and financial support opportunities.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <div className="text-3xl">🎓</div>
                <h3 className="mt-3 font-bold">Scholarships</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Educational funding opportunities.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-5">
                <div className="text-3xl">🌍</div>
                <h3 className="mt-3 font-bold">Fellowships</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Professional, academic and development programs.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Our Mission
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Our mission is to help people discover opportunities that can
              support their education, career development, professional
              growth and personal goals.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Important Notice
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              OPPORTUNITY SPHERE provides opportunity information for discovery
              purposes. Visitors should always review the official
              organization website and application requirements before
              applying.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-10 text-center text-gray-400">
        <p>© 2026 OPPORTUNITY SPHERE. All rights reserved.</p>
      </footer>
    </main>
  );
}