const nextTranslate = require("next-translate-plugin");

module.exports = nextTranslate({
  reactStrictMode: true,
  images: {
    domains: ["localhost", "127.0.0.1"],
  },
  experimental: {
    appDir: true,
  },
});
// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

// next.config.js;
// module.exports = {
//   reactStrictMode: true,
//   images: {
//     domains: ["localhost", "127.0.0.1"],
//   },
//   // i18n: {
//   //   defaultLocale: "en",
//   //   locales: ["en", "tr"],
//   // },
// };
