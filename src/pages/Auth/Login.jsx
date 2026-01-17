import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin, resetMfaState } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react";

import MFASetupModal from "./MFASetupModal";
import MFAVerificationModal from "./MFAVerificationModal";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
    user,
    mfaRequired,
    mfaSetupRequired,
  } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* =========================
     Redirect after full login
  ========================= */
  useEffect(() => {
    if (user && !mfaRequired) {
      const type = user.account_types?.[0] || "freelancer";

      if (type === "admin") navigate("/admin/dashboard");
      else if (type === "client") navigate("/client/dashboard");
      else navigate("/freelancer/dashboard");
    }
  }, [user, mfaRequired, navigate]);

  /* =========================
     Handle form login
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUser({ email, password }));

    if (loginUser.rejected.match(res)) {
      if (res.payload?.mfa_required) {
        toast.info(
          res.payload.mfa_setup_required
            ? "MFA setup required for admin account"
            : "Enter your authentication code"
        );
      } else {
        toast.error("Invalid email or password");
      }
    }
  };

  /* =========================
     Google login
  ========================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await dispatch(googleLogin({
        credential: credentialResponse.credential,
      })).unwrap();

      toast.success("Google login successful");

      // Navigation will happen via useEffect when user state updates
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    }
  };

  /* =========================
     Cancel MFA flow
  ========================= */
  const cancelMfaFlow = () => {
    dispatch(resetMfaState());
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-elevated p-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block text-3xl font-bold text-gradient mb-2">
                BidWise
              </Link>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 mt-1">Sign in to your account to continue</p>
            </div>

            {/* Error Message */}
            {error && !mfaRequired && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {typeof error === "string" ? error : "Authentication error"}
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={mfaRequired}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-11"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    disabled={mfaRequired}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || mfaRequired}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            {!mfaRequired && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                    shape="rectangular"
                    size="large"
                    width="100%"
                  />
                </div>
              </>
            )}

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* MFA Modals */}
      {mfaRequired && mfaSetupRequired && (
        <MFASetupModal
          isOpen={true}
          onClose={cancelMfaFlow}
          onComplete={() => { }}
        />
      )}

      {mfaRequired && !mfaSetupRequired && (
        <MFAVerificationModal
          isOpen={true}
          onClose={cancelMfaFlow}
        />
      )}
    </>
  );
};

export default Login;
