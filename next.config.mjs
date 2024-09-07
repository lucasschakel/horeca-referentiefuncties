/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    serverRuntimeConfig: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_ASSISTANT_ID: process.env.OPENAI_ASSISTANT_ID,
  },
};

export default nextConfig;
