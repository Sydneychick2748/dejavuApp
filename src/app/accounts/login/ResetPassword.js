


// import React, { useState, useEffect, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import "./login.css";

// const BACKEND_URL = "http://127.0.0.1:8000";

// export default function ResetPassword({ onBackToLogin, emailOrPhone }) {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [showErrors, setShowErrors] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [backendError, setBackendError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const passwordInputRef = useRef(null);

//   useEffect(() => {
//     console.log("[ResetPassword] Received emailOrPhone:", emailOrPhone);
//     validateForm();
//   }, []);

//   useEffect(() => {
//     validateForm();
//   }, [password, confirmPassword]);

//   const handleChangePassword = (e) => {
//     const { value } = e.target;
//     console.log(`[ResetPassword] Password changed to: "${value}"`);
//     const trimmedValue = value.trim();
//     setPassword(trimmedValue);
//     validateField("password", trimmedValue);
//     setBackendError("");
//     setSuccessMessage("");
//     console.log(`[ResetPassword] Backend error cleared on password change`);
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
//     setBackendError("");
//     setSuccessMessage("");
//     console.log(`[ResetPassword] Backend error cleared on confirm password change`);
//     if (!showErrors && trimmedValue) {
//       setShowErrors(true);
//       console.log("[ResetPassword] Show errors enabled");
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
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
//           newErrors.password =
//             "Password must be at least 8 characters and contain at least one number and one special character";
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
//         newErrors.password =
//           "Password must be at least 8 characters and contain at least one number and one special character";
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

//   const validateEmailOrPhone = (value) => {
//     if (!value || value.trim() === "") {
//       return "Email or phone number is required. Please restart the password reset process.";
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
//     const isEmailValid = emailRegex.test(value);
//     const isPhoneValid = phoneRegex.test(value);
//     if (!isEmailValid && !isPhoneValid) {
//       return "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
//     }
//     return null;
//   };

//   const handleSubmit = async () => {
//     if (isSuccess) {
//       console.log("[ResetPassword] Button clicked after success, navigating to login");
//       onBackToLogin();
//       return;
//     }

//     setShowErrors(true);
//     setBackendError("");
//     setSuccessMessage("");

//     const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);
//     if (emailOrPhoneError) {
//       console.log("[ResetPassword] Invalid emailOrPhone:", emailOrPhone);
//       setBackendError(emailOrPhoneError);
//       return;
//     }

//     const isValid = validateForm();
//     if (!isValid) {
//       console.log("[ResetPassword] Reset password form validation failed");
//       return;
//     }

//     console.log("[ResetPassword] Reset password submission data:", { emailOrPhone, password });

//     setLoading(true);
//     try {
//       const response = await fetch(`${BACKEND_URL}/accounts/reset-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ emailOrPhone, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.log("[ResetPassword] Backend error response:", data);
//         let errorMessage = "Failed to reset password";
//         if (data.detail) {
//           if (Array.isArray(data.detail)) {
//             errorMessage = data.detail.map((err) => err.msg || err.loc.join(" -> ")).join("; ");
//           } else {
//             errorMessage = data.detail;
//           }
//         }
//         throw new Error(errorMessage);
//       }

//       console.log("[ResetPassword] Backend response:", data);
//       setSuccessMessage("Password reset successful!");
//       setIsSuccess(true);
//     } catch (error) {
//       console.error("[ResetPassword] Reset password error:", error);
//       setBackendError(error.message || "An unexpected error occurred. Please try again.");
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
//         New passwords cannot be the same as a previous password. Password must be at least 8
//         characters and contain at least one number and one special character.
//       </p>
//       {backendError && (
//         <p style={{ color: "red", fontSize: "14px", margin: "0 0 10px 0", textAlign: "center" }}>
//           {backendError}
//         </p>
//       )}
//       {successMessage && (
//         <p style={{ color: "green", fontSize: "14px", margin: "0 0 10px 0", textAlign: "center" }}>
//           {successMessage}
//         </p>
//       )}
//       <div style={{ position: "relative" }}>
//         <input
//           type={showPassword ? "text" : "password"}
//           value={password}
//           onChange={handleChangePassword}
//           placeholder="Password*"
//           className="reset-password-input"
//           disabled={loading || isSuccess}
//           ref={passwordInputRef}
//           style={{
//             width: "100%",
//             paddingRight: "40px",
//             boxSizing: "border-box",
//             color: "#666",
//             caretColor: "black",
//             caretWidth: "2px",
//           }}
//         />
//         <FontAwesomeIcon
//           icon={showPassword ? faEyeSlash : faEye}
//           onClick={togglePasswordVisibility}
//           style={{
//             position: "absolute",
//             right: "10px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             cursor: "pointer",
//             fontSize: "16px",
//             color: "#666",
//           }}
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
//       <div style={{ position: "relative" }}>
//         <input
//           type={showConfirmPassword ? "text" : "password"}
//           value={confirmPassword}
//           onChange={handleChangeConfirmPassword}
//           placeholder="Confirm password*"
//           className="reset-password-input"
//           disabled={loading || isSuccess}
//           style={{
//             width: "100%",
//             paddingRight: "40px",
//             boxSizing: "border-box",
//             color: "#666",
//             caretColor: "black",
//             caretWidth: "2px",
//           }}
//         />
//         <FontAwesomeIcon
//           icon={showConfirmPassword ? faEyeSlash : faEye}
//           onClick={toggleConfirmPasswordVisibility}
//           style={{
//             position: "absolute",
//             right: "10px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             cursor: "pointer",
//             fontSize: "16px",
//             color: "#666",
//           }}
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
//         disabled={loading || (!isFormValid && !isSuccess)}
//       >
//         {loading ? "Submitting..." : isSuccess ? "Return to Login" : "Save new password"}
//       </button>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function ResetPassword({ onBackToLogin, emailOrPhone }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    console.log("[ResetPassword] Received emailOrPhone:", emailOrPhone);
    validateForm();
  }, []);

  useEffect(() => {
    validateForm();
  }, [password, confirmPassword]);

  const handleChangePassword = (e) => {
    const { value } = e.target;
    console.log(`[ResetPassword] Password changed to: "${value}"`);
    const trimmedValue = value.trim();
    setPassword(trimmedValue);
    validateField("password", trimmedValue);
    setBackendError("");
    setSuccessMessage("");
    console.log(`[ResetPassword] Backend error cleared on password change`);
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
    setBackendError("");
    setSuccessMessage("");
    console.log(`[ResetPassword] Backend error cleared on confirm password change`);
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
          newErrors.password =
            "Password must be at least 8 characters and contain at least one number and one special character";
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
        newErrors.password =
          "Password must be at least 8 characters and contain at least one number and one special character";
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

  const validateEmailOrPhone = (value) => {
    if (!value || value.trim() === "") {
      return "Email or phone number is required. Please restart the password reset process.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
    const isEmailValid = emailRegex.test(value);
    const isPhoneValid = phoneRegex.test(value);
    if (!isEmailValid && !isPhoneValid) {
      return "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
    }
    return null;
  };

  const handleSubmit = async () => {
    if (isSuccess) {
      console.log("[ResetPassword] Button clicked after success, navigating to login");
      onBackToLogin();
      return;
    }

    setShowErrors(true);
    setBackendError("");
    setSuccessMessage("");

    const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);
    if (emailOrPhoneError) {
      console.log("[ResetPassword] Invalid emailOrPhone:", emailOrPhone);
      setBackendError(emailOrPhoneError);
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      console.log("[ResetPassword] Reset password form validation failed");
      return;
    }

    console.log("[ResetPassword] Reset password submission data:", { emailOrPhone, password });

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/accounts/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("[ResetPassword] Backend error response:", data);
        let errorMessage = "Failed to reset password";
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((err) => err.msg || err.loc.join(" -> ")).join("; ");
          } else {
            errorMessage = data.detail;
          }
        }
        // Log as info for debugging, set for UI display
        console.log("[ResetPassword] User error:", errorMessage);
        setBackendError(errorMessage);
        setPassword("");
        setConfirmPassword("");
        setShowErrors(false);
        setErrors({});
        setIsFormValid(false);
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
          console.log("[ResetPassword] Password input field focused after error");
        }
        return;
      }

      console.log("[ResetPassword] Backend response:", data);
      setSuccessMessage("Password reset successful!");
      setIsFormValid(true); // Ensure button is enabled for "Return to Login"
      setIsSuccess(true);
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      console.error("[ResetPassword] Unexpected error:", error);
      setBackendError("An unexpected error occurred. Please try again.");
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
        New passwords cannot be the same as a previous password. Password must be at least 8
        characters and contain at least one number and one special character.
      </p>
      {backendError && (
        <p style={{ color: "red", fontSize: "14px", margin: "0 0 10px 0", textAlign: "center" }}>
          {backendError}
        </p>
      )}
      {successMessage && (
        <p style={{ color: "green", fontSize: "14px", margin: "0 0 10px 0", textAlign: "center" }}>
          {successMessage}
        </p>
      )}
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChangePassword}
          placeholder="Password*"
          className="reset-password-input"
          disabled={loading || isSuccess}
          ref={passwordInputRef}
          style={{
            width: "100%",
            paddingRight: "40px",
            boxSizing: "border-box",
            color: "#666",
            caretColor: "black",
            caretWidth: "2px",
          }}
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
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
          disabled={loading || isSuccess}
          style={{
            width: "100%",
            paddingRight: "40px",
            boxSizing: "border-box",
            color: "#666",
            caretColor: "black",
            caretWidth: "2px",
          }}
        />
        <FontAwesomeIcon
          icon={showConfirmPassword ? faEyeSlash : faEye}
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
        disabled={loading || (!isFormValid && !isSuccess)}
      >
        {loading ? "Submitting..." : isSuccess ? "Return to Login" : "Save new password"}
      </button>
    </div>
  );
}