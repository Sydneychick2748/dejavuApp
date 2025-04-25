
import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import PhotonLogo from "../../../../public/images/logos/photon-logo-white-only3.png";
import Search from "../../../../public/images/logos/search.png";
import History from "../../../../public/images/logos/history.png";
import Bookmarks from "../../../../public/images/logos/bookmarks.png";
import ObjectLibrary from "../../../../public/images/logos/object-library.png";
import UpCaret from "../../../../public/images/logos/upCareticon.png";
import DownCaret from "../../../../public/images/logos/downCareticon.png";

import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container3 mx-auto px-4 h-full">
          <div className="header-layout flex justify-between items-center h-full">
            <div className="logo-and-caret">
              <Link href="/" className="logo-div">
                <Image src={PhotonLogo} alt="Logo" />
              </Link>
              {!isOpen && (
                <Image src={DownCaret} alt="Down Caret" onClick={toggleDropdown}/>
              )}
              {isOpen && (
                <Image src={UpCaret} alt="Up Caret" onClick={toggleDropdown}/>
              )}
            </div>
            <div>
              {isOpen && (
                <div className="dropdown-content">
                  <a className="dropdown-item" href="/about-photon">About Photon</a>
                  <a className="dropdown-item" href="/about-dejavuai">About DejaVuAI&#174;</a>
                  <hr></hr>
                  <a className="dropdown-item" href="/accounts/create-account">Account</a>
                  <a className="dropdown-item" href="/accounts/create-account">Preferences</a>
                  <a className="dropdown-item" href="#">Plugins</a>
                  <a className="dropdown-item" href="#">Connect to ES network</a>
                  <hr></hr>
                  <a className="dropdown-item" href="#">Help</a>
                  <a className="dropdown-item" href="/photon-user-manual">Photon User Manual</a>
                  <a className="dropdown-item" href="/contact-support">Contact support</a>
                  <hr></hr>
                  <a className="dropdown-item" href="#">Sign out</a>
                </div>
              )}
            </div>
            <div className="menu-layout">
              <div>
                <Link href="/dashboard" className="menu-item">
                  <Image src={Search} alt="Search" />
                  <span className="nav-text">Search</span>
                </Link>
              </div>
              <div>
                <Link href="/help" className="menu-item">
                  <Image src={History} alt="History" />
                  <span className="nav-text">History</span>
                </Link>
              </div>
              <div>
                <Link href="/contact" className="menu-item">
                  <Image src={Bookmarks} alt="Bookmarks" />
                  <span className="nav-text">Bookmarks</span>
                </Link>
              </div>
              <div>
                <Link href="/accounts/profile" className="menu-item">
                  <Image src={ObjectLibrary} alt="Object Library" />
                  <span className="nav-text">Object Library</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;







