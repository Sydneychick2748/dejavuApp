import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import "./registerNewAccount.css"; 

const VerifyEmail = () => {
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleCodeChange = (e) => setVerificationCode(e.target.value);
    const handleSendCode = () => console.log(`Sending verification code to ${email}`);
    const handleVerifyCode = () => {
        if (verificationCode === '123456') setIsVerified(true);
        else console.log('Invalid verification code');
    };

    return (
        <div className="verify-container">
            <div className="verify-box">
                <h1>Verify Email</h1>
                {!isVerified ? (
                    <>
                        <p>Please enter the code that was sent to your email to verify your account.</p>
                        <input
                            type="text"
                            placeholder="Verification code"
                            value={verificationCode}
                            onChange={handleCodeChange}
                        />
                        <button onClick={handleVerifyCode}>Continue</button>
                        <div className="support-link">
                            Questions? <a href="#">Contact support</a>
                        </div>
                    </>
                ) : (
                    <p>Email verified successfully!</p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
