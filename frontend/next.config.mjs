/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "prod.spline.design" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
}

export default nextConfig
