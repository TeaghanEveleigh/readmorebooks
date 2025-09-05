/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // coarse allowlist (optional when using remotePatterns, but harmless)
    domains: ["books.google.com", "books.googleusercontent.com"],
    remotePatterns: [
      // books.google.com (both content + publisher paths, both protocols)
      { protocol: "https", hostname: "books.google.com", pathname: "/books/**" },
      { protocol: "http",  hostname: "books.google.com", pathname: "/books/content/**" },
      { protocol: "https", hostname: "books.google.com", pathname: "/books/publisher/content/**" },
      { protocol: "http",  hostname: "books.google.com", pathname: "/books/publisher/content/**" },

      // common thumbnail host
      { protocol: "https", hostname: "books.googleusercontent.com", pathname: "/**" },
    ],
  },
};