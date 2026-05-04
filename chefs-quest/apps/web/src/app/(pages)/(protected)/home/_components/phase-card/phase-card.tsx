"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { formatSecondsToMinutes } from "@/lib/utils/format-time";
import { Clock , Lock} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-helper";
import { title } from "process";

type PhaseCardVariant = "available" | "locked";

type PhaseCardProps = {
    duration: number;
    image: StaticImageData;
    name: string;
    variant?: PhaseCardVariant;
};

const phaseCardVariants = {
    available: {
        card: "bg-white shadow-md text-black",
        image: "",
        title: "text-black",
        buttonText: "Buscar igredientes",
        disabled: false,
    },
    locked: {
        card: "bg-gray-100 shadow-sm text-black",
        image: "",
        title: "text-black",
        buttonText: "Buscar ingredientes",
        disabled: true,
    },
};




export default function PhaseCard({ duration, image, name, variant = "available"}: PhaseCardProps) {

    const styles = phaseCardVariants[variant];
    const isLocked = variant === "locked";

    return (
    <div className={cn("relative w-90 h-60 rounded-2xl p-4", styles.card)}>
      {isLocked && (
        <div className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-sm">
          <Lock size={20} />
        </div>
      )}

      <span className="flex items-center gap-1 text-gray-500">
        <Clock size={20} />
        <p>{formatSecondsToMinutes(duration)}</p>
      </span>

      <div className="flex w-full flex-col items-center justify-center">
        <Image
          src={image}
          alt={name}
          width={220}
          height={200}
          className={styles.image}
        />

        <h2 className={cn("font-semibold", styles.title)}>{name}</h2>

        <Button disabled={styles.disabled}>
          {styles.buttonText}
        </Button>
      </div>
    </div>
  );
}
