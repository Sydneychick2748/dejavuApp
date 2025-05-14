


// import React, { useState, useEffect } from "react";
// import "./login.css";

// export default function ForgotPassword({ onNextStep }) {
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showErrors, setShowErrors] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [backendError, setBackendError] = useState("");

//   useEffect(() => {
//     validateForm();
//   }, [emailOrPhone]);

//   const handleChange = (e) => {
//     const { value } = e.target;
//     console.log(`Email or phone changed to: ${value}`);

//     if (!showErrors) {
//       setShowErrors(true);
//     }

//     setEmailOrPhone(value.trim());
//     validateField(value);
//   };

//   const validateField = (value) => {
//     const newErrors = {};

//     if (!value) {
//       newErrors.emailOrPhone = "Email or phone number is required";
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
//       const isEmailValid = emailRegex.test(value);
//       const isPhoneValid = phoneRegex.test(value);

//       if (!isEmailValid && !isPhoneValid) {
//         newErrors.emailOrPhone = "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
//       } else {
//         delete newErrors.emailOrPhone;
//       }
//     }

//     setErrors(newErrors);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!emailOrPhone) {
//       newErrors.emailOrPhone = "Email or phone number is required";
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
//       const isEmailValid = emailRegex.test(emailOrPhone);
//       const isPhoneValid = phoneRegex.test(emailOrPhone);

//       if (!isEmailValid && !isPhoneValid) {
//         newErrors.emailOrPhone = "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
//       }
//     }

//     setErrors(newErrors);
//     const isValid = Object.keys(newErrors).length === 0;
//     console.log(`Form validation: isValid=${isValid}, Errors: ${JSON.stringify(newErrors)}`);
//     setIsFormValid(isValid);
//     return isValid;
//   };

//   const handleSubmit = () => {
//     setShowErrors(true);
//     setBackendError("");

//     if (!validateForm()) {
//       console.log("Forgot password form validation failed");
//       return;
//     }

//     // Log the emailOrPhone value for future backend integration
//     console.log("Forgot password submission data:", { emailOrPhone });

//     // Simulate backend call (to be implemented later)
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       onNextStep(); // Move to the next step (Verification Code)
//     }, 1000); // Simulate 1-second delay
//   };

//   return (
//     <div className="forgot-password-container">
//       <h2 className="forgot-password-title">Forgot Password</h2>
//       <p className="forgot-password-instruction">
//         Enter your email address or phone number, and we'll send you a verification code to recover your account.
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
//           type="text"
//           value={emailOrPhone}
//           onChange={handleChange}
//           placeholder="Email or phone number"
//           className="forgot-password-input"
//           disabled={loading}
//         />
//         <p
//           style={{
//             color: "red",
//             fontSize: "12px",
//             margin: "0",
//             minHeight: "16px",
//             visibility: showErrors && errors.emailOrPhone ? "visible" : "hidden",
//           }}
//         >
//           {showErrors && errors.emailOrPhone ? errors.emailOrPhone : ""}
//         </p>
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="forgot-password-submit"
//         disabled={!isFormValid || loading}
//       >
//         {loading ? "Submitting..." : "Submit"}
//       </button>
//       <a href="http://localhost:3000/accounts/login" className="forgot-password-back">
//         Back to login
//       </a>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import "./login.css";

// export default function ForgotPassword({ onNextStep }) {
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showErrors, setShowErrors] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [backendError, setBackendError] = useState("");
//   const inputRef = useRef(null); // Reference to the input field for focusing

//   useEffect(() => {
//     validateForm();
//   }, [emailOrPhone]);

//   const handleChange = (e) => {
//     const { value } = e.target;
//     console.log(`Email or phone changed to: ${value}`);

//     if (!showErrors) {
//       setShowErrors(true);
//     }

//     setEmailOrPhone(value.trim());
//     validateField(value);
//     setBackendError(""); // Clear backend error when the user starts typing
//   };

//   const validateField = (value) => {
//     const newErrors = {};

//     if (!value) {
//       newErrors.emailOrPhone = "Email or phone number is required";
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
//       const isEmailValid = emailRegex.test(value);
//       const isPhoneValid = phoneRegex.test(value);

//       if (!isEmailValid && !isPhoneValid) {
//         newErrors.emailOrPhone = "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
//       } else {
//         delete newErrors.emailOrPhone;
//       }
//     }

//     setErrors(newErrors);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!emailOrPhone) {
//       newErrors.emailOrPhone = "Email or phone number is required";
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
//       const isEmailValid = emailRegex.test(emailOrPhone);
//       const isPhoneValid = phoneRegex.test(emailOrPhone);

//       if (!isEmailValid && !isPhoneValid) {
//         newErrors.emailOrPhone = "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
//       }
//     }

//     setErrors(newErrors);
//     const isValid = Object.keys(newErrors).length === 0;
//     console.log(`Form validation: isValid=${isValid}, Errors: ${JSON.stringify(newErrors)}`);
//     setIsFormValid(isValid);
//     return isValid;
//   };

//   const handleSubmit = () => {
//     setShowErrors(true);
//     setBackendError("");

//     if (!validateForm()) {
//       console.log("Forgot password form validation failed");
//       return;
//     }

//     console.log("Forgot password submission data:", { emailOrPhone });

//     // Simulate backend call with a failure case for testing
//     setLoading(true);
//     setTimeout(() => {
//       // Simulate a failure (e.g., email or phone not found)
//       const isSuccess = emailOrPhone === "test@example.com" || emailOrPhone === "(123)456-7890"; // Simulate success for specific values
//       if (!isSuccess) {
//         setBackendError("Email or phone number not found");
//         // Reset the input field and states on failure
//         setEmailOrPhone("");
//         setShowErrors(false);
//         setErrors({});
//         setIsFormValid(false);
//         // Focus the input field for the user to try again
//         if (inputRef.current) {
//           inputRef.current.focus();
//         }
//       } else {
//         console.log("Simulated verification code: 654321");
//         onNextStep(); // Move to the next step (Verification Code)
//       }
//       setLoading(false);
//     }, 1000); // Simulate 1-second delay
//   };

//   return (
//     <div className="forgot-password-container">
//       <h2 className="forgot-password-title">Forgot Password</h2>
//       <p className="forgot-password-instruction">
//         Enter your email address or phone number, and we'll send you a verification code to recover your account.
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
//           type="text"
//           value={emailOrPhone}
//           onChange={handleChange}
//           placeholder="Email or phone number"
//           className="forgot-password-input"
//           disabled={loading}
//           ref={inputRef} // Attach ref to the input
//         />
//         <p
//           style={{
//             color: "red",
//             fontSize: "12px",
//             margin: "0",
//             minHeight: "16px",
//             visibility: showErrors && errors.emailOrPhone ? "visible" : "hidden",
//           }}
//         >
//           {showErrors && errors.emailOrPhone ? errors.emailOrPhone : ""}
//         </p>
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="forgot-password-submit"
//         disabled={!isFormValid || loading}
//       >
//         {loading ? "Submitting..." : "Submit"}
//       </button>
//       <a href="http://localhost:3000/accounts/login" className="forgot-password-back">
//         Back to login
//       </a>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import "./login.css";

export default function ForgotPassword({ onNextStep }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // Store the verification code for the next step
  const inputRef = useRef(null); // Reference to the input field for focusing

  useEffect(() => {
    validateForm();
  }, [emailOrPhone]);

  const handleChange = (e) => {
    const { value } = e.target;
    console.log(`[ForgotPassword] Email or phone changed to: "${value}"`);

    if (!showErrors) {
      setShowErrors(true);
      console.log("[ForgotPassword] Show errors enabled");
    }

    const trimmedValue = value.trim();
    setEmailOrPhone(trimmedValue);
    validateField(trimmedValue);
    setBackendError(""); // Clear backend error when the user starts typing
    console.log(`[ForgotPassword] Backend error cleared on input change`);
  };

  const validateField = (value) => {
    const newErrors = {};

    if (!value) {
      newErrors.emailOrPhone = "Email or phone number is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
      const isEmailValid = emailRegex.test(value);
      const isPhoneValid = phoneRegex.test(value);

      console.log(`[ForgotPassword] Validation - isEmailValid: ${isEmailValid}, isPhoneValid: ${isPhoneValid}`);

      if (!isEmailValid && !isPhoneValid) {
        newErrors.emailOrPhone = "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
      } else {
        delete newErrors.emailOrPhone;
      }
    }

    setErrors(newErrors);
    console.log(`[ForgotPassword] Validation errors updated: ${JSON.stringify(newErrors)}`);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone number is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
      const isEmailValid = emailRegex.test(emailOrPhone);
      const isPhoneValid = phoneRegex.test(emailOrPhone);

      if (!isEmailValid && !isPhoneValid) {
        newErrors.emailOrPhone = "Invalid email or phone number format (use (XXX)XXX-XXXX for phone)";
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`[ForgotPassword] Form validation - isValid: ${isValid}, Errors: ${JSON.stringify(newErrors)}`);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleSubmit = async () => {
    setShowErrors(true);
    setBackendError("");

    if (!validateForm()) {
      console.log("[ForgotPassword] Forgot password form validation failed");
      return;
    }

    console.log("[ForgotPassword] Forgot password submission data:", { emailOrPhone });

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone,
        }),
      });

      const data = await response.json();
      console.log(`[ForgotPassword] Backend response - Status: ${response.status}, Data: ${JSON.stringify(data)}`);

      if (!response.ok) {
        setBackendError(data.detail || "Failed to request verification code");
        // Reset the input field and states on failure
        setEmailOrPhone("");
        setShowErrors(false);
        setErrors({});
        setIsFormValid(false);
        // Focus the input field for the user to try again
        if (inputRef.current) {
          inputRef.current.focus();
          console.log("[ForgotPassword] Input field focused after failure");
        }
      } else {
        console.log("[ForgotPassword] Verification code received:", data.verification_code);
        setVerificationCode(data.verification_code);
        onNextStep(); // Move to the next step (Verification Code)
      }
    } catch (error) {
      console.error("[ForgotPassword] Unexpected forgot password error:", error.message);
      setBackendError("An unexpected error occurred. Please try again.");
      // Reset the input field and states on error
      setEmailOrPhone("");
      setShowErrors(false);
      setErrors({});
      setIsFormValid(false);
      if (inputRef.current) {
        inputRef.current.focus();
        console.log("[ForgotPassword] Input field focused after error");
      }
    } finally {
      setLoading(false);
      console.log("[ForgotPassword] Loading state reset");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Forgot Password</h2>
      <p className="forgot-password-instruction">
        Enter your email address or phone number, and we'll send you a verification code to recover your account.
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
      <div>
        <input
          type="text"
          value={emailOrPhone}
          onChange={handleChange}
          placeholder="Email or phone number"
          className="forgot-password-input"
          disabled={loading}
          ref={inputRef} // Attach ref to the input
        />
        <p
          style={{
            color: "red",
            fontSize: "12px",
            margin: "0",
            minHeight: "16px",
            visibility: showErrors && errors.emailOrPhone ? "visible" : "hidden",
          }}
        >
          {showErrors && errors.emailOrPhone ? errors.emailOrPhone : ""}
        </p>
      </div>
      <button
        onClick={handleSubmit}
        className="forgot-password-submit"
        disabled={!isFormValid || loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      <a href="http://localhost:3000/accounts/login" className="forgot-password-back">
        Back to login
      </a>
    </div>
  );
}