import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyMFA } from "../../redux/slices/authSlice";
import { X, Shield, KeyRound } from "lucide-react";

const MFAVerificationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tempCredentials, loading } = useSelector((s) => s.auth);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    if (token.length !== 6) {
      setError("Enter a valid 6-digit code");
      return;
    }

    try {
      await dispatch(
        verifyMFA({
          ...tempCredentials,
          token,
        })
      ).unwrap();

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.error || "Invalid MFA code");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && token.length === 6) {
      submit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-elevated overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">MFA Verification</h2>
              <p className="text-sm text-primary-100">Enter your code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <KeyRound className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <input
            type="text"
            value={token}
            onChange={(e) => {
              setError("");
              setToken(e.target.value.replace(/\D/g, ""));
            }}
            onKeyPress={handleKeyPress}
            maxLength={6}
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:border-primary-500 focus:ring-0 transition-colors"
            placeholder="000000"
            autoFocus
          />

          <button
            disabled={loading || token.length !== 6}
            onClick={submit}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify"
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MFAVerificationModal;
