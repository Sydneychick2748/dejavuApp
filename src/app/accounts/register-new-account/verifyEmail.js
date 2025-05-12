

import React, { useState } from "react";
import "./registerNewAccount.css";

const VerifyEmail = ({ email, onVerify, backendError, setBackendError }) => {
    const [verificationCode, setVerificationCode] = useState("");

    console.log("VerifyEmail component rendered with email:", email);

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        console.log("Verification code input changed to:", newCode);
        setVerificationCode(newCode);
        setBackendError(""); // Clear error on input change
    };

    const handleVerifyCode = () => {
        console.log("handleVerifyCode called with code:", verificationCode);
        onVerify(verificationCode); // Pass code to CreateAccount.jsx
    };

    return (
        <div className="verify-container">
            <div className="verify-box">
                <h1>Verify Email</h1>
                <p>
                    We sent a verification code to: <strong>{email}</strong>
                </p>
                {backendError && (
                    <p style={{ color: "red", fontSize: "14px", margin: "0 0 10px 0" }}>
                        {backendError}
                    </p>
                )}
                <p>Enter the verification code received:</p>
                <input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={handleCodeChange}
                />
                <button onClick={handleVerifyCode}>Continue</button>
                <div className="support-link">
                    Questions? <a href="#">Contact support</a>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;