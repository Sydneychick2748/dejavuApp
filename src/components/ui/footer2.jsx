import React from "react";


const styles = {
    body: {
        margin: 0
    },
    footer: {
        position: "absolute",
        width: "100vw",
        height: "10vh",
        bottom: "0",
        overflow: "hidden"
    }
}


export default function Footer2() {
    return (
        <div className="footer">
            <footer>
                <svg viewBox="0 -20 700 110" width="100%" height="110" preserveAspectRatio="none">
                    <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#4A85F7" />
                    <path d="M0,10 c80,-18 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#2657C9" />
                </svg>
            </footer>
        </div>

    );
}