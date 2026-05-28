"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./home/_components/header/header";
import styles from "../pages-layout.module.css";
import BottomNav from "./_components/bottom-nav/bottom-nav";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isKitchenFlow = pathname.startsWith("/kitchen");
  const topPadding = isKitchenFlow ? "0.75rem" : "7rem";
  const contentStyle = { "--page-top-padding": topPadding } as CSSProperties;

  return (
    <div className={styles.layout}>
      {!isKitchenFlow ? (
        <header>
          <Header level={1} progress={20} />
        </header>
      ) : null}

      <main className={styles.content} style={contentStyle}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
