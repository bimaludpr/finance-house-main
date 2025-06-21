module.exports = {
    apps: [
      {
        name: "nextjs-ssr",
        script: "node_modules/.bin/next",
        args: "start",
        instances: "max", // Or a specific number based on your server capacity
        exec_mode: "cluster",
        env: {
          PORT: 6003,
          NODE_ENV: "production"
        }
      }
    ]
  }