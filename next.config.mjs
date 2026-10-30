/** @type {import('next').NextConfig} */
const nextConfig = {
  // Os testes e2e buildam em outra pasta para não disputar `.next` com o `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
