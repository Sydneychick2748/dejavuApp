import React, { useState } from 'react';
import Link from 'next/link';
import "./registerNewAccount.css"; // Optional for styling
const AccountSetUp = () => {
    return (
      <div className="account-setup-container">
        <h1 className="setup-title">Finish Setting Up Your Account</h1>
        {/* If form fields are coming later, keep this empty space for layout balance */}
        <div className="spacer"></div>
        <Link href="/accounts/register-new-account/plans">
          <button className="continue-button">Continue to Plans & Pricing</button>
        </Link>
        <div className="support-link">
          <span>Questions? </span>
          <Link href="/photon-dropdown/contact-support">Contact support</Link>
        </div>
      </div>
    );
  };
  export default AccountSetUp;





