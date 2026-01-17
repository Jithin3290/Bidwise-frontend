import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/register"];

  if (hideFooterPaths.includes(location.pathname)) return null;

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-slate-900">BidWise</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              A reverse auction platform where clients post jobs with fixed
              budgets and freelancers compete to deliver real value.
            </p>
          </div>

          {/* Clients */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              For Clients
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/post-job"
                  className="text-sm text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/find-freelancers"
                  className="text-sm text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Find Freelancers
                </Link>
              </li>
            </ul>
          </div>

          {/* Freelancers */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              For Freelancers
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/find-jobs"
                  className="text-sm text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Find Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500 text-center">
            © {new Date().getFullYear()} BidWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
