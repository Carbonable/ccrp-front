/** @type {import('next').NextConfig} */
const nextConfig = {};
const requiredEnvVars = [
  'API_URL',
  'DMRV_API',
  'NEXT_PUBLIC_GRAPHQL_API_URL',
  'NEXT_PUBLIC_MAPBOX_KEY',
  'NEXT_PUBLIC_SANITY_API_VERSION',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
];

export default nextConfig;
