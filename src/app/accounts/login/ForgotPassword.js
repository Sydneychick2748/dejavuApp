"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import "./forgotPassword.css"; // Import the corresponding CSS file

export default function ForgotPasswordBox() {
  const pathname = usePathname();
  const [forgotPassword, setForgotPassword] = useState(false);

  // Show background ONLY if this is the actual /login page
  const isLoginPage = pathname === '/accounts/login';

  const handleForgotPasswordClick = () => {
    setForgotPassword(true); // Show forgot password form
  };

  const handleBackToLoginClick = () => {
    setForgotPassword(false); // Go back to login form
  };

  return (
    <div className={isLoginPage ? "login-page" : ""}>
      <div className="forgot-password-box">
        {forgotPassword ? (
          // Forgot Password Form
          <>
            <h2>Forgot Password</h2>
            <p>Enter your email address or phone number, and we'll send you a verification code to recover your account.</p>
            <input
              type="text"
              placeholder="Email or phone number"
              className="reset-input"
            />
            <button className="reset-btn">Submit</button>
            <p className="back-to-login">
              <a href="#" onClick={handleBackToLoginClick}>Back to Login</a>
            </p>
            <p className="contact-support">
              <a href="#">Contact support</a>
            </p>
          </>
        ) : (
          // Login Form (same as your initial)
          <>
            <h2>Log in</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="login-btn">Log in</button>
            <button className="create-btn">Create new account</button>
            <a href="#" className="forgot-link" onClick={handleForgotPasswordClick}>Forgot password?</a>
          </>
        )}
      </div>
    </div>
  );
}
