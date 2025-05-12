"use client";

import "./home-page.css";
import { useRouter } from "next/navigation"; // Import useRouter
import LoginBox from "../app/accounts/login/page";

export default function Home() {
  const router = useRouter(); // Initialize router

  return (
    <div className="home-background">
      <div className="content-wrapper">
        <div className="left-section">
          <h1 className="home-title">
            Next-gen <br />
            <span className="highlight">pattern recognition</span>
            <br />
            <strong>right at your fingertips.</strong>
          </h1>
          <p className="home-description">
          DejaVuAI’s personal image-search application utilizes a specialized AI pattern-matching technology, unlike anything else on the market.
          </p>
          <a href="#" className="learn-link">
            About The Application ›
          </a>

          <div className="powered-box">
            {/* <span className="poweredBy">Powered by</span> */}
            {/* <img src="/images/logos/DVAILogoHorizontalDark.png" alt="DejaVuAI Logo" className="logo" /> */}
            <div className="powered-buttons">
              <button className="about-btn">Learn More About DejaVuAI®</button>
              <button className="visit-btn">Visit website ›</button>
            </div>
          </div>
        </div>

        <div className="right-section">
          <LoginBox />
        </div>
      </div>
    </div>
  );
}
