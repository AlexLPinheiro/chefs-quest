import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/image/logo.png";
import macarrao from "@/app/assets/image/macarrao.png";
import lasanha from "@/app/assets/image/lasanha.png";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <section className={styles.hero}>
          <Image
            src={logo}
            alt="Chef's Quest"
            priority
            className={styles.logo}
          />

          <p className={styles.eyebrow}>Sua jornada comeca aqui</p>

          <h1 className={styles.title}>
            Cozinhe desafios.
            <span className={styles.titleAccent}>Desbloqueie missoes.</span>
          </h1>

          <p className={styles.description}>
            Toda visita ao Chef&apos;s Quest comeca nesta tela. Entre no jogo,
            prepare receitas e avance pelas fases com a sua conta do Senai.
          </p>

          <div className={styles.actions}>
            <Link href="/sign-in" className={styles.primaryAction}>
              Entrar para jogar
            </Link>
            <Link href="/home" className={styles.secondaryAction}>
              Ver fases
            </Link>
          </div>

          <ul className={styles.highlights}>
            <li className={styles.highlight}>Receitas em formato de missao</li>
            <li className={styles.highlight}>Progresso por fases</li>
            <li className={styles.highlight}>Acesso sempre pela tela inicial</li>
          </ul>
        </section>

        <section className={styles.visual} aria-label="Pratos em destaque">
          <article className={`${styles.card} ${styles.cardPrimary}`}>
            <Image
              src={macarrao}
              alt="Prato de macarrao"
              className={styles.dishImage}
            />
            <h2 className={styles.cardTitle}>Missao Macarronada</h2>
            <p className={styles.cardText}>
              Entre na cozinha e encare sua primeira aventura.
            </p>
          </article>

          <div className={styles.badge}>Chef&apos;s Quest</div>

          <article className={`${styles.card} ${styles.cardSecondary}`}>
            <Image
              src={lasanha}
              alt="Prato de lasanha"
              className={styles.dishImage}
            />
            <h2 className={styles.cardTitle}>Missao Lasanha</h2>
            <p className={styles.cardText}>
              Desbloqueie novos pratos conforme avanca nas fases.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}