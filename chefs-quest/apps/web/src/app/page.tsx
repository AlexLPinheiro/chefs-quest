import Image from "next/image";
import Link from "next/link";
import avatar from "@/app/assets/image/avatar-complete.png";
import logo from "@/app/assets/image/logo.png";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.panel}>
          <h1 id="home-title" className={styles.title}>
            Chef&apos;s Quest
          </h1>

          <Image
            src={avatar}
            alt="Chef segurando uma colher"
            priority
            className={styles.avatar}
          />

          <Image
            src={logo}
            alt="Chef's Quest"
            priority
            className={styles.logo}
          />

          <Link href="/sign-in" className={styles.primaryAction}>
            Entrar
          </Link>

          <p className={styles.footerText}>Todos os direitos reservados</p>
        </div>
      </section>
    </main>
  );
}
