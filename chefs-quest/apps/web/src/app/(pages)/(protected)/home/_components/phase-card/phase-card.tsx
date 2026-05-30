"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatSecondsToMinutes } from "@/lib/utils/format-time";
import { Clock , Lock} from "lucide-react";
import styles from "./phase-card.module.css";

export type PhaseCardVariant = "available" | "locked" | "completed";

type PhaseCardProps = {
    duration: number;
    image: StaticImageData;
    name: string;
  href?: string;
    variant?: PhaseCardVariant;
};



const phaseCardVariants = {
    available: {
    card: styles.available,
      buttonText: "Cozinhar agora",
        disabled: false,
    },
    locked: {
    card: styles.locked,
        buttonText: "Bloqueada",
        disabled: true,
    },
    completed: {
    card: styles.available,
        buttonText: "Concluída ✓",
        disabled: true,
    },
};




export default function PhaseCard({ duration, image, name, href, variant }: PhaseCardProps) {

    const availability = variant? variant : "available"  

  const variantStyles = phaseCardVariants[availability];
    const isLocked = variant === "locked";

    return (
    <article className={`${styles.card} ${availability === "locked" ? styles.locked : styles.available}`} aria-label={`Fase: ${name}${isLocked ? " (bloqueada)" : availability === "completed" ? " (concluída)" : ""}`}>
      {isLocked && (
        <div className={styles.lockBadge} aria-hidden="true">
          <Lock size={20} />
        </div>
      )}

      <span className={styles.meta} aria-label={`Duração: ${formatSecondsToMinutes(duration)}`}>
        <Clock size={20} aria-hidden="true" />
        <p className={styles.metaText}>{formatSecondsToMinutes(duration)}</p>
      </span>

      <div className={styles.content}>
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className={styles.image}
          style={{ width: "auto", height: "auto" }}
        />

        <h2 className={styles.title}>{name}</h2>

        {variantStyles.disabled ? (
          <Button disabled aria-label={`${variantStyles.buttonText} - ${name}`}>{variantStyles.buttonText}</Button>
        ) : (
          <Button asChild>
            <Link href={href ?? "/kitchen"} aria-label={`${variantStyles.buttonText} - ${name}`}>{variantStyles.buttonText}</Link>
          </Button>
        )}
      </div>
    </article>
  );
}
