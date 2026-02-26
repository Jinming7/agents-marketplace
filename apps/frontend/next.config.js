/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable type checking during build to speed up and reduce memory
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|bmp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
