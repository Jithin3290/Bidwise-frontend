import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { verifyMFA } from "../../redux/slices/authSlice";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6">

        <h2 className="text-xl font-semibold text-center mb-4">
          Set up MFA
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Scan this QR code using Google Authenticator or Authy.
            </p>

            {qrCode && (
              <div className="flex justify-center my-4">
                <img src={qrCode} alt="MFA QR" />
              </div>
            )}

            <p className="text-xs text-gray-500 break-all text-center">
              {secret}
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-2 rounded mt-4"
            >
              Continue
            </button>

            <button
              onClick={onClose}
              className="w-full text-sm text-gray-500 mt-2"
            >
              Cancel
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Enter the 6-digit code from your authenticator app.
            </p>

            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full border p-2 rounded text-center text-lg tracking-widest"
              placeholder="000000"
            />

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded mt-4"
            >
              {loading ? "Verifying..." : "Verify & Enable MFA"}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default MFASetupModal;
