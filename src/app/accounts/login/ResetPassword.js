


// // import React, { useState } from "react";
// // import "./login.css";

// // export default function ResetPassword({ onBackToLogin }) {
// //   const [password, setPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [error, setError] = useState('');

// //   const handleChangePassword = (e) => {
// //     setPassword(e.target.value);
// //   };

// //   const handleChangeConfirmPassword = (e) => {
// //     setConfirmPassword(e.target.value);
// //   };

// //   const handleSubmit = () => {
// //     if (password !== confirmPassword) {
// //       setError("Passwords do not match");
// //     } else {
// //       alert("Password has been reset!");
// //       onBackToLogin(); // Redirect back to the login form
// //     }
// //   };

// //   return (
// //     <div className="reset-password-container">
// //       <h2 className="reset-password-title">Reset Password</h2>
// //       <p className="reset-password-instruction">
// //         New passwords cannot be the same as a previous password. Password must be at least 8 characters and contain at least one number and one special character.
// //       </p>
// //       <input
// //         type="password"
// //         value={password}
// //         onChange={handleChangePassword}
// //         placeholder="Password*"
// //         className="reset-password-input"
// //       />
// //       <input
// //         type="password"
// //         value={confirmPassword}
// //         onChange={handleChangeConfirmPassword}
// //         placeholder="Confirm password*"
// //         className="reset-password-input"
// //       />
// //       {error && <p className="reset-password-error">{error}</p>}
// //       <button onClick={handleSubmit} className="reset-password-submit">Save new password</button>
// //       {/* <a href="#" className="reset-password-support">Contact support</a> */}
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useRef } from "react";
// import "./login.css";

// // Configurable backend URL (consistent with ForgotPassword.jsx and VerificationCode.jsx)
// const BACKEND_URL = "http://127.0.0.1:8000";

// export default function ResetPassword({ onBackToLogin }) {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showErrors, setShowErrors] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [backendError, setBackendError] = useState("");
//   const passwordInputRef = useRef(null);

//   useEffect(() => {
//     // Initial validation on mount
//     validateForm();
//   }, []);

//   useEffect(() => {
//     // Re-validate whenever password or confirmPassword changes
//     validateForm();
//   }, [password, confirmPassword]);

//   const handleChangePassword = (e) => {
//     const { value } = e.target;
//     console.log(`[ResetPassword] Password changed to: "${value}"`);

//     const trimmedValue = value.trim();
//     setPassword(trimmedValue);
//     validateField("password", trimmedValue);
//     setBackendError(""); // Clear backend error when the user starts typing
//     console.log(`[ResetPassword] Backend error cleared on password change`);

//     // Ensure errors are shown after the user starts typing
//     if (!showErrors && trimmedValue) {
//       setShowErrors(true);
//       console.log("[ResetPassword] Show errors enabled");
//     }
//   };

//   const handleChangeConfirmPassword = (e) => {
//     const { value } = e.target;
//     console.log(`[ResetPassword] Confirm password changed to: "${value}"`);

//     const trimmedValue = value.trim();
//     setConfirmPassword(trimmedValue);
//     validateField("confirmPassword", trimmedValue);
//     setBackendError(""); // Clear backend error when the user starts typing
//     console.log(`[ResetPassword] Backend error cleared on confirm password change`);

//     // Ensure errors are shown after the user starts typing
//     if (!showErrors && trimmedValue) {
//       setShowErrors(true);
//       console.log("[ResetPassword] Show errors enabled");
//     }
//   };

//   const validateField = (field, value) => {
//     const newErrors = { ...errors };

//     if (field === "password") {
//       if (!value) {
//         newErrors.password = "Password is required";
//       } else {
//         const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
//         const isPasswordValid = passwordRegex.test(value);

//         console.log(`[ResetPassword] Password validation - isPasswordValid: ${isPasswordValid}`);

//         if (!isPasswordValid) {
//           newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
//         } else {
//           delete newErrors.password;
//         }
//       }
//     }

//     if (field === "confirmPassword") {
//       if (!value) {
//         newErrors.confirmPassword = "Confirm password is required";
//       } else if (value !== password) {
//         newErrors.confirmPassword = "Passwords do not match";
//       } else {
//         delete newErrors.confirmPassword;
//       }
//     }

//     setErrors(newErrors);
//     console.log(`[ResetPassword] Validation errors updated: ${JSON.stringify(newErrors)}`);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!password) {
//       newErrors.password = "Password is required";
//     } else {
//       const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
//       const isPasswordValid = passwordRegex.test(password);

//       if (!isPasswordValid) {
//         newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
//       }
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword = "Confirm password is required";
//     } else if (confirmPassword !== password) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     const isValid = Object.keys(newErrors).length === 0;
//     console.log(`[ResetPassword] Form validation - isValid: ${isValid}, Errors: ${JSON.stringify(newErrors)}`);
//     setIsFormValid(isValid);
//     return isValid;
//   };

//   const handleSubmit = async () => {
//     setShowErrors(true);
//     setBackendError("");

//     const isValid = validateForm();
//     if (!isValid) {
//       console.log("[ResetPassword] Reset password form validation failed");
//       return;
//     }

//     console.log("[ResetPassword] Reset password submission data:", { password });

//     setLoading(true);
//     try {
//       // Simulate backend call (to be replaced with actual backend integration)
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1-second delay

//       // For now, assume success and redirect to login
//       console.log("[ResetPassword] Simulated password reset successful");
//       alert("Password has been reset!");
//       onBackToLogin(); // Redirect back to the login form
//     } catch (error) {
//       console.log("[ResetPassword] Unexpected reset password error:", error.message);
//       setBackendError("An unexpected error occurred. Please try again.");
//       // Reset the input fields and states on error
//       setPassword("");
//       setConfirmPassword("");
//       setShowErrors(false);
//       setErrors({});
//       setIsFormValid(false);
//       if (passwordInputRef.current) {
//         passwordInputRef.current.focus();
//         console.log("[ResetPassword] Password input field focused after error");
//       }
//     } finally {
//       setLoading(false);
//       console.log("[ResetPassword] Loading state reset");
//     }
//   };

//   return (
//     <div className="reset-password-container">
//       <h2 className="reset-password-title">Reset Password</h2>
//       <p className="reset-password-instruction">
//         New passwords cannot be the same as a previous password. Password must be at least 8 characters and contain at least one number and one special character.
//       </p>
//       {backendError && (
//         <p
//           style={{
//             color: "red",
//             fontSize: "14px",
//             margin: "0 0 10px 0",
//             textAlign: "center",
//           }}
//         >
//           {backendError}
//         </p>
//       )}
//       <div>
//         <input
//           type="password"
//           value={password}
//           onChange={handleChangePassword}
//           placeholder="Password*"
//           className="reset-password-input"
//           disabled={loading}
//           ref={passwordInputRef}
//         />
//         <p
//           style={{
//             color: "red",
//             fontSize: "12px",
//             margin: "0",
//             minHeight: "16px",
//             visibility: showErrors && errors.password ? "visible" : "hidden",
//           }}
//         >
//           {showErrors && errors.password ? errors.password : ""}
//         </p>
//       </div>
//       <div>
//         <input
//           type="password"
//           value={confirmPassword}
//           onChange={handleChangeConfirmPassword}
//           placeholder="Confirm password*"
//           className="reset-password-input"
//           disabled={loading}
//         />
//         <p
//           style={{
//             color: "red",
//             fontSize: "12px",
//             margin: "0",
//             minHeight: "16px",
//             visibility: showErrors && errors.confirmPassword ? "visible" : "hidden",
//           }}
//         >
//           {showErrors && errors.confirmPassword ? errors.confirmPassword : ""}
//         </p>
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="reset-password-submit"
//         disabled={loading || !isFormValid}
//       >
//         {loading ? "Submitting..." : "Save new password"}
//       </button>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";

// Configurable backend URL (consistent with ForgotPassword.jsx and VerificationCode.jsx)
const BACKEND_URL = "http://127.0.0.1:8000";

export default function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const passwordInputRef = useRef(null);

  useEffect(() => {
    // Initial validation on mount
    validateForm();
  }, []);

  useEffect(() => {
    // Re-validate whenever password or confirmPassword changes
    validateForm();
  }, [password, confirmPassword]);

  const handleChangePassword = (e) => {
    const { value } = e.target;
    console.log(`[ResetPassword] Password changed to: "${value}"`);

    const trimmedValue = value.trim();
    setPassword(trimmedValue);
    validateField("password", trimmedValue);
    setBackendError(""); // Clear backend error when the user starts typing
    console.log(`[ResetPassword] Backend error cleared on password change`);

    // Ensure errors are shown after the user starts typing
    if (!showErrors && trimmedValue) {
      setShowErrors(true);
      console.log("[ResetPassword] Show errors enabled");
    }
  };

  const handleChangeConfirmPassword = (e) => {
    const { value } = e.target;
    console.log(`[ResetPassword] Confirm password changed to: "${value}"`);

    const trimmedValue = value.trim();
    setConfirmPassword(trimmedValue);
    validateField("confirmPassword", trimmedValue);
    setBackendError(""); // Clear backend error when the user starts typing
    console.log(`[ResetPassword] Backend error cleared on confirm password change`);

    // Ensure errors are shown after the user starts typing
    if (!showErrors && trimmedValue) {
      setShowErrors(true);
      console.log("[ResetPassword] Show errors enabled");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    if (field === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      } else {
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        const isPasswordValid = passwordRegex.test(value);

        console.log(`[ResetPassword] Password validation - isPasswordValid: ${isPasswordValid}`);

        if (!isPasswordValid) {
          newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
        } else {
          delete newErrors.password;
        }
      }
    }

    if (field === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (value !== password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
    console.log(`[ResetPassword] Validation errors updated: ${JSON.stringify(newErrors)}`);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      const isPasswordValid = passwordRegex.test(password);

      if (!isPasswordValid) {
        newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`[ResetPassword] Form validation - isValid: ${isValid}, Errors: ${JSON.stringify(newErrors)}`);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleSubmit = async () => {
    setShowErrors(true);
    setBackendError("");

    const isValid = validateForm();
    if (!isValid) {
      console.log("[ResetPassword] Reset password form validation failed");
      return;
    }

    console.log("[ResetPassword] Reset password submission data:", { password });

    setLoading(true);
    try {
      // Simulate backend call (to be replaced with actual backend integration)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1-second delay

      // For now, assume success and redirect to login
      console.log("[ResetPassword] Simulated password reset successful");
      alert("Password has been reset!");
      onBackToLogin(); // Redirect back to the login form
    } catch (error) {
      console.log("[ResetPassword] Unexpected reset password error:", error.message);
      setBackendError("An unexpected error occurred. Please try again.");
      // Reset the input fields and states on error
      setPassword("");
      setConfirmPassword("");
      setShowErrors(false);
      setErrors({});
      setIsFormValid(false);
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
        console.log("[ResetPassword] Password input field focused after error");
      }
    } finally {
      setLoading(false);
      console.log("[ResetPassword] Loading state reset");
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      <p className="reset-password-instruction">
        New passwords cannot be the same as a previous password. Password must be at least 8 characters and contain at least one number and one special character.
      </p>
      {backendError && (
        <p
          style={{
            color: "red",
            fontSize: "14px",
            margin: "0 0 10px 0",
            textAlign: "center",
          }}
        >
          {backendError}
        </p>
      )}
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChangePassword}
          placeholder="Password*"
          className="reset-password-input"
          disabled={loading}
          ref={passwordInputRef}
          style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", color: "#666", caretColor: "black" }}
        />
        <FontAwesomeIcon
          icon={showPassword ?faEyeSlash: faEye }
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
        <p
          style={{
            color: "red",
            fontSize: "12px",
            margin: "0",
            minHeight: "16px",
            visibility: showErrors && errors.password ? "visible" : "hidden",
          }}
        >
          {showErrors && errors.password ? errors.password : ""}
        </p>
      </div>
      <div style={{ position: "relative" }}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
          placeholder="Confirm password*"
          className="reset-password-input"
          disabled={loading}
          style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", color: "#666", caretColor: "black" }}
        />
        <FontAwesomeIcon
          icon={showConfirmPassword ?faEyeSlash: faEye}
          onClick={toggleConfirmPasswordVisibility}
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
        <p
          style={{
            color: "red",
            fontSize: "12px",
            margin: "0",
            minHeight: "16px",
            visibility: showErrors && errors.confirmPassword ? "visible" : "hidden",
          }}
        >
          {showErrors && errors.confirmPassword ? errors.confirmPassword : ""}
        </p>
      </div>
      <button
        onClick={handleSubmit}
        className="reset-password-submit"
        disabled={loading || !isFormValid}
      >
        {loading ? "Submitting..." : "Save new password"}
      </button>
    </div>
  );
}