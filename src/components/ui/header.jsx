import React from "react";
import Link from "next/link";
import Image from "next/image";
// import headerImage from "@public.headerImage.jpg";

export default function Header() {
    return (
        <div>
            <p>I'm an awesome Header</p>
            {/* <div className="absolute -z-10 inset -0">
            <Image
            alt="description"
            src={headerImage}
            fill
            style={{objectFit: "cover"}}
            />
        </div>
        <Link href="/">Landing</Link> */}
        </div>
    );
}