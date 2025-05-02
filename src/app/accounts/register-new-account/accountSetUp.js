
import React from "react";
import Link from "next/link";
import "./registerNewAccount.css"; // Optional for styling

const AccountSetUp = ({ onContinue }) => {
  const handleContinue = () => {
    console.log("Account setup completed");
    onContinue(); // Call the function passed from the parent
  };

  return (
    <div className="account-setup-container">
      <h1 className="setup-title">Finish Setting Up Your Account</h1>
      {/* If form fields are coming later, keep this empty space for layout balance */}
      <div className="spacer"></div>
      <button
        className="continue-button"
        onClick={handleContinue}
        type="button"
      >
        Continue to Plans & Pricing
      </button>
      <div className="support-link">
        <span>Questions? </span>
        <Link href="/photon-dropdown/contact-support">
          <a>Contact support</a> {/* Wrap it with an <a> tag */}
        </Link>
      </div>
    </div>
  );
};

export default AccountSetUp;






