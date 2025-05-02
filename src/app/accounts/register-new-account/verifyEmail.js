import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./registerNewAccount.css";


const VerifyEmail = ({ email, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleCodeChange = (e) => setVerificationCode(e.target.value);

  const handleSendCode = () => {
    setSending(true);
    // Simulate API call to send verification code
    setTimeout(() => {
      console.log(`Verification code sent to ${email}`);
      setCodeSent(true);
      setSending(false);
    }, 1000); // Simulates 1 second delay
  };

  const handleVerifyCode = () => {
    if (verificationCode === "123456") {
      onVerify(verificationCode); // Pass mock code to parent
    } else {
      alert("Invalid mock code (try 123456)");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h1>Verify Email</h1>
        <p>
          We’ll send a verification code to: <strong>{email}</strong>
        </p>
        <button onClick={handleSendCode} disabled={sending}>
          {sending ? "Sending..." : "Send Code"}
        </button>

        {codeSent && (
          <>
            <p>Enter the code that was sent to your email:</p>
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={handleCodeChange}
            />
            <button onClick={handleVerifyCode}>Continue</button>
          </>
        )}

       

        <div className="support-link">
          Questions? <a href="#">Contact support</a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
