import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Static files in public/ are served with max-age=0 by default, so
        // every visit revalidated the hero videos. Files here are
        // immutable: give a changed file a new name rather than overwriting.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
