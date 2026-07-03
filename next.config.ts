import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // lib/emails/*.pug is read from disk at runtime (pug.compileFile), not
  // imported, so Next's build tracer won't find it on its own — without
  // this, the standalone Docker build silently drops the templates.
  outputFileTracingIncludes: {
    "/*": ["lib/emails/**/*.pug"],
  },
};

export default nextConfig;
