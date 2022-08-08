/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
 module.exports = {
  serverBuildTarget: "vercel",
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: [".*"],
 };