

// // import React, { useState } from 'react';
// // import "./login.css";  // External CSS for styling

// // const ResetPassword = ({ onSave }) => {
// //   const [password, setPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [error, setError] = useState('');

// //   const handlePasswordChange = (event) => {
// //     setPassword(event.target.value);
// //   };

// //   const handleConfirmPasswordChange = (event) => {
// //     setConfirmPassword(event.target.value);
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     if (password !== confirmPassword) {
// //       setError('Passwords do not match.');
// //     } else if (!isValidPassword(password)) {
// //       setError('Password must be at least 8 characters and contain at least one number and one special character.');
// //     } else {
// //       setError('');
// //       console.log("Password reset to:", password);
// //       // Proceed to reset the password, call an API or any action
// //       onSave(password); // Pass the password to the parent component or handle here
// //     }
// //   };

// //   const isValidPassword = (password) => {
// //     // Regex for password validation: at least 8 characters, one number, one special character
// //     const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// //     return regex.test(password);
// //   };

// //   return (
// //     <div className="reset-password-container">
// //       <h2 className="reset-password-title">Reset Password</h2>
// //       <p className="reset-password-instructions">
// //         New passwords cannot be the same as a previous password. Password must be at least 8 characters and contain at least one number and one special character.
// //       </p>

// //       <form onSubmit={handleSubmit}>
// //         <div className="input-group">
// //           <label htmlFor="password">Password*</label>
// //           <input
// //             type="password"
// //             id="password"
// //             name="password"
// //             value={password}
// //             onChange={handlePasswordChange}
// //             placeholder="Enter new password"
// //             className="password-input"
// //             required
// //           />
// //         </div>
        
// //         <div className="input-group">
// //           <label htmlFor="confirm-password">Confirm password*</label>
// //           <input
// //             type="password"
// //             id="confirm-password"
// //             name="confirm-password"
// //             value={confirmPassword}
// //             onChange={handleConfirmPasswordChange}
// //             placeholder="Confirm new password"
// //             className="password-input"
// //             required
// //           />
// //         </div>

// //         {error && <p className="error-message">{error}</p>}

// //         <button type="submit" className="save-btn">Save new password</button>
// //       </form>

// //       <div className="support-link">
// //         <span>Questions? </span>
// //         <a href="/contact-support" className="contact-support-link">Contact support</a>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResetPassword;


import React, { useState } from "react";
import "./login.css";

export default function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      alert("Password has been reset!");
      onBackToLogin(); // Redirect back to the login form
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      <p className="reset-password-instruction">
        New passwords cannot be the same as a previous password. Password must be at least 8 characters and contain at least one number and one special character.
      </p>
      <input
        type="password"
        value={password}
        onChange={handleChangePassword}
        placeholder="Password*"
        className="reset-password-input"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={handleChangeConfirmPassword}
        placeholder="Confirm password*"
        className="reset-password-input"
      />
      {error && <p className="reset-password-error">{error}</p>}
      <button onClick={handleSubmit} className="reset-password-submit">Save new password</button>
      {/* <a href="#" className="reset-password-support">Contact support</a> */}
    </div>
  );
}