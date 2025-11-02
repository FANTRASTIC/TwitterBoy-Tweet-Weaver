import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // NewsAPI common domains
      { protocol: 'https', hostname: 'media.wired.com' },
      { protocol: 'https', hostname: 'static01.nyt.com' },
      { protocol: 'https', hostname: 'i.guim.co.uk' },
      { protocol: 'https', hostname: 'cdn.cnn.com' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'assets.bwbx.io' },
      { protocol: 'https', hostname: 'images.wsj.net' },
      { protocol: 'https', hostname: 's.yimg.com' },
      { protocol: 'https', hostname: 'techcrunch.com' },
      { protocol: 'https', hostname: '*.google.com' },

    ],
  },
};

export default nextConfig;
