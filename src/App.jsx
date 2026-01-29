import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { JobProvider } from "./context/JobContext";
import { BidsProvider } from "./context/BidsContext";

import "react-toastify/dist/ReactToastify.css";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ClientDashboard from "./pages/Client/Dashboard";
import FreelancerDashboard from "./pages/Freelancer/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import UserProfile from "./pages/Client/Profile";
import ChangePassword from "./components/ChangePassword";
import FreelancerProfile from "./pages/Client/OutProfile";

// Job Pages
import JobsMainPage from "./pages/Jobs/JobsMainPage";
import MyJobsPage from "./pages/Jobs/MyJobsPage";
import PostJobPage from "./pages/Jobs/PostJobPage";
import SavedJobsPage from "./pages/Jobs/SavedJobsPage";

// Layout
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Other Pages
import BidsManagementDashboard from "./pages/Client/BidsManagmentDashboard";
import BidsDashboard from "./pages/Freelancer/BidsDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import MessagesPage from "./pages/Messages/MessagesPage";
import AcceptedBidsPaymentPage from "./pages/Client/AcceptedBidsPaymentPage";
import FreelancerAcceptedBidsPage from "./pages/Freelancer/AcceptedBidsPage";
import AIChatWidget from "./pages/AIChatWidget";
import { Toaster } from "./components/ui/sonner";

/* ======================
   AUTH ROUTES
====================== */

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.some(role =>
      user.account_types?.includes(role) || user.user_type === role
    )
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.email !== "jithin3290@gmail.com") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/* ======================
   DASHBOARD REDIRECT
====================== */

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.email === "jithin3290@gmail.com") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.account_types?.includes("client")) {
    return <Navigate to="/client/dashboard" replace />;
  }

  if (user.account_types?.includes("freelancer")) {
    return <Navigate to="/freelancer/dashboard" replace />;
  }

  return <Navigate to="/jobs" replace />;
};

/* ======================
   UNAUTHORIZED PAGE
====================== */

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="mt-2">Access Denied</p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  </div>
);

/* ======================
   ROUTES
====================== */

const AppRoutes = () => {
  const location = useLocation();
  const noFooterRoutes = ["/login", "/register", "/messages", "/notifications"];
  const showFooter = !noFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          <Route
            path="/jobs/*"
            element={
              <ProtectedRoute>
                <JobProvider>
                  <JobsMainPage />
                </JobProvider>
              </ProtectedRoute>
            }
          />

          {/* Client */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/my-jobs"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <JobProvider>
                  <MyJobsPage />
                </JobProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/accepted"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <AcceptedBidsPaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/proposals"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <JobProvider>
                  <BidsProvider>
                    <BidsManagementDashboard />
                  </BidsProvider>
                </JobProvider>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/client/saved-jobs" 
            element={
                <JobProvider>
                <SavedJobsPage/>
                </JobProvider>
            } 
          />
          <Route 
            path="/client/profile" 
            element={
              <ProtectedRoute allowedRoles={['client', 'freelancer', 'admin']}>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          {/* Freelancer */}
          <Route
            path="/freelancer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["freelancer"]}>
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/freelancer/proposals"
            element={
              <ProtectedRoute allowedRoles={["freelancer"]}>
                <BidsProvider>
                  <BidsDashboard />
                </BidsProvider>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/freelancer/accepted" 
            element={
              <ProtectedRoute allowedRoles={['freelancer']}>
               
<FreelancerAcceptedBidsPage/>           
              </ProtectedRoute>
            } 
          />
          {/* Post Job Route */}
          <Route 
            path="/jobs/post" 
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <JobProvider>
                  <PostJobPage 
                    onBack={() => window.history.back()}
                    onJobPosted={(job) => {
                      console.log('Job posted:', job);
                      window.location.href = '/client/my-jobs';
                    }}
                  />
                </JobProvider>
              </ProtectedRoute>
            } 
          />
          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Shared */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/resetpass"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/freelancer/profile/:userId" 
            element={
              <ProtectedRoute>
                <FreelancerProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {showFooter && <Footer />}
      {showFooter && <AIChatWidget />}
      <Toaster position="bottom-center" />
    </div>
  );
};

/* ======================
   ROOT
====================== */

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  );
}
