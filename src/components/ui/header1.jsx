import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"

import DvaiIcon from "../../../public/images/logos/DVAI-Unregistered-Logo-Horizontal-Light.png";
import "./header1.css";

export default function Header1() {
    return (
        <Box as="header" className="headerFooter1-gradient">
            <div className="headerLeft">
                <Link href="/">
                    <Image src={DvaiIcon} alt="Logo" />
                </Link>
            </div>
            <div className="headerRight">
                <Link href="../../accounts/login">
                    <Button size="md" variant="outline">Log in</Button>
                </Link>
                <Link href="../../accounts/register-new-account">
                    <Button size="md" variant="solid">Get Started</Button>
                </Link>
            </div>
        </Box>
    );
}