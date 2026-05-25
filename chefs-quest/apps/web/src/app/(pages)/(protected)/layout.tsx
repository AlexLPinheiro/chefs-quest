import Header from "./home/_components/header/header";
import styles from "../pages-layout.module.css";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <header>
        <Header level={1} progress={20}></Header>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  );
}