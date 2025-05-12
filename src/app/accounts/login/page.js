


"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import ForgotPassword from "./ForgotPassword"; // Import ForgotPassword component
import VerificationCode from "./VerificationCode"; // Import VerificationCode component
import ResetPassword from "./ResetPassword"; // Import ResetPassword component
import "./login.css"; // Assuming your CSS file for login styles

export default function LoginBox() {
  const pathname = usePathname();
  const [step, setStep] = useState(1); // Tracks the current step in the flow
  const [forgotPassword, setForgotPassword] = useState(false); // Toggles between login and forgot password

  // Show background ONLY if this is the actual /login page
  const isLoginPage = pathname === "/accounts/login";

  // Show Forgot Password flow
  const handleForgotPasswordClick = () => {
    setForgotPassword(true); // Show forgot password form
    setStep(1); // Start from step 1
  };

  // Go back to login page
  const handleBackToLoginClick = () => {
    setForgotPassword(false); // Go back to login form
    setStep(1); // Reset to step 1
  };

  // Trigger next step (Send Reset Link -> Verification Code -> Reset Password)
  const handleNextStep = () => {
    if (step === 1) {
      setStep(2); // Move to step 2 (Verification Code)
    } else if (step === 2) {
      setStep(3); // Move to step 3 (Reset Password)
    }
  };

  return (
    <div className={isLoginPage ? "login-page" : ""}>
      <div className="login-box">
        {forgotPassword ? (
          // Forgot Password Flow
          <>
            {step === 1 && <ForgotPassword onNextStep={handleNextStep} />}
            {step === 2 && <VerificationCode onNextStep={handleNextStep} />}
            {step === 3 && (
              <ResetPassword onBackToLogin={handleBackToLoginClick} />
            )}
          </>
        ) : (
          // Login Form
          <>
            <h2>Log in</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="login-btn">Log in</button>
            <button className="create-btn">Create new account</button>
            <a
              href="#"
              className="forgot-link"
              onClick={handleForgotPasswordClick}
            >
              Forgot password?
            </a>
          </>
        )}
      </div>
      <p> Contact Support</p>
    </div>
  );
}

