// "use client";

// import React, { useState } from "react";
// import { usePathname } from "next/navigation"; // ⬅️ import this
// import "./login.css";

// export default function LoginBox() {
//   const pathname = usePathname();
//   const [forgotPassword, setForgotPassword] = useState(false); // To toggle forgot password form
//   const [step, setStep] = useState(1); // To keep track of the current step (1 - Enter email/phone, 2 - Enter code, 3 - Reset password)

//   // Show background ONLY if this is the actual /login page
//   const isLoginPage = pathname === '/accounts/login';

//   const handleForgotPasswordClick = () => {
//     setForgotPassword(true); // Show forgot password form
//     setStep(1); // Reset to step 1
//   };

//   const handleBackToLoginClick = () => {
//     setForgotPassword(false); // Go back to login form
//     setStep(1); // Reset to step 1
//   };

//   const handleSendResetLink = () => {
//     // Assuming some backend logic sends a reset link or code
//     setStep(2); // Move to step 2 where the user enters the verification code
//   };

//   const handleVerifyCode = () => {
//     // Assuming the code is verified (you can implement backend validation here)
//     setStep(3); // Move to step 3 where the user can reset their password
//   };

//   const handleResetPassword = () => {
//     // Reset the password (backend logic would go here)
//     alert("Password has been reset!");
//     setForgotPassword(false); // Go back to login form
//   };

//   return (
//     <div className={isLoginPage ? "login-page" : ""}>
//       <div className="login-box">
//         {forgotPassword ? (
//           // Forgot Password Flow
//           <>
//             <h2>Forgot Password</h2>
//             {step === 1 && (
//               <>
//                 <input type="email" placeholder="Enter your email or phone number" />
//                 <button className="reset-btn" onClick={handleSendResetLink}>Send Reset Link</button>
//               </>
//             )}
//             {step === 2 && (
//               <>
//                 <input type="text" placeholder="Enter the verification code" />
//                 <button className="reset-btn" onClick={handleVerifyCode}>Verify Code</button>
//               </>
//             )}
//             {step === 3 && (
//               <>
//                 <input type="password" placeholder="Enter new password" />
//                 <input type="password" placeholder="Confirm new password" />
//                 <button className="reset-btn" onClick={handleResetPassword}>Reset Password</button>
//               </>
//             )}
//             <p>
//               <a href="#" onClick={handleBackToLoginClick}>Back to Login</a>
//             </p>
//           </>
//         ) : (
//           // Login Form
//           <>
//             <h2>Log in</h2>
//             <input type="email" placeholder="Email" />
//             <input type="password" placeholder="Password" />
//             <button className="login-btn">Log in</button>
//             <button className="create-btn">Create new account</button>
//             <a href="#" className="forgot-link" onClick={handleForgotPasswordClick}>
//               Forgot password?
//             </a>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


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
=======

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./login.css";

export default function LoginBox() {
    const pathname = usePathname();
    const [forgotPassword, setForgotPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetEmailOrPhone, setResetEmailOrPhone] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    const isLoginPage = pathname === '/accounts/login';

    useEffect(() => {
        validateForm();
    }, [email, password, resetEmailOrPhone, resetCode, newPassword, confirmNewPassword, forgotPassword, step]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`${name} changed to: ${value}`);

        if (!showErrors) {
            setShowErrors(true);
        }

        if (name === "email") setEmail(value.trim());
        if (name === "password") setPassword(value);
        if (name === "resetEmailOrPhone") setResetEmailOrPhone(value.trim());
        if (name === "resetCode") setResetCode(value.trim());
        if (name === "newPassword") setNewPassword(value);
        if (name === "confirmNewPassword") setConfirmNewPassword(value);

        validateField(name, value);
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

        if (name === "password" && !value) {
            newErrors.password = "Password is required";
        } else if (name === "password") {
            delete newErrors.password;
        }

        if (name === "resetEmailOrPhone") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
            if (!value) {
                newErrors.resetEmailOrPhone = "Email or phone number is required";
            } else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
                newErrors.resetEmailOrPhone = "Invalid email or phone format (use (XXX)XXX-XXXX)";
            } else {
                delete newErrors.resetEmailOrPhone;
            }
        }

        if (name === "resetCode" && !value) {
            newErrors.resetCode = "Verification code is required";
        } else if (name === "resetCode") {
            delete newErrors.resetCode;
        }

        if (name === "newPassword") {
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
            if (!value) {
                newErrors.newPassword = "New password is required";
            } else if (!passwordRegex.test(value)) {
                newErrors.newPassword = "Password must be at least 8 characters and contain at least one number and one special character";
            } else {
                delete newErrors.newPassword;
            }
        }

        if (name === "confirmNewPassword" || name === "newPassword") {
            const passwordValue = name === "newPassword" ? value : newPassword;
            const confirmPasswordValue = name === "confirmNewPassword" ? value : confirmNewPassword;
            if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
                newErrors.confirmNewPassword = "Passwords do not match";
            } else {
                delete newErrors.confirmNewPassword;
            }
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!forgotPassword) {
            // Login form validation
            if (!email) newErrors.email = "Email is required";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) newErrors.email = "Invalid email format";
            if (!password) newErrors.password = "Password is required";
        } else if (step === 1) {
            // Forgot password step 1
            if (!resetEmailOrPhone) newErrors.resetEmailOrPhone = "Email or phone number is required";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
            if (resetEmailOrPhone && !emailRegex.test(resetEmailOrPhone) && !phoneRegex.test(resetEmailOrPhone)) {
                newErrors.resetEmailOrPhone = "Invalid email or phone format (use (XXX)XXX-XXXX)";
            }
        } else if (step === 2) {
            // Forgot password step 2
            if (!resetCode) newErrors.resetCode = "Verification code is required";
        } else if (step === 3) {
            // Forgot password step 3
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
            if (!newPassword) newErrors.newPassword = "New password is required";
            else if (!passwordRegex.test(newPassword)) {
                newErrors.newPassword = "Password must be at least 8 characters and contain at least one number and one special character";
            }
            if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log(`Form validation: isValid=${isValid}, Errors: ${JSON.stringify(newErrors)}`);
        return isValid;
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setShowErrors(true);

        if (!validateForm()) {
            console.log("Login form validation failed");
            return;
        }

        console.log("Login attempt with:", { email, password });
        // TODO: Implement backend login API call
        alert("Login submitted (backend not implemented yet)");
    };

    const handleSendResetLink = (e) => {
        e.preventDefault();
        setShowErrors(true);

        if (!validateForm()) {
            console.log("Reset link form validation failed");
            return;
        }

        console.log("Sending reset link for:", resetEmailOrPhone);
        // TODO: Implement backend API call to send reset code
        setStep(2);
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        setShowErrors(true);

        if (!validateForm()) {
            console.log("Verification code form validation failed");
            return;
        }

        console.log("Verifying code:", resetCode);
        // TODO: Implement backend API call to verify code
        setStep(3);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setShowErrors(true);

        if (!validateForm()) {
            console.log("Reset password form validation failed");
            return;
        }

        console.log("Resetting password with:", { newPassword, confirmNewPassword });
        // TODO: Implement backend API call to reset password
        alert("Password has been reset!");
        setForgotPassword(false);
        setStep(1);
        setResetEmailOrPhone("");
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrors({});
        setShowErrors(false);
    };

    const handleForgotPasswordClick = () => {
        console.log("Switching to forgot password form");
        setForgotPassword(true);
        setStep(1);
        setEmail("");
        setPassword("");
        setErrors({});
        setShowErrors(false);
    };

    const handleBackToLoginClick = () => {
        console.log("Switching back to login form");
        setForgotPassword(false);
        setStep(1);
        setResetEmailOrPhone("");
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrors({});
        setShowErrors(false);
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
                                <input
                                    type="text"
                                    name="resetEmailOrPhone"
                                    placeholder="Enter your email or phone number"
                                    value={resetEmailOrPhone}
                                    onChange={handleChange}
                                />
                                <p
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                        margin: "0",
                                        minHeight: "16px",
                                        visibility: showErrors && errors.resetEmailOrPhone ? "visible" : "hidden"
                                    }}
                                >
                                    {showErrors && errors.resetEmailOrPhone ? errors.resetEmailOrPhone : ""}
                                </p>
                                <button className="reset-btn" onClick={handleSendResetLink}>Send Reset Link</button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    name="resetCode"
                                    placeholder="Enter the verification code"
                                    value={resetCode}
                                    onChange={handleChange}
                                />
                                <p
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                        margin: "0",
                                        minHeight: "16px",
                                        visibility: showErrors && errors.resetCode ? "visible" : "hidden"
                                    }}
                                >
                                    {showErrors && errors.resetCode ? errors.resetCode : ""}
                                </p>
                                <button className="reset-btn" onClick={handleVerifyCode}>Verify Code</button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={handleChange}
                                />
                                <p
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                        margin: "0",
                                        minHeight: "16px",
                                        visibility: showErrors && errors.newPassword ? "visible" : "hidden"
                                    }}
                                >
                                    {showErrors && errors.newPassword ? errors.newPassword : ""}
                                </p>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    placeholder="Confirm new password"
                                    value={confirmNewPassword}
                                    onChange={handleChange}
                                />
                                <p
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                        margin: "0",
                                        minHeight: "16px",
                                        visibility: showErrors && errors.confirmNewPassword ? "visible" : "hidden"
                                    }}
                                >
                                    {showErrors && errors.confirmNewPassword ? errors.confirmNewPassword : ""}
                                </p>
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
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleChange}
                        />
                        <p
                            style={{
                                color: "red",
                                fontSize: "12px",
                                margin: "0",
                                minHeight: "16px",
                                visibility: showErrors && errors.email ? "visible" : "hidden"
                            }}
                        >
                            {showErrors && errors.email ? errors.email : ""}
                        </p>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                        />
                        <p
                            style={{
                                color: "red",
                                fontSize: "12px",
                                margin: "0",
                                minHeight: "16px",
                                visibility: showErrors && errors.password ? "visible" : "hidden"
                            }}
                        >
                            {showErrors && errors.password ? errors.password : ""}
                        </p>
                        <button className="login-btn" onClick={handleLoginSubmit}>Log in</button>
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

