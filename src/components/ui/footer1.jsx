

import "../../app/globals.css";
import React from "react";

const Footer1 = () => {

  return (
    <footer className="footer" >
      <div>
        <a href="#" style={{ margin: '0 1rem', color: '#808080', textDecoration: 'none' }}>About the Application</a>
        <a href="#" style={{ margin: '0 1rem', color: '#808080', textDecoration: 'none' }}>About DejaVuAI®</a>
        <a href="#" style={{ margin: '0 1rem', color: '#808080', textDecoration: 'none' }}>Terms of Use</a>
        <a href="#" style={{ margin: '0 1rem', color: '#808080', textDecoration: 'none' }}>Privacy & User Data</a>
        <a href="#" style={{ margin: '0 1rem', color: '#808080', textDecoration: 'none' }}>Contact</a>
      </div>
      <p style={{ marginTop: '0.5rem', color: '#808080' }}>© {new Date().getFullYear()} DejaVuAI® Inc. All rights reserved.</p>
    </footer>
  );
};

export default Footer1;
