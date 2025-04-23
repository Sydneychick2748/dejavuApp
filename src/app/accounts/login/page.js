"use client";

import React from "react";
import { usePathname } from "next/navigation"; // ⬅️ import this
import "./login.css";

export default function LoginBox() {
  const pathname = usePathname();

  // Show background ONLY if this is the actual /login page
  const isLoginPage = pathname === '/accounts/login';

  return (
    <div className={isLoginPage ? "login-page" : ""}>
      <div className="login-box">
        <h2>Log in</h2>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button className="login-btn">Log in</button>
        <button className="create-btn">Create new account</button>
        <a href="#" className="forgot-link">Forgot password?</a>
      </div>
    </div>
  );
}
