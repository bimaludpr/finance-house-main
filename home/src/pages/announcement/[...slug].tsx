import AuthGuard from "@/components/AuthGuard/AuthGuard";
import dynamic from "next/dynamic";
import React from "react";// host-local import

// Remote module from announcement
const RemoteRouter = dynamic(
  () =>
    import("announcement/RemoteRouter") as Promise<{
      default: React.ComponentType<{ path: string }>;
    }>,
  { ssr: false }
);

export default function RemoteWrapper({ slug }: { slug: string[] }) {
  const path = "/" + (slug?.join("/") || "");

  return (
    <AuthGuard>
      <RemoteRouter path={path} />
    </AuthGuard>
  );
}

export async function getServerSideProps(context: any) {
  const slug = context.params.slug ?? [];
  return {
    props: { slug },
  };
}
