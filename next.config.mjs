import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['picsum.photos'],
    },
    async redirects() {
        return [
            {source: '/stickers/1', destination: '/stickers', permanent: true},
            {source: '/stickers/0', destination: '/stickers', permanent: true},
            {source: '/:locale/stickers/1', destination: '/:locale/stickers', permanent: true},
            {source: '/:locale/stickers/0', destination: '/:locale/stickers', permanent: true},
        ];
    }
};

export default withNextIntl(nextConfig);
