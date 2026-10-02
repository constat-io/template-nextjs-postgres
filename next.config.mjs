// Trying this app in GitHub Codespaces: the browser is at *.app.github.dev while the app believes
// it is localhost:3000, and Next refuses a form from an address it does not know. Keep these when
// this file grows.
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ['*.app.github.dev', 'localhost:3000'] } },
};

export default nextConfig;
