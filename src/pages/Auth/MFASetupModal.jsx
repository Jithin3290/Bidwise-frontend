import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { verifyMFA } from "../../redux/slices/authSlice";
import { X, Shield, Smartphone } from "lucide-react";

const MFASetupModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tempCredentials, loading } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1); // 1 = QR, 2 = Verify
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const setupMFA = async () => {
      try {
        const res = await api.post("/auth/mfa/setup/", tempCredentials);
        setQrCode(res.data.qr_code);
        setSecret(res.data.secret);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to setup MFA");
      }
    };

    setupMFA();
  }, [isOpen, tempCredentials]);

  const handleVerify = async () => {
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

      // Navigate to admin dashboard after successful MFA setup
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.error || "Invalid authentication code");
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
              <h2 className="text-lg font-semibold text-white">Set up MFA</h2>
              <p className="text-sm text-primary-100">Secure your account</p>
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
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Scan this QR code using Google Authenticator or Authy.
                </p>
              </div>

              {qrCode && (
                <div className="flex justify-center my-6">
                  <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-soft">
                    <img src={qrCode} alt="MFA QR" className="w-48 h-48" />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Manual entry code:</p>
                <p className="text-sm font-mono text-gray-700 break-all select-all">
                  {secret}
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full btn-primary"
              >
                Continue to Verification
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Enter the 6-digit code from your authenticator app
              </p>

              <input
                type="text"
                value={token}
                onChange={(e) => {
                  setError("");
                  setToken(e.target.value.replace(/\D/g, ""));
                }}
                maxLength={6}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:border-primary-500 focus:ring-0 transition-colors"
                placeholder="000000"
                autoFocus
              />

              <button
                onClick={handleVerify}
                disabled={loading || token.length !== 6}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify & Enable MFA"
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MFASetupModal;
