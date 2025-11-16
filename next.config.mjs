// next.config.js (or next.config.mjs if using ES modules)
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pfavuctdfggeipsagvny.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Legacy fallback for domains (helps with resolution in Turbopack/Next.js 16)
    domains: ['pfavuctdfggeipsagvny.supabase.co'],
  },
};

export default nextConfig;