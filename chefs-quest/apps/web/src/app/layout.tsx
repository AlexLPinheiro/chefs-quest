import type { Metadata } from "next";
import styles from "./app-shell.module.css";

export const metadata: Metadata = {
  title: "Chef's Quest",
  description: "Chef's Quest web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={styles.html}>
      <body className={styles.body}>{children}</body>
    </html>
  );
}