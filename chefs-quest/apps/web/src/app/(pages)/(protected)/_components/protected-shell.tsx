"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "../../pages-layout.module.css";
import BottomNav from "./bottom-nav/bottom-nav";

export default function ProtectedShell({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) {
  const pathname = usePathname();
  // Esconde header e ajusta padding quando está no fluxo da cozinha
  const isKitchenFlow = pathname.startsWith("/kitchen");
  const topPadding = isKitchenFlow ? "0.75rem" : "7rem";
  const contentStyle = { "--page-top-padding": topPadding } as CSSProperties;

  return (
    <div className={styles.layout}>
      {!isKitchenFlow ? <header aria-label="Cabeçalho do jogo">{header}</header> : null}

      <main className={styles.content} style={contentStyle}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
