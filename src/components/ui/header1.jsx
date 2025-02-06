import { Box, Heading } from "@chakra-ui/react";

export default function Header() {
    return (
        <Box as="header" className="headerFooter1-gradient">
            <Heading as="h1" size="lg">
                Welcome to My Website
            </Heading>
        </Box>
    );
}