import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin, resetMfaState } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";

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
    const res = await dispatch(
      googleLogin({ credential: credentialResponse.credential })
    );

    if (googleLogin.fulfilled.match(res)) {
      toast.success("Google login successful");
    } else {
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
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center">Sign in</h2>

        {error && !mfaRequired && (
          <div className="bg-red-100 text-red-700 p-2 mt-3 rounded">
            {typeof error === "string" ? error : "Authentication error"}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={mfaRequired}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={mfaRequired}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <button
            disabled={loading || mfaRequired}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {!mfaRequired && (
          <>
            <div className="my-4 text-center text-gray-500">OR</div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
              />
            </div>
          </>
        )}

        <p className="text-sm text-center mt-4">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>

      {/* =========================
          MFA MODALS
      ========================= */}

      {mfaRequired && mfaSetupRequired && (
        <MFASetupModal
          isOpen={true}
          onClose={cancelMfaFlow}
          onComplete={() => {}}
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
