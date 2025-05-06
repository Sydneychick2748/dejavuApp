'use client';

import React, { useState } from 'react';
import Account from "./account-and-settings";
import Plan from "./plan";
import Business from "./business";
import './account-plan-business.css'; // Assuming you have a CSS file for styles

export default function AccountPlanBusiness() {
    const [activeTab, setActiveTab] = useState("Account");
    return (
        <div>
            <div className="settings">
                  <div className="container">
                    {/* Top tabs */}
                    <div className="tabs">
                      <ul>
                        <li
                          className={activeTab === "Account" ? "active" : "inactive"}
                          onClick={() => setActiveTab("Account")}
                        >
                          Account and Settings
                        </li>
                        <li
                          className={activeTab === "Plan" ? "active" : "inactive"}
                          onClick={() => setActiveTab("Plan")}
                        >
                          Plan
                        </li>
                        <li
                          className={activeTab === "Business" ? "active" : "inactive"}
                          onClick={() => setActiveTab("Business")}
                        >
                          Business
                        </li>
                      </ul>
                    </div>
                    {/* Content Box */}
                    <div className="content2">
                      <div className="panel-container">
                        <div className={`panel ${activeTab === "Account" ? "active" : "inactive"}`}>
                          <Account />
                        </div>
                        <div className={`panel ${activeTab === "Plan" ? "active" : "inactive"}`}>
                          <Plan />
                        </div>
                        <div className={`panel ${activeTab === "Business" ? "active" : "inactive"}`}>
                          <Business />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
    );
};