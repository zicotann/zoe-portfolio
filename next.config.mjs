const r2Host = process.env.R2_PUBLIC_HOSTNAME?.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      ...(r2Host
        ? [
            {
              protocol: "https",
              hostname: r2Host,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
