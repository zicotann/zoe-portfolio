function hostnameFrom(value) {
  if (!value) return null;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).hostname;
  } catch {
    return null;
  }
}

const r2Host = hostnameFrom(process.env.R2_PUBLIC_HOSTNAME);
const r2PublicUrlHost = hostnameFrom(process.env.R2_PUBLIC_URL);
const r2Hosts = [...new Set([r2Host, r2PublicUrlHost].filter(Boolean))];

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
      ...r2Hosts.map((hostname) => ({
        protocol: "https",
        hostname,
      })),
    ],
  },
};

export default nextConfig;
