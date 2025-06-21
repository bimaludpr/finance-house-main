declare module "@module-federation/nextjs-mf/utils" {
  export const revalidate: () => Promise<boolean>;
  export const flushChunks: () => Promise<any>;
  export const FlushedChunks: (props: { chunks: any }) => JSX.Element;
}
