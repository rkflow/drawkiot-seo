// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
const fs = require('fs');
module.exports = {
  env: {
    rawJsFromFile: fs.readFileSync('./rawJsFromFile.js').toString()
  },
  // async rewrites() {
  //   return [

  //     // {
  //     //   source: "/:slug",
  //     //   destination: "https://drawkit-v2.webflow.io/:slug",
  //     // },
  //     // {
  //     //   source: "/blog/:slug",
  //     //   destination: "https://drawkit-v2.webflow.io/blog/:slug",
  //     // },
  //   ];
  // },
  async redirects() {
    return [
      
      {
        source: "/illustration-types/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/illustration-categories/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/single-illustrations/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/illustration/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
      {
        source: "/search-kits",
        destination: "/product/icons",
        permanent: true,
      },
      {
        source: "/blueberry",
        destination: "/search-results",
        permanent: true,
      },
      {
        source: "/kits",
        destination: "/search-results",
        permanent: true,
      },
      {
        source: "/animation-packs",
        destination: "/search-results?search=animation-packs",
        permanent: true,
      },
      {
        source: "/packs",
        destination: "/search-results",
        permanent: true,
      },
      {
        source: "/grape-pack",
        destination: "/search-results",
        permanent: true,
      },
      
      {
        source: "/animation-pack-grape",
        destination: "/product/animations",
        permanent: true,
      },

      {
          source: "/showcase/hear-me-out",
          destination: "/blog",
          permanent: true,

      },
      {
          source: "/newsletter-signup-confirmation",
          destination: "/blog",
          permanent: true,

      },
      {
        source: "/new-password",
        destination: "/change-password",
        permanent: true,

    },

      {
          source: "/showcase/pencil-to-pixel",
          destination: "/blog",
          permanent: true,

      },

      {
        source: "/custom",
        destination: "https://designstripe.com/",
        permanent: true,
      },

      {
        source: "/free-icons",
        destination: "/product/icons",
        permanent: true,
      },

      {
        source: "/3d-builder",
        destination:
          "https://www.figma.com/community/plugin/1044419856113171023/Drawkit-3D-Builder",
        permanent: true,
      },

      {
        source: "/paid-requests",
        destination:
          "https://drawkit.nolt.io/",
        permanent: true,
      },

      {
        source: "/requests",
        destination: "https://drawkit.nolt.io/",
        permanent: true,
      },
      {
        source: "/peach-copy",
        destination: "/product/peach-illustration-system",
        permanent: true,
      },
      {
        source: "/peach",
        destination: "/product/peach-illustration-system",
        permanent: true,
      },
      {
        source: "/showcase",
        destination: "/blog",
        permanent: true,
      },

    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
