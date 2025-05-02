
// import React, {useState} from "react";
// import Link from "next/link";
// import Image from "next/image";
// import PhotonLogo from "../../../../public/images/logos/photon-logo-white-only3.png";
// import Search from "../../../../public/images/logos/search.png";
// import History from "../../../../public/images/logos/history.png";
// import Bookmarks from "../../../../public/images/logos/bookmarks.png";
// import ObjectLibrary from "../../../../public/images/logos/object-library.png";
// import UpCaret from "../../../../public/images/logos/upCareticon.png";
// import DownCaret from "../../../../public/images/logos/downCareticon.png";

// import "./navbar.css";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       <div className="w-full h-20 bg-emerald-800 sticky top-0">
//         <div className="container3 mx-auto px-4 h-full">
//           <div className="header-layout flex justify-between items-center h-full">
//             <div className="logo-and-caret">
//               <Link href="/" className="logo-div">
//                 <Image src={PhotonLogo} alt="Logo" />
//               </Link>
//               {!isOpen && (
//                 <Image src={DownCaret} alt="Down Caret" onClick={toggleDropdown}/>
//               )}
//               {isOpen && (
//                 <Image src={UpCaret} alt="Up Caret" onClick={toggleDropdown}/>
//               )}
//             </div>
//             <div>
//               {isOpen && (
//                 <div className="dropdown-content">
//                   <a className="dropdown-item" href="/about-photon">About Photon</a>
//                   <a className="dropdown-item" href="/about-dejavuai">About DejaVuAI&#174;</a>
//                   <hr></hr>
//                   <a className="dropdown-item" href="/accounts/create-account">Account</a>
//                   <a className="dropdown-item" href="/accounts/create-account">Preferences</a>
//                   <a className="dropdown-item" href="#">Plugins</a>
//                   <a className="dropdown-item" href="#">Connect to ES network</a>
//                   <hr></hr>
//                   <a className="dropdown-item" href="#">Help</a>
//                   <a className="dropdown-item" href="/photon-user-manual">Photon User Manual</a>
//                   <a className="dropdown-item" href="/contact-support">Contact support</a>
//                   <hr></hr>
//                   <a className="dropdown-item" href="#">Sign out</a>
//                 </div>
//               )}
//             </div>
//             <div className="menu-layout">
//               <div>
//                 <Link href="/dashboard" className="menu-item">
//                   <Image src={Search} alt="Search" />
//                   <span className="nav-text">Search</span>
//                 </Link>
//               </div>
//               <div>
//                 <Link href="/help" className="menu-item">
//                   <Image src={History} alt="History" />
//                   <span className="nav-text">History</span>
//                 </Link>
//               </div>
//               <div>
//                 <Link href="/contact" className="menu-item">
//                   <Image src={Bookmarks} alt="Bookmarks" />
//                   <span className="nav-text">Bookmarks</span>
//                 </Link>
//               </div>
//               <div>
//                 <Link href="/accounts/profile" className="menu-item">
//                   <Image src={ObjectLibrary} alt="Object Library" />
//                   <span className="nav-text">Object Library</span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Navbar;


import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PreferencesModal from "../../../app/photon-dropdown/preferencesModal"; // Adjusted path
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
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handler to open the PreferencesModal and close the dropdown
  const handlePreferencesClick = () => {
    setShowPreferencesModal(true);
    setIsOpen(false);
  };

  // Placeholder handlers for other dropdown items
  const handleAboutPhotonClick = () => {
    setIsOpen(false);
    console.log("About Photon clicked - modal can be added here");
  };

  const handleAboutDejaVuAIClick = () => {
    setIsOpen(false);
    console.log("About DejaVuAI clicked - modal can be added here");
  };

  const handleUserManualClick = () => {
    setIsOpen(false);
    console.log("Photon User Manual clicked - modal can be added here");
  };

  const handleContactSupportClick = () => {
    setIsOpen(false);
    console.log("Contact Support clicked - modal can be added here");
  };

  const handleAccountClick = () => {
    setIsOpen(false);
    console.log("Account clicked - modal can be added here");
  };

  const handlePluginsClick = () => {
    setIsOpen(false);
    console.log("Plugins clicked - modal can be added here");
  };

  const handleConnectESNetworkClick = () => {
    setIsOpen(false);
    console.log("Connect to ES network clicked - modal can be added here");
  };

  const handleHelpClick = () => {
    setIsOpen(false);
    console.log("Help clicked - modal can be added here");
  };

  const handleSignOutClick = () => {
    setIsOpen(false);
    console.log("Sign Out clicked - modal can be added here");
  };

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e, handler) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
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
                <Image
                  src={DownCaret}
                  alt="Down Caret"
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                />
              )}
              {isOpen && (
                <Image
                  src={UpCaret}
                  alt="Up Caret"
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
            <div>
              {isOpen && (
                <div className="dropdown-content">
                  <button
                    className="dropdown-item"
                    onClick={handleAboutPhotonClick}
                    onKeyDown={(e) => handleKeyDown(e, handleAboutPhotonClick)}
                  >
                    About Photon
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleAboutDejaVuAIClick}
                    onKeyDown={(e) => handleKeyDown(e, handleAboutDejaVuAIClick)}
                  >
                    About DejaVuAI®
                  </button>
                  <hr />
                  <button
                    className="dropdown-item"
                    onClick={handleAccountClick}
                    onKeyDown={(e) => handleKeyDown(e, handleAccountClick)}
                  >
                    Account
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handlePreferencesClick}
                    onKeyDown={(e) => handleKeyDown(e, handlePreferencesClick)}
                  >
                    Preferences
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handlePluginsClick}
                    onKeyDown={(e) => handleKeyDown(e, handlePluginsClick)}
                  >
                    Plugins
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleConnectESNetworkClick}
                    onKeyDown={(e) => handleKeyDown(e, handleConnectESNetworkClick)}
                  >
                    Connect to ES network
                  </button>
                  <hr />
                  <button
                    className="dropdown-item"
                    onClick={handleHelpClick}
                    onKeyDown={(e) => handleKeyDown(e, handleHelpClick)}
                  >
                    Help
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleUserManualClick}
                    onKeyDown={(e) => handleKeyDown(e, handleUserManualClick)}
                  >
                    Photon User Manual
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handleContactSupportClick}
                    onKeyDown={(e) => handleKeyDown(e, handleContactSupportClick)}
                  >
                    Contact support
                  </button>
                  <hr />
                  <button
                    className="dropdown-item"
                    onClick={handleSignOutClick}
                    onKeyDown={(e) => handleKeyDown(e, handleSignOutClick)}
                  >
                    Sign out
                  </button>
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

      {showPreferencesModal && (
        <PreferencesModal onClose={() => setShowPreferencesModal(false)} />
      )}
    </>
  );
};

export default Navbar;



// THIS IS ORIGINAL HEADER FROM OUR FIGMA 

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import Logo from "../../../../public/images/logos/dvai-icon.png";
// import ProfilePic from "../../../../public/images/logos/profile.png";
// import "./navbar.css";
// const Navbar = () => {
//   return (
//     <>
//       <div className="w-full h-20 bg-emerald-800 sticky top-0">
//         <div className="container3 mx-auto px-4 h-full">
//           <div className="header-layout flex justify-between items-center h-full">
//             <div>
//               <Link href="/">
//                 <div className="logo-div">
//                   <Image src={Logo} alt="Logo" width={50} height={30} />
//                   <span className="nav-text">TRACE THE UNTRACEABLE</span>
//                 </div>
//               </Link>
//             </div>
//             <div className="menu-layout">
//               <div>
//                 <Link href="/dashboard">
//                   <p>DATABASE</p>
//                 </Link>
//               </div>
//               <div>
//                 <Link href="/help">
//                   <p>HELP/TRAINING</p>
//                 </Link>
//               </div>
//               <div>
//                 <Link href="/contact">
//                   <p>CONTACT</p>
//                 </Link>
//               </div>
//             </div>
//             <div className="profile-layout">
//               <Link href="/accounts/profile">
//                 <Image
//                   src={ProfilePic}
//                   alt="Profile outline image"
//                   width={40}
//                   height={24}
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Navbar;

