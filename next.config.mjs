/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": [
      "./index.html",
      "./portfolio.html",
      "./robots.txt",
      "./sitemap.xml",
      "./renewal/**/*",
      "./image_overclo/**/*"
    ]
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/portfolio.html", destination: "/portfolio", permanent: true },
      { source: "/renewal", destination: "/", permanent: true },
      { source: "/renewal/index.html", destination: "/", permanent: true },
      { source: "/renewal/portfolio", destination: "/portfolio", permanent: true },
      { source: "/renewal/portfolio.html", destination: "/portfolio", permanent: true },
      { source: "/work.html", destination: "/portfolio", permanent: true },
      { source: "/work", destination: "/portfolio", permanent: true },
      { source: "/renewal/work.html", destination: "/portfolio", permanent: true },
      { source: "/about.html", destination: "/#why", permanent: true },
      { source: "/about", destination: "/#why", permanent: true },
      { source: "/contact.html", destination: "/#contact", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true }
    ];
  },
  async headers() {
    const sharedSecurityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ];

    return [
      {
        source: "/:path*",
        headers: sharedSecurityHeaders
      },
      {
        source: "/admin/:path*",
        headers: [
          ...sharedSecurityHeaders,
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "X-Frame-Options", value: "DENY" }
        ]
      }
    ];
  }
};

export default nextConfig;
