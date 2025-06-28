const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Add publicRuntimeConfig for dynamic URLs
  publicRuntimeConfig: {
    NEXT_PUBLIC_HOST_URL: process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:6003',
  },
  webpack: (config, options) => {
    const { isServer } = options;
    
    // Set publicPath explicitly
    config.output.publicPath = process.env.NEXT_PUBLIC_HOST_URL 
      ? `${process.env.NEXT_PUBLIC_HOST_URL}/_next/` 
      : 'auto';
    
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };

    // Define external URLs for Module Federation
    const getExternalUrl = (serviceName, defaultPort) => {
      if (isServer) {
        // Server-side: use internal Kubernetes service URLs
        return process.env[`${serviceName.toUpperCase()}_URL`] || `http://localhost:${defaultPort}`;
      } else {
        // Client-side: use external URLs through nginx proxy
        return `http://localhost/${serviceName}-nxt-service`;
      }
    };

    config.plugins.push(
      new NextFederationPlugin({
        name: "home",
        remotes: {
          announcement: `announcement@${getExternalUrl('ANNOUNCEMENT', '6004')}/_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
          popup: `popup@${getExternalUrl('POPUP', '6005')}/_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
          testimonial: `testimonial@${getExternalUrl('TESTIMONIAL', '6006')}/_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
          footer: `footer@${getExternalUrl('FOOTER', '6007')}/_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
        },
        exposes: {
          "./nav": "./src/components/Nav/Nav.tsx",
          "./home": "./src/pages/index.tsx",
          "./pages-map": "./pages-map.js",
          "./Button": "./src/commonComponents/Button/Button.tsx",
          "./filterBox": "./src/commonComponents/FilterBox/FilterBox.tsx",
          "./TextInput": "./src/commonComponents/TextInput/TextInput.tsx",
          "./DatePicker": "./src/commonComponents/DatePicker/DatePicker.tsx",
          "./Actions": "./src/commonComponents/Actions/Actions.tsx",
          "./CommonModal": "./src/commonComponents/Modal/Modal.tsx",
          "./RadioButton": "./src/commonComponents/RadioButton/RadioButton.tsx",
          "./FileUpload": "./src/commonComponents/FileUpload/FileUpload.tsx",
          "./TextArea": "./src/commonComponents/TextArea/TextArea.tsx",
          "./Table": "./src/commonComponents/Table/Table.tsx",
          "./TextEditor": "./src/commonComponents/TextEditor/TextEditor.tsx",
          "./Select": "./src/commonComponents/Select/Select.tsx",
          "./Checkbox": "./src/commonComponents/Checkbox/Checkbox.tsx",
          "./EntriesCounter":
            "./src/commonComponents/EntriesCounter/EntriesCounter.tsx",
          "./SearchInput": "./src/commonComponents/SearchInput/SearchInput.tsx",
          "./FilterLayout":
            "./src/commonComponents/FilterLayout/FilterLayout.tsx",
          "./EditIcon": "./src/components/ExportingIcons/EditIcon.tsx",
          "./DeleteIcon": "./src/components/ExportingIcons/DeleteIcon.tsx",
          "./EntriesCounter":
            "./src/commonComponents/EntriesCounter/EntriesCounter.tsx",
          "./TitleBar": "./src/commonComponents/TitleBar/TitleBar.tsx",
          "./PageHeader": "./src/commonComponents/PageHeader/PageHeader.tsx",
          "./Title": "./src/commonComponents/Title/Title.tsx",
          "./Breadcrumb": "./src/commonComponents/Breadcrumb/Breadcrumb.tsx",
          "./AuthGuard": "./src/components/AuthGuard/AuthGuard.tsx",
        },
        filename: "static/chunks/remoteEntry.js",
        // Add publicPath configuration
        publicPath: process.env.NEXT_PUBLIC_HOST_URL 
          ? `${process.env.NEXT_PUBLIC_HOST_URL}/_next/static/chunks/` 
          : 'auto',
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: false,
          },
        },
      })
    );
    return config;
  },
  output: "standalone",
  experimental: {},
};

module.exports = nextConfig;