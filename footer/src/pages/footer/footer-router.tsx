import dynamic from "next/dynamic";
import React from "react";

// Dynamically import Footer with SSR disabled
const Footer = dynamic(() => import("./index"), { ssr: false });

// Define exact path-component mapping
const routeMap: Record<string, React.ComponentType<any>> = {
  "/update": Footer,
};

type RemoteRouterProps = {
  path: string; // Must match exactly, e.g., "/update"
};

export default function RemoteRouter({ path }: RemoteRouterProps) {
  const PageComponent = routeMap[path]; // exact match
  if (!PageComponent) {
    return <h2>404 - Remote Page Not Found</h2>;
  }

  return <PageComponent />;
}
