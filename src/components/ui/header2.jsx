import { Box, Heading } from "@chakra-ui/react";
import Link from 'next/link';

export default function Header2() {
    return (
        <Box as="header" className="headerFooter1-gradient">
            <Heading as="h1" size="lg">
                I am header 2
            </Heading>
        </Box>
    );
}