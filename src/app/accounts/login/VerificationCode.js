


// import React, { useState, useEffect, useRef } from "react";
// import "./login.css";

// const BACKEND_URL = "http://127.0.0.1:8000";

// export default function VerificationCode({ onNextStep, emailOrPhone, verificationCodeFromBackend }) {
//   const [verificationCode, setVerificationCode] = useState("");
//   const [errors, setErrors] = useState({});
//   const [showErrors, setShowErrors] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [backendError, setBackendError] = useState("");
//   const inputRef = useRef(null);

//   useEffect(() => {
//     console.log("[VerificationCode] Received emailOrPhone:", emailOrPhone);
//     validateForm();
//   }, []);

//   useEffect(() => {
//     validateForm();
//   }, [verificationCode]);

//   const handleChange = (e) => {
//     const { value } = e.target;
//     console.log(`[VerificationCode] Verification code changed to: "${value}"`);
//     const trimmedValue = value.trim();
//     setVerificationCode(trimmedValue);
//     validateField(trimmedValue);
//     setBackendError("");
//     console.log(`[VerificationCode] Backend error cleared on input change`);
//     if (!showErrors && trimmedValue) {
//       setShowErrors(true);
//       console.log("[VerificationCode] Show errors enabled");
//     }
//   };

//   const validateField = (value) => {
//     const newErrors = {};
//     if (!value) {
//       newErrors.verificationCode = "Verification code is required";
//     } else {
//       const codeRegex = /^\d{6}$/;
//       const isCodeValid = codeRegex.test(value);
//       console.log(`[VerificationCode] Validation - isCodeValid: ${isCodeValid}`);
//       if (!isCodeValid) {
//         newErrors.verificationCode = "Verification code must be a 6-digit number";
//       } else {
//         delete newErrors.verificationCode;
//       }
//     }
//     setErrors(newErrors);
//     console.log(`[VerificationCode] Validation errors updated: ${JSON.stringify(newErrors)}`);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!verificationCode) {
//       newErrors.verificationCode = "Verification code is required";
//     } else {
//       const codeRegex = /^\d{6}$/;
//       const isCodeValid = codeRegex.test(verificationCode);
//       if (!isCodeValid) {
//         newErrors.verificationCode = "Verification code must be a 6-digit number";
//       }
//     }
//     setErrors(newErrors);
//     const isValid = Object.keys(newErrors).length === 0;
//     console.log(`[VerificationCode] Form validation - isValid: ${isValid}, Errors: ${JSON.stringify(newErrors)}`);
//     setIsFormValid(isValid);
//     return isValid;
//   };

//   const handleSubmit = async () => {
//     setShowErrors(true);
//     setBackendError("");
//     const isValid = validateForm();
//     if (!isValid) {
//       console.log("[VerificationCode] Verification code form validation failed");
//       return;
//     }
//     console.log("[VerificationCode] Verification code submission data:", { emailOrPhone, verificationCode });
//     setLoading(true);
//     try {
//       const response = await fetch(`${BACKEND_URL}/accounts/verify-reset-code`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           emailOrPhone,
//           verificationCode,
//         }),
//       });
//       const data = await response.json();
//       console.log(`[VerificationCode] Backend response - Status: ${response.status}, Data: ${JSON.stringify(data)}`);
//       if (!response.ok) {
//         console.log("[VerificationCode] Verification code validation failed:", data.detail);
//         setBackendError(data.detail || "Failed to verify code");
//         setVerificationCode("");
//         setShowErrors(false);
//         setErrors({});
//         setIsFormValid(false);
//         if (inputRef.current) {
//           inputRef.current.focus();
//           console.log("[VerificationCode] Input field focused after failure");
//         }
//       } else {
//         console.log("[VerificationCode] Verification code validation successful");
//         onNextStep(emailOrPhone); // Pass emailOrPhone to maintain flow
//       }
//     } catch (error) {
//       console.error("[VerificationCode] Unexpected error:", error);
//       setBackendError("An unexpected error occurred. Please try again.");
//       setVerificationCode("");
//       setShowErrors(false);
//       setErrors({});
//       setIsFormValid(false);
//       if (inputRef.current) {
//         inputRef.current.focus();
//         console.log("[VerificationCode] Input field focused after error");
//       }
//     } finally {
//       setLoading(false);
//       console.log("[VerificationCode] Loading state reset");
//     }
//   };

//   return (
//     <div className="verification-code-container">
//       <h2 className="verification-code-title">Verification Code</h2>
//       <p className="verification-code-instruction">
//         Please enter the verification code that was sent to your email or phone number.
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
//           value={verificationCode}
//           onChange={handleChange}
//           placeholder="Verification code"
//           className="verification-code-input"
//           disabled={loading}
//           ref={inputRef}
//         />
//         <p
//           style={{
//             color: "red",
//             fontSize: "12px",
//             margin: "0",
//             minHeight: "16px",
//             visibility: showErrors && errors.verificationCode ? "visible" : "hidden",
//           }}
//         >
//           {showErrors && errors.verificationCode ? errors.verificationCode : ""}
//         </p>
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="verification-code-submit"
//         disabled={loading || !isFormValid}
//       >
//         {loading ? "Submitting..." : "Submit"}
//       </button>
//       <a href="http://localhost:3000/accounts/login" className="verification-code-back">
//         Back to login
//       </a>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import "./login.css";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function VerificationCode({ onNextStep, emailOrPhone, verificationCodeFromBackend, onBackToLogin }) {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    console.log("[VerificationCode] Received emailOrPhone:", emailOrPhone);
    validateForm();
  }, []);

  useEffect(() => {
    validateForm();
  }, [verificationCode]);

  const handleChange = (e) => {
    const { value } = e.target;
    console.log(`[VerificationCode] Verification code changed to: "${value}"`);
    const trimmedValue = value.trim();
    setVerificationCode(trimmedValue);
    validateField(trimmedValue);
    setBackendError("");
    console.log(`[VerificationCode] Backend error cleared on input change`);
    if (!showErrors && trimmedValue) {
      setShowErrors(true);
      console.log("[VerificationCode] Show errors enabled");
    }
  };

  const validateField = (value) => {
    const newErrors = {};
    if (!value) {
      newErrors.verificationCode = "Verification code is required";
    } else {
      const codeRegex = /^\d{6}$/;
      const isCodeValid = codeRegex.test(value);
      console.log(`[VerificationCode] Validation - isCodeValid: ${isCodeValid}`);
      if (!isCodeValid) {
        newErrors.verificationCode = "Verification code must be a 6-digit number";
      } else {
        delete newErrors.verificationCode;
      }
    }
    setErrors(newErrors);
    console.log(`[VerificationCode] Validation errors updated: ${JSON.stringify(newErrors)}`);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!verificationCode) {
      newErrors.verificationCode = "Verification code is required";
    } else {
      const codeRegex = /^\d{6}$/;
      const isCodeValid = codeRegex.test(verificationCode);
      if (!isCodeValid) {
        newErrors.verificationCode = "Verification code must be a 6-digit number";
      }
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`[VerificationCode] Form validation - isValid: ${isValid}, Errors: ${JSON.stringify(newErrors)}`);
    setIsFormValid(isValid);
    return isValid;
  };

  const validateEmailOrPhone = (value) => {
    if (!value || value.trim() === "") {
      return "Email or phone number is missing. Please restart the password reset process.";
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
    setShowErrors(true);
    setBackendError("");

    const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);
    if (emailOrPhoneError) {
      console.log("[VerificationCode] Invalid emailOrPhone:", emailOrPhone);
      setBackendError(emailOrPhoneError);
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      console.log("[VerificationCode] Verification code form validation failed");
      return;
    }

    console.log("[VerificationCode] Verification code submission data:", { emailOrPhone, verificationCode });

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/accounts/verify-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          verificationCode,
        }),
      });
      const data = await response.json();
      console.log(`[VerificationCode] Backend response - Status: ${response.status}, Data: ${JSON.stringify(data)}`);
      if (!response.ok) {
        console.log("[VerificationCode] Verification code validation failed:", data.detail);
        setBackendError(data.detail || "Failed to verify code");
        setVerificationCode("");
        setShowErrors(false);
        setErrors({});
        setIsFormValid(false);
        if (inputRef.current) {
          inputRef.current.focus();
          console.log("[VerificationCode] Input field focused after failure");
        }
      } else {
        console.log("[VerificationCode] Verification code validation successful");
        onNextStep(emailOrPhone);
      }
    } catch (error) {
      console.error("[VerificationCode] Unexpected error:", error);
      setBackendError("An unexpected error occurred. Please try again.");
      setVerificationCode("");
      setShowErrors(false);
      setErrors({});
      setIsFormValid(false);
      if (inputRef.current) {
        inputRef.current.focus();
        console.log("[VerificationCode] Input field focused after error");
      }
    } finally {
      setLoading(false);
      console.log("[VerificationCode] Loading state reset");
    }
  };

  return (
    <div className="verification-code-container">
      <h2 className="verification-code-title">Verification Code</h2>
      <p className="verification-code-instruction">
        Please enter the verification code that was sent to your email or phone number.
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
          value={verificationCode}
          onChange={handleChange}
          placeholder="Verification code"
          className="verification-code-input"
          disabled={loading}
          ref={inputRef}
        />
        <p
          style={{
            color: "red",
            fontSize: "12px",
            margin: "0",
            minHeight: "16px",
            visibility: showErrors && errors.verificationCode ? "visible" : "hidden",
          }}
        >
          {showErrors && errors.verificationCode ? errors.verificationCode : ""}
        </p>
      </div>
      <button
        onClick={handleSubmit}
        className="verification-code-submit"
        disabled={loading || !isFormValid}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      <button
        onClick={onBackToLogin}
        className="verification-code-back"
      >
        Back to login
      </button>
    </div>
  );
}