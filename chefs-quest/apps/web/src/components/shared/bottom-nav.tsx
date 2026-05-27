"use client";

import { ChartNoAxesColumn, Home, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./bottom-nav.module.css";

export default function BottomNav() {
    const pathname = usePathname();
    const isHome = pathname === "/home";

    return (
        <div className={styles.wrapper}>
            <nav aria-label="Bottom navigation" className={styles.nav}>
                <Link
                    href="/home"
                    aria-label="Inicio"
                    className={`${styles.item} ${styles.left} ${isHome ? styles.itemActive : ""}`}
                >
                    <Home size={20} />
                </Link>

                <Link href="/home" aria-label="Progresso" className={styles.item}>
                    <ChartNoAxesColumn size={20} />
                </Link>

                <Link href="/home" aria-label="Perfil" className={`${styles.item} ${styles.right}`}>
                    <UserRound size={20} />
                </Link>
            </nav>
        </div>
    );
}
