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




// import React from "react";
// import Link from "next/link";
// import Image from "next/image";


// export default function Header() {
//     return (
//         <div>
//             <div style={{ backgroundColor: "lightblue" }}>
//                 <p>I'm an awesome Header</p>
//             </div>
//             {/* <div className="absolute -z-10 inset -0">
//             <Image
//             alt="description"
//             src={headerImage}
//             fill
//             style={{objectFit: "cover"}}
//             />
//         </div>
//         <Link href="/">Landing</Link> */}
//         </div>
//     );
// }

// import { Box, Heading } from "@chakra-ui/react";

// export default function Header() {
//     return (
//         <Box
//             as="header"
//             sx={{
//                 background: "linear-gradient(to right, #000000, #ffffff)", // Gradient here
//                 color: "white",
//                 padding: "16px",
//                 textAlign: "center",
//                 boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Optional box shadow
//             }}
//         >
//             <Heading as="h1" size="lg">
//                 Welcome to My Website
//             </Heading>
//         </Box>
//     );
// }