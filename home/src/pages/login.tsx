// pages/login.tsx
'use client';

import dynamic from "next/dynamic";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

// 👇 Define the layout-aware page type
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const LoginForm = dynamic(() => import("@/components/Login/Login"), {
  ssr: false,
});

const LoginPage: NextPageWithLayout = () => {
  return <LoginForm />;
};

// ✅ Avoid Sidebar layout on login
LoginPage.getLayout = (page) => page;

// ✅ Prevent static generation
export const getServerSideProps = async () => {
  return { props: {} };
};

export default LoginPage;
