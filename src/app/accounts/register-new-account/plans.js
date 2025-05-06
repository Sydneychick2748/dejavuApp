

import React from "react";
import Link from "next/link";
import "./registerNewAccount.css";

const Plans = ({ onContinue, onBack }) => {
  const handleContinue = (e) => {
    e.preventDefault(); // Prevent any default navigation
    console.log("Continue to payment clicked");
    onContinue("placeholder-plan"); // Pass the selected plan to the onContinue handler
  };

  const handleBack = () => {
    console.log("Back clicked");
    onBack();
  };

  return (
    <div className="plans-container">
      <h1 className="setup-title">Plans & Pricing</h1>
      <div className="plans-placeholder">
        <p>TBD...</p>
      </div>
      <div className="button-group">
        <button
          className="plans-continue-button"
          onClick={handleContinue}
          type="button"
        >
          Continue to payment
        </button>
        <button
          className="plans-back-button"
          onClick={handleBack}
          type="button"
        >
          Back
        </button>
      </div>
      <div className="support-link">
        <span>Questions? </span>
        <Link href="/photon-dropdown/contact-support">Contact support</Link>
      </div>
    </div>
  );
};

export default Plans;
