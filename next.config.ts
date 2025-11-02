
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
      { protocol: 'https', hostname: 'picsum.photos' },
      // Whitelisting is no longer the primary strategy, 
      // but keeping these here doesn't hurt.
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
      { protocol: 'https', hostname: 'cdn.theverge.net' },
      { protocol: 'https', hostname: 'platform.theverge.com' },
      { protocol: 'https', hostname: 'img.etimg.com' },
      { protocol: 'https', hostname: 'gizmodo.com' },
      { protocol: 'https', hostname: 'media.zenfs.com' },
      { protocol: 'https', hostname: 'hackaday.com' },
    ],
  },
};

export default nextConfig;
