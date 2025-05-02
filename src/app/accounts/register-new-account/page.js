

"use client";

import { useState } from "react";
// import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import VerifyEmail from "./verifyEmail"; // Import your VerifyEmail component
import AccountSetUp from "./accountSetUp"; // Assuming this exists
import Plans from "./plans"; // Assuming this exists
import LastThing from "./lastThing"; // Assuming this exists
import "./registerNewAccount.css"; // Optional for styling

export default function CreateAccount() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    accountSetupData: {},
    plan: "",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.email !== formData.confirmEmail) {
      alert("Emails do not match!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Sending verification code to:", formData.email);
    setStep(2);
  };

  const handleVerifyEmail = (verificationCode) => {
    setFormData((prev) => ({ ...prev, verificationCode }));
    if (verificationCode === "123456") {
      setStep(3);
    } else {
      alert("Invalid verification code");
    }
  };

  const handleAccountSetUp = (accountSetupData) => {
    setFormData((prev) => ({ ...prev, accountSetupData }));
    setStep(4); // Proceed to Plans step
  };

  const handlePlans = (plan) => {
    console.log("Plan selected:", plan);
    setFormData((prev) => ({ ...prev, plan }));
    setStep(5); // Move to LastThing step
  };

  // const handleLastThing = () => {
  //   console.log("Final form data:", formData);
  //   console.log("Navigating to /");
  //   router.replace("/"); // Use replace to avoid history issues
  // };

  const handleLastThing = (selection) => {
    console.log("Final choice:", selection);
    const router = useRouter();  // Make sure the router is initialized here.
  
    if (selection === 'tutorial') {
      // Navigate to the tutorial page
      console.log("Navigating to tutorial page");
      router.replace('/tutorial');  // Adjust the URL as needed for the tutorial page
    } else if (selection === 'dashboard') {
      // Navigate to the dashboard
      console.log("Navigating to dashboard");
      router.replace('/dashboard');  // Adjust the URL as needed for the dashboard
    } else {
      console.log("Unknown selection:", selection);
    }
  };

  return (
    <div className="register-container">
      {step === 1 && (
        <form className="register-box" onSubmit={handleRegisterSubmit}>
          <h2>Register New Account</h2>
          <div className="name-row">
            <input
              type="text"
              name="firstName"
              placeholder="First name*"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name*"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email address*"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="email"
            name="confirmEmail"
            placeholder="Confirm email*"
            value={formData.confirmEmail}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number*"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={formData.password}
            onChange={handleChange}
          />
          <small className="password-hint">
            Password must be at least 8 characters and contain at least one
            number and one special character.
          </small>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password*"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <p className="disclaimer">
            Photon does not store, transfer, or sell uploaded media files or
            user data to third parties. Media processed by Photon is used to
            create exclusive searchable pattern data unique to
            DejaVuAI®-specific solutions – users retain any and all rights to
            media that is uploaded.{" "}
            <a href="#">Learn more about how your data is managed ›</a>
          </p>
          <p className="legal">
            By clicking Agree & Continue, you agree to the Photon{" "}
            <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </p>
          <button type="submit" className="agree-btn">
            Agree & Continue
          </button>
          <p className="support-link">
            Questions? <a href="#">Contact support</a>
          </p>
        </form>
      )}

      {step === 2 && (
        <VerifyEmail email={formData.email} onVerify={handleVerifyEmail} />
      )}
      {step === 3 && <AccountSetUp onContinue={handleAccountSetUp} />}
      {step === 4 && (
        <Plans onContinue={handlePlans} onBack={() => setStep(3)} />
      )}
      {step === 5 && <LastThing onContinue={handleLastThing} />}
    </div>
  );
}
