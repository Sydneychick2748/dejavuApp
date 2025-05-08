"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation"; // ⬅️ import this
import "./login.css";

export default function LoginBox() {
  const pathname = usePathname();
  const [forgotPassword, setForgotPassword] = useState(false); // To toggle forgot password form
  const [step, setStep] = useState(1); // To keep track of the current step (1 - Enter email/phone, 2 - Enter code, 3 - Reset password)

  // Show background ONLY if this is the actual /login page
  const isLoginPage = pathname === '/accounts/login';

  const handleForgotPasswordClick = () => {
    setForgotPassword(true); // Show forgot password form
    setStep(1); // Reset to step 1
  };

  const handleBackToLoginClick = () => {
    setForgotPassword(false); // Go back to login form
    setStep(1); // Reset to step 1
  };

  const handleSendResetLink = () => {
    // Assuming some backend logic sends a reset link or code
    setStep(2); // Move to step 2 where the user enters the verification code
  };

  const handleVerifyCode = () => {
    // Assuming the code is verified (you can implement backend validation here)
    setStep(3); // Move to step 3 where the user can reset their password
  };

  const handleResetPassword = () => {
    // Reset the password (backend logic would go here)
    alert("Password has been reset!");
    setForgotPassword(false); // Go back to login form
  };

  return (
    <div className={isLoginPage ? "login-page" : ""}>
      <div className="login-box">
        {forgotPassword ? (
          // Forgot Password Flow
          <>
            <h2>Forgot Password</h2>
            {step === 1 && (
              <>
                <input type="email" placeholder="Enter your email or phone number" />
                <button className="reset-btn" onClick={handleSendResetLink}>Send Reset Link</button>
              </>
            )}
            {step === 2 && (
              <>
                <input type="text" placeholder="Enter the verification code" />
                <button className="reset-btn" onClick={handleVerifyCode}>Verify Code</button>
              </>
            )}
            {step === 3 && (
              <>
                <input type="password" placeholder="Enter new password" />
                <input type="password" placeholder="Confirm new password" />
                <button className="reset-btn" onClick={handleResetPassword}>Reset Password</button>
              </>
            )}
            <p>
              <a href="#" onClick={handleBackToLoginClick}>Back to Login</a>
            </p>
          </>
        ) : (
          // Login Form
          <>
            <h2>Log in</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="login-btn">Log in</button>
            <button className="create-btn">Create new account</button>
            <a href="#" className="forgot-link" onClick={handleForgotPasswordClick}>
              Forgot password?
            </a>
          </>
        )}
      </div>
    </div>
  );
}
