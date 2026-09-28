import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions reject a body over 1MB by default, which is smaller
      // than an ordinary phone photo. The hosted dashboard uploads straight
      // to Blob and bypasses this, but local development still posts the file
      // through an action, so give that path room.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
