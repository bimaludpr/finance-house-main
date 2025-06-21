declare module "announcement/RemoteRouter" {
  const Component: React.ComponentType<{ path: string }>;
  export default Component;
}

declare module "home/AuthGuard" {
  const Component: React.ComponentType<{ children: React.ReactNode }>;
  export default Component;
}