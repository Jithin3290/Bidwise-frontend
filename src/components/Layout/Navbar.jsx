import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Search,
  Plus,
  FileText,
  ChevronDown,
  Shield,
  Briefcase,
  Bookmark,
  CheckCircle,
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          BidWise
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          ) : (
            navigationItems().map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-1 px-3 py-2">
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))
          )}
        </div>

        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <User className="h-6 w-6" />
              <ChevronDown className="h-4 w-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow">
                <div className="px-4 py-2 border-b">
                  <p className="font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500">{getUserRoleDisplay()}</p>
                </div>
                <Link to="/profile" className="menu-item">
                  Profile
                </Link>
                <button onClick={handleLogout} className="menu-item w-full">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}

        <button
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
