const NextFederationPlugin = require("@module-federation/nextjs-mf");
// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = (isServer) => {
  const location = isServer ? "ssr" : "chunks";
  if (isServer) {
    // Server-side: use internal Kubernetes service URL
    return {
      home: `home@${process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:6003'}/_next/static/${location}/remoteEntry.js`,
    };
  } else {
    // Client-side: use external URL through nginx proxy
    return {
      home: `home@http://localhost/_next/static/${location}/remoteEntry.js`,
    };
  }
};

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "footer",
        filename: "static/chunks/remoteEntry.js",
        dts: false,
        exposes: {
          "./RemoteRouter": "./src/pages/footer/footer-router.tsx",
        },
        remotes: remotes(options.isServer),
        shared: {},
        extraOptions: {
          exposePages: true,
        },
      })
    );

    return config;
  },
};
