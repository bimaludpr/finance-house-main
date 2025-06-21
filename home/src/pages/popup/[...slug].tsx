import dynamic from "next/dynamic";

const RemoteRouter = dynamic(
  () =>
    import("popup/RemoteRouter") as Promise<{
      default: React.ComponentType<{ path: string }>;
    }>,
  { ssr: false }
);

export default function RemoteWrapper({ slug }: { slug: string[] }) {
  const path = "/" + (slug?.join("/") || "");

  return <RemoteRouter path={path} />;
}

// SSR: extract slug param
export async function getServerSideProps(context: any) {
  const slug = context.params.slug ?? [];
  return {
    props: {
      slug,
    },
  };
}
