import React, { useState, useRef, useEffect } from "react";
import "./navbar.css"; // you can style dropdown here

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={menuRef}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Photon ⌄
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="#">About Photon</a>
          <a href="#">About DejaVuAI</a>
          <a href="#">Photon User Manual</a>
          <a href="#">Contact Support</a>
          <hr />
          <a href="#">Account</a>
          <a href="#">Plugins</a>
          <a href="#">Preferences</a>
          <a href="#">Connect to ES network</a>
          <hr />
          <a href="#">Sign Out</a>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
