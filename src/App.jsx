import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Auth/Register";
import Navbar from "./components/Layout/Navbar";
import Login from "./pages/Auth/Login";
import ClientDashboard from "./pages/Client/Dashboard";
import FreelancerDashboard from "./pages/Freelancer/Dashboard";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./pages/Admin/Dashboard";
import { useSelector } from "react-redux";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  const hasRole = allowedRoles.length === 0 || allowedRoles.some(role => {
    // Special handling for admin role - check is_staff or is_superuser
    if (role === 'admin') {
      return user.is_staff || user.is_superuser || user.account_types?.includes('admin') || user.user_type === 'admin';
    }
    return user.account_types?.includes(role) || user.user_type === role;
  });

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};


// Role-based Dashboard Redirect
const DashboardRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user roles and redirect accordingly
  if (user.is_staff || user.is_superuser) {
    return <Navigate to="/admin/dashboard" replace />
  } else if (user.account_types?.includes('client') || user.user_type === 'client') {
    return <Navigate to="/client/dashboard" replace />;
  } else if (user.account_types?.includes('freelancer') || user.user_type === 'freelancer') {
    return <Navigate to="/freelancer/dashboard" replace />;
  } else {
    // Default to jobs page if no specific role
    return <Navigate to="/jobs" replace />;
  }
};
function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Job Portal Routes - Available to all authenticated users */}
          {/* <Route 
            path="/jobs/*" 
            element={
              <ProtectedRoute  >
                <JobProvider>
                  <JobsMainPage />
                </JobProvider>
              </ProtectedRoute>
            } 
          /> */}

          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route 
            path="/client/my-jobs" 
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <JobProvider>
                  <MyJobsPage 
                    onJobClick={(jobId) => window.location.href = `/jobs?jobId=${jobId}`}
                    onPostJob={() => window.location.href = '/jobs/post'}
                  />
                </JobProvider>
              </ProtectedRoute>
            } 
          /> */}

          {/* <Route 
            path="/client/accepted" 
            element={
              <ProtectedRoute allowedRoles={['client']}>
               
                  <AcceptedBidsPaymentPage/>
           
              </ProtectedRoute>
            } 
          /> */}

          {/* Freelancer Routes */}
          <Route
            path="/freelancer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Freelancer Bids Dashboard */}
          {/* <Route 
            path="/freelancer/proposals" 
            element={
              <ProtectedRoute allowedRoles={['freelancer']}>
                <BidsProvider>
                  <BidsDashboard />
                </BidsProvider>
              </ProtectedRoute>
            } 
          /> */}

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              // <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              // </ProtectedRoute>
            }
          />

        </Routes>

      </div>
    </>
  );
}

export default App;
