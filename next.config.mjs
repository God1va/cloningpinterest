/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1', 'example.com', 'another-domain.com'], // Tambahkan domain lain di sini
  },
};

export default nextConfig;
