import dynamic from "next/dynamic";

// Dynamically import the federated RemoteRouter without SSR
const RemoteRouter = dynamic(
  () =>
    import("footer/RemoteRouter") as Promise<{
      default: React.ComponentType<{ path: string }>;
    }>,
  { ssr: false, loading: () => <p>Loading remote footer...</p> }
);

export default function FooterSlugPage({ slug }: { slug: string[] }) {
  const path = "/" + (slug?.join("/") || "");

  return <RemoteRouter path={path} />;
}

// SSR handler to extract dynamic slug
export async function getServerSideProps(context: any) {
  const slugParam = context.params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam : slugParam ? [slugParam] : [];

  return {
    props: {
      slug,
    },
  };
}
