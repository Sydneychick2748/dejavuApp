import React, { useState } from "react";
import "./registerNewAccount.css";

const VerifyEmail = ({ email, onVerify, backendError, setBackendError }) => {
    const [verificationCode, setVerificationCode] = useState("");

    const handleCodeChange = (e) => {
        setVerificationCode(e.target.value);
        setBackendError(""); // Clear error on input change
    };

    const handleVerifyCode = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/accounts/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    verification_code: verificationCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Verification failed');
            }

            onVerify(verificationCode); // Move to next step
        } catch (error) {
            console.error("Verification error:", error.message);
            setBackendError(error.message);
        }
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
                <p>Enter the code that was sent to your email:</p>
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