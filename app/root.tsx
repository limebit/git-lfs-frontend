import * as React from "react";
import { Links, LinksFunction, LiveReload, Meta, Outlet } from "remix";
import type { MetaFunction } from "remix";

import globalStyles from "./styles/app.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: globalStyles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
});

const Document = ({
  children,
  title = `New Remix App`,
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <html className="h-full bg-white" lang="en">
    <head>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <Meta />
      <Links />
    </head>
    <body className="h-full">
      {children}
      {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
    </body>
  </html>
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
