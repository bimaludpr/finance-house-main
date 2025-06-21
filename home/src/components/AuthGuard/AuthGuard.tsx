"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setHydrated(true); // triggers on client mount
  }, []);

  useEffect(() => {
    if (!hydrated || !router.isReady) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [hydrated, router.isReady]);

  if (!hydrated || checking) return null;

  return <>{children}</>;
};

export default AuthGuard;
