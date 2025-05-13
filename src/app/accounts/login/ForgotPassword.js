


import React, { useState } from "react";
import "./login.css";

export default function ForgotPassword({ onNextStep }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const handleChange = (e) => {
    setEmailOrPhone(e.target.value);
  };

  const handleSubmit = () => {
    // Assuming email/phone validation or API call happens here.
    onNextStep(); // Move to the next step (Verification Code)
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Forgot Password</h2>
      <p className="forgot-password-instruction">
        Enter your email address or phone number, and we'll send you a verification code to recover your account.
      </p>
      <input
        type="text"
        value={emailOrPhone}
        onChange={handleChange}
        placeholder="Email or phone number"
        className="forgot-password-input"
      />
      <button onClick={handleSubmit} className="forgot-password-submit">Submit</button>
      <a href="http://localhost:3000/accounts/login" className="forgot-password-back">Back to login</a>
      {/* <a href="http://localhost:3000/accounts/login" className="forgot-password-support">Contact support</a> */}
    </div>
  );
}



