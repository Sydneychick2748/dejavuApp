

import React from "react";
// import Link from "next/link";
import "./registerNewAccount.css"; // Optional for styling

const AccountSetUp = ({ onContinue }) => {
  return (
    <div className="account-setup-container">
      <h1 className="setup-title">Finish Setting Up Your Account</h1>

      <div className="spacer"></div>

      <button 
        className="continue-button" 
        onClick={() => onContinue()} // Trigger the onContinue callback passed from CreateAccount
      >
        Continue to Plans & Pricing
      </button>

      <div className="support-link">
        <span>Questions? </span>
        <a href="/photon-dropdown/contact-support">Contact support</a>
      </div>
    </div>
  );
};

export default AccountSetUp;
