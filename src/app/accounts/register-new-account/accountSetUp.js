// import React, { useState } from "react";
// import Link from "next/link";
// import "./registerNewAccount.css"; // Optional for styling

// const AccountSetUp = () => {
//   return (
//     <div className="account-setup-container">
//       <h1 className="setup-title">Finish Setting Up Your Account</h1>

//       {/* If form fields are coming later, keep this empty space for layout balance */}
//       <div className="spacer"></div>

//       <Link href="/accounts/register-new-account">
//         <button className="continue-button">Continue to Plans & Pricing</button>
//       </Link>

//       <div className="support-link">
//         <span>Questions? </span>
//         <Link href="/photon-dropdown/contact-support">
//           <a>Contact support</a> {/* Wrap it with an <a> tag */}
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AccountSetUp;

import React from "react";

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
