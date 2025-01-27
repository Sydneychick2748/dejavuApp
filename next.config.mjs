/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      optimizePackageImports: ['@chakra-ui/react'], // Optimize Chakra UI imports
    },
    async headers() {
      return [
        {
          source: '/landing',
          headers: [
            {
              key: 'landing-custom-header',
              value: 'landing header',
            },
            {
              key: 'non-landing-custom-header',
              value: 'non-landing header',
            },
          ],
        },
      ]
    },
  };
  
  export default nextConfig;