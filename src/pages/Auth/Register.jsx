import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import api from "../../api/api.jsx";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState(searchParams.get("role") || "");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [selectedAccountTypes, setSelectedAccountTypes] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [errors, setErrors] = useState({});

  const handleRoleSelect = (role) => {
    setUserRole(role);
    setSelectedAccountTypes([role]);
    setErrors((e) => ({ ...e, account_types: "" }));

    if (formData.email) {
      setFormData((f) => ({
        ...f,
        username: f.email.split("@")[0],
      }));
    }
  };

  const validateForm = () => {
    const e = {};

    if (!formData.email) e.email = "Email is required";
    if (!formData.password || formData.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!selectedAccountTypes.length)
      e.account_types = "Select a role";
    if (!recaptchaToken) e.recaptcha = "Complete reCAPTCHA";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(
        registerUser({
          email: formData.email,
          username: formData.username || formData.email.split("@")[0],
          password: formData.password,
          account_types: selectedAccountTypes,
          recaptcha: recaptchaToken,
        })
      ).unwrap();

      toast.success("Account created successfully");

      const role = selectedAccountTypes[0];
      navigate(`/${role}/dashboard`);
    } catch (err) {
      toast.error(
        err?.detail || err?.error || "Registration failed"
      );
    }
  };

  const handleGoogleSuccess = async ({ credential }) => {
    if (!selectedAccountTypes.length) {
      toast.error("Select a role first");
      return;
    }

    try {
      const res = await api.post("/auth/google/", {
        credential,
        account_types: selectedAccountTypes,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      toast.success("Google signup successful");
      navigate(`/${res.data.user.account_types[0]}/dashboard`);
    } catch {
      toast.error("Google signup failed");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Join BidWise and get started in minutes
        </p>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          I want to
        </p>

        <div className="grid grid-cols-2 gap-3">
          {["client", "freelancer"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`relative p-4 rounded-xl border text-left transition
                ${
                  userRole === role
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
            >
              {userRole === role && (
                <CheckCircleIcon className="absolute top-3 right-3 h-5 w-5 text-blue-600" />
              )}

              <p className="font-semibold capitalize text-gray-900">
                {role === "client" ? "Hire Talent" : "Work as Freelancer"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {role === "client"
                  ? "Post jobs & manage bids"
                  : "Find work & earn money"}
              </p>
            </button>
          ))}
        </div>

        {errors.account_types && (
          <p className="text-xs text-red-500 mt-2">
            {errors.account_types}
          </p>
        )}
      </div>

      {/* Google Signup */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Quick signup</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google signup failed")}
            width="300"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-lg border px-4 py-2.5 text-sm
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full rounded-lg border px-4 py-2.5 text-sm
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6LdJcUosAAAAAKhoRKb57UsxkjmWEzvIGiVHh6h_"
            onChange={setRecaptchaToken}
          />
        </div>

        {errors.recaptcha && (
          <p className="text-xs text-red-500 text-center">
            {errors.recaptcha}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-medium text-white transition
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-sm text-center text-gray-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  </div>
);

};

export default Register;
