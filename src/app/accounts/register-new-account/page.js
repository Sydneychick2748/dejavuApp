

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import VerifyEmail from "./verifyEmail";
import AccountSetUp from "./accountSetUp";
import Plans from "./plans";
import LastThing from "./lastThing";
import "./registerNewAccount.css";

export default function CreateAccount() {
    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [rawPhoneInput, setRawPhoneInput] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [accountSetupData, setAccountSetupData] = useState({});
    const [plan, setPlan] = useState("");
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [hoveredError, setHoveredError] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        validateForm();
    }, []);

    useEffect(() => {
        validateForm();
    }, [firstName, lastName, email, confirmEmail, phone, password, confirmPassword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`${name} changed to: ${value}`);

        if (!showErrors) {
            setShowErrors(true);
        }

        if (name === "firstName") setFirstName(value);
        if (name === "lastName") setLastName(value);
        if (name === "email") setEmail(value.trim());
        if (name === "confirmEmail") setConfirmEmail(value.trim());
        if (name === "phone") {
            setRawPhoneInput(value);
            const cleanedValue = value.replace(/[^0-9()-]/g, '').trim();
            setPhone(cleanedValue);
        }
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);

        validateField(name, value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === "firstName" && !value.trim()) {
            newErrors.firstName = "First name is required";
        } else if (name === "firstName") {
            delete newErrors.firstName;
        }

        if (name === "lastName" && !value.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (name === "lastName") {
            delete newErrors.lastName;
        }

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                newErrors.email = "Email is required";
            } else if (!emailRegex.test(value)) {
                newErrors.email = "Invalid email format";
            } else {
                delete newErrors.email;
            }
        }

        if (name === "confirmEmail" || name === "email") {
            const emailValue = name === "email" ? value : email;
            const confirmEmailValue = name === "confirmEmail" ? value : confirmEmail;
            if (emailValue && confirmEmailValue && emailValue !== confirmEmailValue) {
                newErrors.confirmEmail = "Emails do not match";
            } else {
                delete newErrors.confirmEmail;
            }
        }

        if (name === "phone" || name === "rawPhoneInput") {
            const phoneValue = phone;
            const phoneFormatRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
            console.log(`Validating phone: "${phoneValue}", Matches regex: ${phoneFormatRegex.test(phoneValue)}`);
            if (!phoneFormatRegex.test(phoneValue)) {
                console.log(`Phone character codes: ${phoneValue.split('').map(char => char.charCodeAt(0)).join(', ')}`);
            }
            if (!phoneValue) {
                newErrors.phone = "Phone number is required";
            } else if (!phoneFormatRegex.test(phoneValue)) {
                newErrors.phone = "Phone number must be in the format (XXX)XXX-XXXX";
            } else {
                delete newErrors.phone;
            }
        }

        if (name === "password") {
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
            if (!value) {
                newErrors.password = "Password is required";
            } else if (!passwordRegex.test(value)) {
                newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
            } else {
                delete newErrors.password;
            }
        }

        if (name === "confirmPassword" || name === "password") {
            const passwordValue = name === "password" ? value : password;
            const confirmPasswordValue = name === "confirmPassword" ? value : confirmPassword;
            if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
                newErrors.confirmPassword = "Passwords do not match";
            } else {
                delete newErrors.confirmPassword;
            }
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!firstName.trim()) newErrors.firstName = "First name is required";
        if (!lastName.trim()) newErrors.lastName = "Last name is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (email !== confirmEmail) {
            newErrors.confirmEmail = "Emails do not match";
        }

        const phoneFormatRegex = /^\(\d{3}\)\d{3}-\d{4}$/;
        console.log(`Validating form phone: "${phone}", Matches regex: ${phoneFormatRegex.test(phone)}`);
        if (!phoneFormatRegex.test(phone)) {
            console.log(`Phone character codes: ${phone.split('').map(char => char.charCodeAt(0)).join(', ')}`);
        }
        if (!phone) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneFormatRegex.test(phone)) {
            newErrors.phone = "Phone number must be in the format (XXX)XXX-XXXX";
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!password) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Password must be at least 8 characters and contain at least one number and one special character";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log(`Form validation: isValid=${isValid}, Errors: ${JSON.stringify(newErrors)}`);
        setIsFormValid(isValid);
        return isValid;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        setShowErrors(true);
        setBackendError("");

        if (!validateForm()) {
            return;
        }

        try {
            console.log("Sending registration request with data:", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone.replace("(", "").replace(")", "").replace("-", ""),
                password: password,
            });
            const response = await fetch('http://127.0.0.1:8000/accounts/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone.replace("(", "").replace(")", "").replace("-", ""), // Convert to XXXXXXXXXX
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Registration failed with response:", data);
                if (data.detail === "Email already registered") {
                    setBackendError("This email is already registered. Please go to the login page.");
                } else {
                    throw new Error(data.detail || 'Registration failed');
                }
            } else {
                console.log("Registration successful, verification code received:", data.verification_code);
                setVerificationCode(data.verification_code);
                setStep(2);
            }
        } catch (error) {
            console.error("Unexpected registration error:", error.message);
            setBackendError(error.message);
        }
    };

    const handleVerifyEmail = async (enteredCode) => {
        console.log("handleVerifyEmail called with code:", enteredCode);
        try {
            console.log("Sending verification request with email:", email, "and code:", enteredCode);
            const response = await fetch('http://127.0.0.1:8000/accounts/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    verification_code: enteredCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Verification failed with response:", data);
                throw new Error(data.detail || 'Invalid verification code');
            }

            console.log("Verification successful, moving to step 3");
            setStep(3);
        } catch (error) {
            console.error("Verification error:", error.message);
            setBackendError(error.message);
        }

        // Commented out mock verification logic
        /*
        if (enteredCode === "123456") {
            console.log("Mock verification successful with code: 123456");
            setStep(3); // Move to AccountSetUp
        } else {
            console.error("Invalid mock verification code:", enteredCode);
            setBackendError("Invalid mock code (try 123456)");
        }
        */
    };

    const handleAccountSetUp = (accountSetupData) => {
        console.log("handleAccountSetUp called with data:", accountSetupData);
        setAccountSetupData(accountSetupData);
        setStep(4);
    };

    const handlePlans = (plan) => {
        console.log("handlePlans called with plan:", plan);
        setPlan(plan);
        setStep(5);
    };

    const handleLastThing = (selection) => {
        console.log("handleLastThing called with selection:", selection);
        if (selection === "tutorial") {
            router.replace("/tutorial");
        } else if (selection === "dashboard") {
            router.replace("/dashboard");
        }
    };

    return (
        <div className="register-container">
            {step === 1 && (
                <form className="register-box" onSubmit={handleRegisterSubmit}>
                    <h2>Register New Account</h2>
                    {backendError && (
                        <p style={{ color: "red", fontSize: "14px", margin: "0 0 10px 0" }}>
                            {backendError}
                            {backendError.includes("already registered") && (
                                <span>
                                    {" "}
                                    <a href="/accounts/login" style={{ color: "#3D8BFF", textDecoration: "underline" }}>
                                        Go to login
                                    </a>
                                </span>
                            )}
                        </p>
                    )}
                    <div className="name-row" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: "0" }}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name*"
                                value={firstName}
                                onChange={handleChange}
                                tabIndex={1}
                                style={{ color: "#666", caretColor: "black", width: "100%", boxSizing: "border-box" }}
                            />
                            <p
                                style={{
                                    color: hoveredError === "firstName" ? "blue" : "red",
                                    fontSize: "12px",
                                    margin: "0",
                                    minHeight: "16px",
                                    visibility: showErrors && errors.firstName ? "visible" : "hidden"
                                }}
                                onMouseEnter={() => setHoveredError("firstName")}
                                onMouseLeave={() => setHoveredError(null)}
                            >
                                {showErrors && errors.firstName ? errors.firstName : ""}
                            </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: "0" }}>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name*"
                                value={lastName}
                                onChange={handleChange}
                                tabIndex={2}
                                style={{ color: "#666", caretColor: "black", width: "100%", boxSizing: "border-box" }}
                            />
                            <p
                                style={{
                                    color: hoveredError === "lastName" ? "blue" : "red",
                                    fontSize: "12px",
                                    margin: "0",
                                    minHeight: "16px",
                                    visibility: showErrors && errors.lastName ? "visible" : "hidden"
                                }}
                                onMouseEnter={() => setHoveredError("lastName")}
                                onMouseLeave={() => setHoveredError(null)}
                            >
                                {showErrors && errors.lastName ? errors.lastName : ""}
                            </p>
                        </div>
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address*"
                        value={email}
                        onChange={handleChange}
                        tabIndex={3}
                        style={{ color: "#666", caretColor: "black" }}
                    />
                    <p
                        style={{
                            color: hoveredError === "email" ? "blue" : "red",
                            fontSize: "12px",
                            margin: "0",
                            minHeight: "16px",
                            visibility: showErrors && errors.email ? "visible" : "hidden"
                        }}
                        onMouseEnter={() => setHoveredError("email")}
                        onMouseLeave={() => setHoveredError(null)}
                    >
                        {showErrors && errors.email ? errors.email : ""}
                    </p>
                    <input
                        type="email"
                        name="confirmEmail"
                        placeholder="Confirm email*"
                        value={confirmEmail}
                        onChange={handleChange}
                        tabIndex={4}
                        style={{ color: "#666", caretColor: "black" }}
                    />
                    <p
                        style={{
                            color: hoveredError === "confirmEmail" ? "blue" : "red",
                            fontSize: "12px",
                            margin: "0",
                            minHeight: "16px",
                            visibility: showErrors && errors.confirmEmail ? "visible" : "hidden"
                        }}
                        onMouseEnter={() => setHoveredError("confirmEmail")}
                        onMouseLeave={() => setHoveredError(null)}
                    >
                        {showErrors && errors.confirmEmail ? errors.confirmEmail : ""}
                    </p>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number* (e.g., (XXX)XXX-XXXX)"
                        value={phone}
                        onChange={handleChange}
                        tabIndex={5}
                        style={{ color: "#666", caretColor: "black" }}
                    />
                    <p
                        style={{
                            color: hoveredError === "phone" ? "blue" : "red",
                            fontSize: "12px",
                            margin: "0",
                            minHeight: "16px",
                            visibility: showErrors && errors.phone ? "visible" : "hidden"
                        }}
                        onMouseEnter={() => setHoveredError("phone")}
                        onMouseLeave={() => setHoveredError(null)}
                    >
                        {showErrors && errors.phone ? errors.phone : ""}
                    </p>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password*"
                            value={password}
                            onChange={handleChange}
                            tabIndex={6}
                            style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", color: "#666", caretColor: "black" }}
                        />
                        {mounted && (
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    color: "#666"
                                }}
                            />
                        )}
                    </div>
                    <small className="password-hint">
                        Password must be at least 8 characters and contain at least one number and one special character.
                    </small>
                    <p
                        style={{
                            color: hoveredError === "password" ? "blue" : "red",
                            fontSize: "12px",
                            margin: "0",
                            minHeight: "16px",
                            visibility: showErrors && errors.password ? "visible" : "hidden"
                        }}
                        onMouseEnter={() => setHoveredError("password")}
                        onMouseLeave={() => setHoveredError(null)}
                    >
                        {showErrors && errors.password ? errors.password : ""}
                    </p>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password*"
                            value={confirmPassword}
                            onChange={handleChange}
                            tabIndex={7}
                            style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box", color: "#666", caretColor: "black" }}
                        />
                        {mounted && (
                            <FontAwesomeIcon
                                icon={showConfirmPassword ? faEye : faEyeSlash}
                                onClick={toggleConfirmPasswordVisibility}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    color: "#666"
                                }}
                            />
                        )}
                    </div>
                    <p
                        style={{
                            color: hoveredError === "confirmPassword" ? "blue" : "red",
                            fontSize: "12px",
                            margin: "0",
                            minHeight: "16px",
                            visibility: showErrors && errors.confirmPassword ? "visible" : "hidden"
                        }}
                        onMouseEnter={() => setHoveredError("confirmPassword")}
                        onMouseLeave={() => setHoveredError(null)}
                    >
                        {showErrors && errors.confirmPassword ? errors.confirmPassword : ""}
                    </p>
                    <p className="disclaimer">
                        Photon does not store, transfer, or sell uploaded media files or user data to third parties. Media processed by Photon is used to create exclusive searchable pattern data unique to DejaVuAI®-specific solutions – users retain any and all rights to media that is uploaded.{" "}
                        <a href="#">Learn more about how your data is managed ›</a>
                    </p>
                    <p className="legal">
                        By clicking Agree & Continue, you agree to the Photon{" "}
                        <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                    </p>
                    <button
                        type="submit"
                        className="agree-btn"
                        disabled={!isFormValid}
                        style={{
                            backgroundColor: isFormValid ? "#A9D096" : "#cccccc",
                            color: isFormValid ? "white" : "#666",
                            cursor: isFormValid ? "pointer" : "not-allowed"
                        }}
                    >
                        Agree & Continue
                    </button>
                    <p className="support-link">
                        Questions? <a href="#">Contact support</a>
                    </p>
                </form>
            )}

            {step === 2 && (
                <VerifyEmail
                    email={email}
                    onVerify={handleVerifyEmail}
                    backendError={backendError}
                    setBackendError={setBackendError}
                    verificationCode={verificationCode}
                />
            )}
            {step === 3 && <AccountSetUp onContinue={handleAccountSetUp} />}
            {step === 4 && (
                <Plans onContinue={handlePlans} onBack={() => setStep(3)} />
            )}
            {step === 5 && <LastThing onContinue={handleLastThing} />}
        </div>
    );
}