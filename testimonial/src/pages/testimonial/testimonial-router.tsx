import dynamic from "next/dynamic";
import React from "react";

// Static page imports (disable SSR because they're being manually routed)
const TestimonialAddPage = dynamic(() => import("./add"), { ssr: false });
const TestimonialListPage = dynamic(() => import("./index"), { ssr: false });
const TestimonialEditPage = dynamic(() => import("./edit"), { ssr: false });

const routeMap: Record<string, React.ComponentType<any>> = {
  "/add": TestimonialAddPage,
  "/list": TestimonialListPage,
};

type RemoteRouterProps = {
  path: string; // e.g. "/edit/123"
};

export default function RemoteRouter({ path }: RemoteRouterProps) {
  // Handle dynamic edit route
  const editMatch = path.match(/^\/edit\/(.+)$/);

  if (editMatch) {
    const id = editMatch[1];
    return <TestimonialEditPage id={id} />;
  }

  const PageComponent = routeMap[path];
  if (!PageComponent) {
    return <h2>404 - Remote Page Not Found</h2>;
  }

  return <PageComponent />;
}
