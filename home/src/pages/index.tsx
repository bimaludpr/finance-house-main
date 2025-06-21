"use client";

import React from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import styles from "./index.module.css";

const AuthGuard = dynamic(() => import("../components/AuthGuard/AuthGuard"), { ssr: false });

const Home: NextPage = () => {
  return (
    <AuthGuard>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to Home Page</h1>
      </div>
    </AuthGuard>
  );
};

export default Home;
