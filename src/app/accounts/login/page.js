



"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEyeSlash, faEye} from "@fortawesome/free-solid-svg-icons";
import ForgotPassword from "./ForgotPassword";
import VerificationCode from "./VerificationCode";
import ResetPassword from "./ResetPassword";
import "./login.css";

export default function LoginPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState(""); // Store emailOrPhone from ForgotPassword
  const [verificationCodeFromBackend, setVerificationCodeFromBackend] = useState(""); // Store verification code from ForgotPassword

  const isLoginPage = pathname === "/accounts/login";

  useEffect(() => {
    setMounted(true);
    validateForm();
  }, []);

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name} changed to: ${value}`);

    if (!showErrors) {
      setShowErrors(true);
    }

    if (name === "email") setEmail(value.trim());
    if (name === "password") setPassword(value);

    validateField(name, value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!value) {
        newErrors.password = "Password is required";
      } else if (!passwordRegex.test(value)) {
        newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`Form validation: isValid=${isValid}, Errors: ${JSON.stringify(newErrors)}`);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    setBackendError("");

    if (!validateForm()) {
      console.log("Login form validation failed");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending login request with data:", { email, password });
      const response = await fetch('http://127.0.0.1:8000/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Login response:", data);
        setBackendError(data.detail || "Login failed");
      } else {
        console.log("Login successful:", data);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected login error:", error.message);
      setBackendError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    console.log("Switching to forgot password form");
    setForgotPassword(true);
    setStep(1);
    setEmail("");
    setPassword("");
    setErrors({});
    setShowErrors(false);
    setBackendError("");
    setEmailOrPhone(""); // Reset emailOrPhone
    setVerificationCodeFromBackend(""); // Reset verification code
  };

  const handleBackToLoginClick = () => {
    console.log("Switching back to login form");
    setForgotPassword(false);
    setStep(1);
    setEmail("");
    setPassword("");
    setErrors({});
    setShowErrors(false);
    setBackendError("");
    setEmailOrPhone(""); // Reset emailOrPhone
    setVerificationCodeFromBackend(""); // Reset verification code
  };

  const handleNextStep = (emailOrPhone = "", verificationCode = "") => {
    if (step === 1) {
      // Store emailOrPhone and verificationCode from ForgotPassword
      setEmailOrPhone(emailOrPhone);
      setVerificationCodeFromBackend(verificationCode);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  return (
    <div className={isLoginPage ? "login-page" : ""}>
      <div className="login-box">
        {forgotPassword ? (
          <>
            {step === 1 && <ForgotPassword onNextStep={handleNextStep} />}
            {step === 2 && (
              <VerificationCode
                onNextStep={handleNextStep}
                emailOrPhone={emailOrPhone}
                verificationCodeFromBackend={verificationCodeFromBackend}
              />
            )}
            {step === 3 && (
              <ResetPassword onBackToLogin={handleBackToLoginClick} />
            )}
          </>
        ) : (
          <>
            <h2>Log in</h2>
            <div className="error-container">
              {backendError && (
                <p
                  style={{
                    color: "red",
                    fontSize: "14px",
                    margin: "0",
                    textAlign: "center",
                  }}
                >
                  {backendError}
                </p>
              )}
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="email" style={{ display: "none" }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p
                  style={{
                    visibility: showErrors && errors.email ? "visible" : "hidden",
                  }}
                >
                  {showErrors && errors.email ? errors.email : ""}
                </p>
              </div>
              <div style={{ position: "relative" }}>
                <label htmlFor="password" style={{ display: "none" }}>
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                  style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", color: "#666", caretColor: "black" }}
                  disabled={loading}
                />
                {mounted && (
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash:faEye}
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  />
                )}
                <p
                  style={{
                    visibility: showErrors && errors.password ? "visible" : "hidden",
                  }}
                >
                  {showErrors && errors.password ? errors.password : ""}
                </p>
              </div>
              <button
                type="submit"
                className="login-btn"
                disabled={!isFormValid || loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
              <Link href="/accounts/register-new-account" passHref legacyBehavior>
                <button type="button" className="create-btn" disabled={loading}>
                  Create new account
                </button>
              </Link>
              <button
                type="button"
                className="forgot-link"
                onClick={handleForgotPasswordClick}
              >
                Forgot password?
              </button>
            </form>
          </>
        )}
      </div>
      <div className="support-link-wrapper">
        <a href="#" className="forgot-password-support">
          Contact support
        </a>
      </div>
    </div>
  );
}