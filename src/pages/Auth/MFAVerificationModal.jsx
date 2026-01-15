import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyMFA } from "../../redux/slices/authSlice";

const MFAVerificationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tempCredentials, loading } = useSelector((s) => s.auth);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
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

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Enter MFA Code</h2>
      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        maxLength={6}
      />
      {error && <p>{error}</p>}
      <button disabled={loading} onClick={submit}>
        Verify
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default MFAVerificationModal;
