import React from "react";
import Link from "next/link";
import Image from 'next/image';
import Logo from "../../../../public/images/logos/dvai-icon.png";
import ProfilePic from "../../../../public/images/logos/profile.png";

import "./navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="header-layout flex justify-between items-center h-full">
            <div>
              <Link href="/">
                  <div className="logo-div">
                    <Image src={Logo} alt="Logo" width={50} height={30} />
                  </div>
              </Link>
            </div>
            <div className="menu-layout">
                <div>
                  <Link href="/dashboard">
                    <p>DATABASE</p>
                  </Link>
                </div>
                <div>
                  <Link href="/help">
                    <p>HELP/TRAINING</p>
                  </Link>
                </div>
                <div>
                  <Link href="/contact">
                    <p>CONTACT</p>
                  </Link>
                </div>
            </div>
            <div className="profile-layout">
              <Link href="/accounts/profile">
                  <Image src={ProfilePic} alt="Profile outline image" width={40} height={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;