import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Search,
  Plus,
  ChevronDown,
  Shield,
  Briefcase,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const isAuthenticated = !!user;
  const accountTypes = user?.account_types || [];

  const isClient = accountTypes.includes("client");
  const isFreelancer = accountTypes.includes("freelancer");
  const isAdmin = accountTypes.includes("admin") || user?.is_staff;

  // Must call all hooks before any early returns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide navbar on login and register pages (after all hooks)
  const hideNavbarPaths = ["/login", "/register"];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    setShowUserMenu(false);
  };

  const getUserDisplayName = () =>
    user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`
      : user?.username || user?.email;

  const getUserRoleDisplay = () => {
    if (isClient && isFreelancer) return "Client & Freelancer";
    if (isAdmin) return "Administrator";
    if (isClient) return "Client";
    if (isFreelancer) return "Freelancer";
    return "Member";
  };

  const navigationItems = () => {
    if (!isAuthenticated) return [];

    const items = [];

    items.push({
      to: "/jobs",
      label: "Browse Jobs",
      icon: Search,
      active: location.pathname.startsWith("/jobs"),
    });

    if (isClient) {
      items.push({
        to: "/client/dashboard",
        label: "Dashboard",
        icon: Briefcase,
        active: location.pathname.includes("/client/dashboard"),
      });
      items.push({
        to: "/jobs/post",
        label: "Post Job",
        icon: Plus,
      });
    }

    if (isFreelancer) {
      items.push({
        to: "/freelancer/dashboard",
        label: "Dashboard",
        icon: Briefcase,
        active: location.pathname.includes("/freelancer/dashboard"),
      });
    }

    if (isAdmin) {
      items.push({
        to: "/admin/dashboard",
        label: "Admin",
        icon: Shield,
      });
    }

    return items;
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-gradient font-bold text-2xl"
        >
          BidWise
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 font-medium hover:text-primary-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Sign up
              </Link>
            </>
          ) : (
            navigationItems().map(({ to, label, icon: Icon, active }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${active
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))
          )}
        </nav>

        {/* User Menu */}
        {isAuthenticated && (
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-elevated overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="font-semibold text-gray-900 truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-primary-600 font-medium">{getUserRoleDisplay()}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                {navigationItems().map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-gray-400" />
                    {label}
                  </Link>
                ))}
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

