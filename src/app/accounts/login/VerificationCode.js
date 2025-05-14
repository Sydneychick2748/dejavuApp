

// import React, { useState, useEffect, useRef } from "react";
// import "./login.css";

// // Configurable backend URL (consistent with ForgotPassword.jsx)
// const BACKEND_URL = "http://127.0.0.1:8000";

// export default function VerificationCode({ onNextStep, emailOrPhone, verificationCodeFromBackend }) {
//   const [verificationCode, setVerificationCode] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showErrors, setShowErrors] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [backendError, setBackendError] = useState("");
//   const inputRef = useRef(null);

//   useEffect(() => {
//     // Initial validation on mount
//     validateForm();
//   }, []);

//   useEffect(() => {
//     // Re-validate whenever verificationCode changes
//     validateForm();
//   }, [verificationCode]);

//   const handleChange = (e) => {
//     const { value } = e.target;
//     console.log(`[VerificationCode] Verification code changed to: "${value}"`);

//     const trimmedValue = value.trim();
//     setVerificationCode(trimmedValue);
//     validateField(trimmedValue);
//     setBackendError(""); // Clear backend error when the user starts typing
//     console.log(`[VerificationCode] Backend error cleared on input change`);

//     // Ensure errors are shown after the user starts typing
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

//     console.log("[VerificationCode] Verification code submission data:", { verificationCode });

//     setLoading(true);
//     try {
//       // Mock validation: Compare the entered code with the one from ForgotPassword
//       console.log(`[VerificationCode] Comparing codes - entered: ${verificationCode}, expected: ${verificationCodeFromBackend}`);
//       if (verificationCode !== verificationCodeFromBackend) {
//         console.log("[VerificationCode] Verification code validation failed: Incorrect code entered");
//         setBackendError("This is not the right code, please go back to login");
//         // Reset the input field and states on error
//         setVerificationCode("");
//         setShowErrors(false);
//         setErrors({});
//         setIsFormValid(false);
//         if (inputRef.current) {
//           inputRef.current.focus();
//           console.log("[VerificationCode] Input field focused after error");
//         }
//       } else {
//         // If the code matches, proceed to the next step
//         console.log("[VerificationCode] Mock verification code validation successful");
//         onNextStep();
//       }
//     } catch (error) {
//       console.log("[VerificationCode] Unexpected error:", error.message);
//       setBackendError("An unexpected error occurred. Please try again.");
//       // Reset the input field and states on error
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

// Configurable backend URL (consistent with ForgotPassword.jsx)
const BACKEND_URL = "http://127.0.0.1:8000";

export default function VerificationCode({ onNextStep, emailOrPhone, verificationCodeFromBackend }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Initial validation on mount
    validateForm();
  }, []);

  useEffect(() => {
    // Re-validate whenever verificationCode changes
    validateForm();
  }, [verificationCode]);

  const handleChange = (e) => {
    const { value } = e.target;
    console.log(`[VerificationCode] Verification code changed to: "${value}"`);

    const trimmedValue = value.trim();
    setVerificationCode(trimmedValue);
    validateField(trimmedValue);
    setBackendError(""); // Clear backend error when the user starts typing
    console.log(`[VerificationCode] Backend error cleared on input change`);

    // Ensure errors are shown after the user starts typing
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

  const handleSubmit = async () => {
    setShowErrors(true);
    setBackendError("");

    const isValid = validateForm();
    if (!isValid) {
      console.log("[VerificationCode] Verification code form validation failed");
      return;
    }

    console.log("[VerificationCode] Verification code submission data:", { emailOrPhone, verificationCode });

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/accounts/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone,
          verificationCode: verificationCode,
        }),
      });

      const data = await response.json();
      console.log(`[VerificationCode] Backend response - Status: ${response.status}, Data: ${JSON.stringify(data)}`);

      if (!response.ok) {
        console.log("[VerificationCode] Verification code validation failed:", data.detail);
        setBackendError(data.detail || "Failed to verify code");
        // Reset the input field and states on failure
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
        onNextStep(); // Move to the next step (Reset Password)
      }
    } catch (error) {
      console.log("[VerificationCode] Unexpected error:", error.message);
      setBackendError("An unexpected error occurred. Please try again.");
      // Reset the input field and states on error
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
      <a href="http://localhost:3000/accounts/login" className="verification-code-back">
        Back to login
      </a>
    </div>
  );
}