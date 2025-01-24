/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      optimizePackageImports: ['@chakra-ui/react'], // Optimize Chakra UI imports
    },
  };
  
  export default nextConfig;