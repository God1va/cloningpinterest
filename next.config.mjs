/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1'], // Tambahkan hostname lokal yang diizinkan
  },
};

export default nextConfig;
