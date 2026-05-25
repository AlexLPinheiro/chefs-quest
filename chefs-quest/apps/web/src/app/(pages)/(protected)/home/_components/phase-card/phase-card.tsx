"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { formatSecondsToMinutes } from "@/lib/utils/format-time";
import { Clock , Lock} from "lucide-react";
import styles from "./phase-card.module.css";

export type PhaseCardVariant = "available" | "locked";

type PhaseCardProps = {
    duration: number;
    image: StaticImageData;
    name: string;
    variant?: PhaseCardVariant;
};



const phaseCardVariants = {
    available: {
    card: styles.available,
        buttonText: "Buscar igredientes",
        disabled: false,
    },
    locked: {
    card: styles.locked,
        buttonText: "Buscar ingredientes",
        disabled: true,
    },
};




export default function PhaseCard({ duration, image, name, variant }: PhaseCardProps) {

    const availability = variant? variant : "available"  

  const variantStyles = phaseCardVariants[availability];
    const isLocked = variant === "locked";

    return (
    <div className={`${styles.card} ${availability === "locked" ? styles.locked : styles.available}`}>
      {isLocked && (
        <div className={styles.lockBadge}>
          <Lock size={20} />
        </div>
      )}

      <span className={styles.meta}>
        <Clock size={20} />
        <p className={styles.metaText}>{formatSecondsToMinutes(duration)}</p>
      </span>

      <div className={styles.content}>
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className={styles.image}
        />

        <h2 className={styles.title}>{name}</h2>

        <Button disabled={variantStyles.disabled}>
          {variantStyles.buttonText}
        </Button>
      </div>
    </div>
  );
}
