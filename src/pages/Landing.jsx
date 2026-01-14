import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-white text-slate-900">
      {/* Navbar */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">BidWise</h1>
          <nav className="space-x-6">
            <Link to="/login" className="text-sm hover:text-primary">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-white px-4 py-2 rounded text-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Hire Top Freelancers <br />
            <span className="text-primary">Without the Noise</span>
          </h2>
          <p className="mt-6 text-slate-600 max-w-lg">
            BidWise connects clients with verified freelancers using smart
            matching, real reviews, and transparent pricing.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register?role=client"
              className="bg-primary text-white px-6 py-3 rounded font-medium"
            >
              Hire Talent
            </Link>
            <Link
              to="/register?role=freelancer"
              className="border border-slate-300 px-6 py-3 rounded font-medium"
            >
              Work as Freelancer
            </Link>
          </div>
        </div>

        <div className="bg-slate-100 rounded-xl h-80 flex items-center justify-center">
          <span className="text-slate-400">
            Dashboard Preview / Illustration
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center">
            Why Choose BidWise?
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Feature
              title="Verified Profiles"
              text="Every freelancer goes through identity and skill validation."
            />
            <Feature
              title="Smart Matching"
              text="AI-powered ranking helps you find the best fit fast."
            />
            <Feature
              title="Secure Payments"
              text="Escrow-based payments ensure trust on both sides."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold">
            Ready to build something great?
          </h3>
          <p className="mt-4 text-slate-600">
            Join thousands of clients and freelancers already using BidWise.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-primary text-white px-8 py-4 rounded font-medium"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-7xl mx-auto px-6 text-sm text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} BidWise</span>
          <div className="space-x-4">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({ title, text }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h4 className="font-semibold text-lg">{title}</h4>
    <p className="mt-2 text-slate-600 text-sm">{text}</p>
  </div>
);

export default Landing;
