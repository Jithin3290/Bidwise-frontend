import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Zap, DollarSign } from "lucide-react";

const Landing = () => {
  return (
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-100/50 to-transparent" />

        <div className="relative section py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                AI-Powered Matching
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Hire Top Freelancers{" "}
                <span className="text-gradient">Without the Noise</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
                BidWise connects clients with verified freelancers using smart
                AI matching, real reviews, and transparent pricing. Find your
                perfect match in minutes, not days.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register?role=client"
                  className="btn-primary group"
                >
                  Hire Talent
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register?role=freelancer"
                  className="btn-secondary"
                >
                  Work as Freelancer
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>10,000+ Verified Freelancers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>$50M+ Paid Out</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative animate-slide-up">
              <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-3xl p-8 lg:p-12">
                <div className="bg-white rounded-2xl shadow-elevated p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Match Score</h3>
                      <p className="text-sm text-gray-500">Find your perfect freelancer</p>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
                  </div>
                  <p className="text-right font-bold text-green-600">95% Match</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="section">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="text-gradient">BidWise</span>?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to hire smarter and work better
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Verified Profiles"
              description="Every freelancer goes through identity and skill validation. Work with verified professionals you can trust."
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <FeatureCard
              icon={Zap}
              title="Smart AI Matching"
              description="AI-powered ranking helps you find the best fit fast. Get matched with freelancers who truly fit your needs."
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
            <FeatureCard
              icon={DollarSign}
              title="Secure Payments"
              description="Escrow-based payments ensure trust on both sides. Pay only when you're satisfied with the work."
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="section">
          <div className="relative overflow-hidden rounded-[2rem] 
      bg-gradient-to-br from-slate-900 via-primary-900 to-slate-800 
      px-8 py-14 sm:px-12 lg:px-20 lg:py-20 
      text-center text-white shadow-2xl">

            {/* Ambient dark glows */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Ready to build something great?
              </h2>

              <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed">
                Join thousands of clients and freelancers using BidWise to collaborate,
                ship faster, and turn ideas into real products.
              </p>

              <div className="mt-10 flex justify-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 
              rounded-xl bg-white px-8 py-4 
              text-slate-900 font-semibold 
              shadow-lg transition-all duration-200 
              hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Create Free Account
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, iconBg, iconColor }) => (
  <div className="card-hover p-8">
    <div className={`inline-flex p-3 rounded-xl ${iconBg} mb-5`}>
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default Landing;
