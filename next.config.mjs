import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  images: {
    remotePatterns:[
      {
        protocol:'https',
        hostname:'images.unsplash.com'
      },
       {
        protocol:'http',
        hostname:'localhost'
      },
       {
        protocol:'https',
        hostname:'www.gluns.org'
      }
    ]
  }
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
