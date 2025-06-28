"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";

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
      // Check if we're in a proxied context (home-nxt-service)
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/home-nxt-service')) {
        router.replace("/home-nxt-service/login");
      } else {
        router.replace("/login");
      }
    } else {
      setChecking(false);
    }
  }, [hydrated, router.isReady]);

  if (!hydrated || checking) return null;

  return <>{children}</>;
};

export default AuthGuard;
