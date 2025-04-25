

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
  // const pathname = usePathname();
  // const isRegisterNewAccountpage = pathname === "/accounts/register-new-account";
  // console.log("isRegisterNewAccountpage", isRegisterNewAccountpage);
  const router = useRouter();

  // State to manage the current step
  const [step, setStep] = useState(1);

  // State to store form data across steps
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

  // Handle input changes for the registration form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for the first step (Register)
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Basic validation (you can expand this)
    if (formData.email !== formData.confirmEmail) {
      alert("Emails do not match!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate sending a verification code (you can integrate with an API here)
    console.log("Sending verification code to:", formData.email);
    setStep(2); // Move to VerifyEmail step
  };

  // Handle verification step completion
  const handleVerifyEmail = (verificationCode) => {
    setFormData((prev) => ({ ...prev, verificationCode }));
    // Simulate verification logic (replace with real API call)
    if (verificationCode === "123456") {
      setStep(3); // Move to AccountSetUp step
    } else {
      alert("Invalid verification code");
    }
  };

  // Handle AccountSetUp step completion
  const handleAccountSetUp = (accountSetupData) => {
    setFormData((prev) => ({ ...prev, accountSetupData }));
    setStep(4); // Move to Plans step
  };

  // Handle Plans step completion
  const handlePlans = (plan) => {
    setFormData((prev) => ({ ...prev, plan }));
    setStep(5); // Move to LastThing step
  };

  // Handle LastThing step completion
  const handleLastThing = () => {
    // Final submission logic (e.g., save all data to backend)
    console.log("Final form data:", formData);
    router.push("/"); // Redirect to homepage or dashboard
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
            Password must be at least 8 characters and contain at least one number and one special character.
          </small>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password*"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <p className="disclaimer">
            Photon does not store, transfer, or sell uploaded media files or user data to third parties. Media processed
            by Photon is used to create exclusive searchable pattern data unique to DejaVuAI®-specific solutions – users
            retain any and all rights to media that is uploaded.{" "}
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
        <VerifyEmail
          email={formData.email}
          onVerify={handleVerifyEmail}
        />
      )}

      {step === 3 && (
        <AccountSetUp
          onContinue={handleAccountSetUp}
        />
      )}

      {step === 4 && (
        <Plans
          onContinue={handlePlans}
        />
      )}

      {step === 5 && (
        <LastThing
          onContinue={handleLastThing}
        />
      )}
    </div>
  );
}


