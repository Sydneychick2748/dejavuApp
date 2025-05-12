

// // import React, { useState } from 'react';
// // import "./login.css"; // External CSS for styling

// // const VerificationCode = ({ onSubmit }) => {
// //   const [verificationCode, setVerificationCode] = useState('');

// //   const handleCodeChange = (event) => {
// //     setVerificationCode(event.target.value);
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     if (verificationCode) {
// //       console.log("Verification code submitted:", verificationCode);
// //       // Perform the verification process (e.g., call an API)
// //       onSubmit(verificationCode); // Pass the code to parent component or handle here
// //     } else {
// //       alert("Please enter a valid verification code.");
// //     }
// //   };

// //   return (
// //     <div className="verification-container">
// //       <h2 className="verification-title">Verification Code</h2>
// //       <p className="verification-instructions">
// //         Please enter the verification code that was sent to your email or phone number.
// //       </p>

// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="text"
// //           name="verification-code"
// //           value={verificationCode}
// //           onChange={handleCodeChange}
// //           placeholder="Verification code"
// //           className="verification-input"
// //           required
// //         />
// //         <button type="submit" className="submit-btn">Submit</button>
// //       </form>

// //       <div className="links">
// //         <a href="/login" className="back-link">Back to login</a>
// //         <a href="/contact-support" className="support-link">Contact support</a>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VerificationCode;


import React, { useState } from "react";
import "./login.css";

export default function VerificationCode({ onNextStep }) {
  const [verificationCode, setVerificationCode] = useState('');

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = () => {
    // Assuming verification of the code happens here.
    onNextStep(); // Move to the next step (Reset Password)
  };

  return (
    <div className="verification-code-container">
      <h2 className="verification-code-title">Verification Code</h2>
      <p className="verification-code-instruction">
        Please enter the verification code that was sent to your email or phone number.
      </p>
      <input
        type="text"
        value={verificationCode}
        onChange={handleChange}
        placeholder="Verification code"
        className="verification-code-input"
      />
      <button onClick={handleSubmit} className="verification-code-submit">Submit</button>
      <a href="http://localhost:3000/accounts/login" className="verification-code-back">Back to login</a>
      {/* <a href="http://localhost:3000/accounts/login" className="verification-code-support">Contact support</a> */}
    </div>
  );
}