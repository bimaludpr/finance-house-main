declare module "announcement/RemoteRouter" {
  const RemoteRouter: React.ComponentType<{ path: string }>;
  export default RemoteRouter;
}
declare module "home/*" {
  const mod: React.ComponentType<any>;
  export default mod;
}
declare module "popup/RemoteRouter" {
  const RemoteRouter: React.ComponentType<{ path: string }>;
  export default RemoteRouter;
}
declare module "testimonial/RemoteRouter" {
  const RemoteRouter: React.ComponentType<{ path: string }>;
  export default RemoteRouter;
}
declare module "footer/RemoteRouter" {
  const RemoteRouter: React.ComponentType<{ path: string }>;
  export default RemoteRouter;
}

export interface EnrichedFile {
  name: string;
  url: string;
  type: string;
  isInvalid?: boolean;
  metaFile: File;
  size: number;
}

