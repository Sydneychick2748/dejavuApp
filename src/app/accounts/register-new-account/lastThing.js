

import React from 'react';
import Link from 'next/link';  // Use Link for navigation in Next.js
import './registerNewAccount.css'; // Optional, for styling

const LastThing = ({ onContinue }) => {
  const handleNoClick = () => {
    console.log("User clicked 'No, show me how it works'");
    // You can navigate to a tutorial or onboarding page here
    onContinue('tutorial'); // You can set this to whatever action you want
  };

  const handleYesClick = () => {
    console.log("User clicked 'Yes, take me to the dashboard'");
    // Navigate the user to the dashboard
    onContinue('dashboard');
  };

  return (
    <div className="last-thing-container">
      <h1 className="setup-title">Finished Account Setup</h1>
      <p>One last thing: Are you familiar with using Photon?</p>

      <div className="button-group">
        <button className="last-thing-button" onClick={handleNoClick}>
          No, show me how it works
        </button>
        <button className="last-thing-button" onClick={handleYesClick}>
          Yes, take me to the dashboard
        </button>
      </div>

      <div className="support-link">
        <span>Questions? </span>
        <Link href="/photon-dropdown/contact-support">Contact support</Link>
      </div>
    </div>
  );
};

export default LastThing;
