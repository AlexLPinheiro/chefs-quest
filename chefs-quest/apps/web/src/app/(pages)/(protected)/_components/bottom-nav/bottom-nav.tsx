"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, Home, User } from "lucide-react";
import styles from "./bottom-nav.module.css";

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname?.startsWith("/home");
  const isKitchen = pathname?.startsWith("/kitchen");
  const isProfile = pathname?.startsWith("/profile");

  return (
    <nav className={styles.nav} aria-label="Navegação inferior">
      <Link
        href="/home"
        aria-label="Home"
        className={`${styles.item} ${isHome ? styles.active : ""}`}
      >
        <Home size={26} />
      </Link>

      <Link
        href="/kitchen"
        aria-label="Cozinha"
        className={`${styles.item} ${isKitchen ? styles.active : ""}`}
      >
        <ChefHat size={26} />
      </Link>

      <Link
        href="/profile"
        aria-label="Perfil"
        className={`${styles.item} ${isProfile ? styles.active : ""}`}
      >
        <User size={26} />
      </Link>
    </nav>
  );
}

