"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { phases } from "../../_data/phases";
import { completePhase } from "@/app/actions/progress";
import { COOK_INGREDIENTS, TIMER_SECONDS, type IngredientKey, type Ingredient } from "../_data/ingredients";
import { useDragAndDrop } from "./_hooks/use-drag-and-drop";
import CookResultDialog from "./_components/cook-result-dialog";
import kitchenImage from "@/app/assets/image/cozinha.png";
import kitchenDesktopImage from "@/app/assets/image/cozinha-desktop.png";
import tomatoImage from "@/app/assets/image/tomate.png";
import baseStyles from "../kitchen.module.css";
import styles from "./cook.module.css";

// Wrapper com Suspense para useSearchParams
export default function CookPage() {
  return (
    <Suspense>
      <CookPageContent />
    </Suspense>
  );
}

function CookPageContent() {
  const searchParams = useSearchParams();
  const phaseId = Number(searchParams.get("phase") ?? "1");
  const phase = phases.find((item) => item.id === phaseId) ?? phases[0];

  const potRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [placedIngredients, setPlacedIngredients] = useState<IngredientKey[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerExpired, setTimerExpired] = useState(false);

  // Ingredientes já na panela (para renderizar dentro dela)
  const placedObjects = useMemo(
    () =>
      placedIngredients
        .map((key) => COOK_INGREDIENTS.find((i) => i.key === key))
        .filter(Boolean) as Ingredient[],
    [placedIngredients],
  );

  const allPlaced = placedIngredients.length === COOK_INGREDIENTS.length;

  const handlePlace = useCallback((key: IngredientKey) => {
    setPlacedIngredients((current) =>
      current.includes(key) ? current : [...current, key],
    );
  }, []);

  // Hook de drag-and-drop
  const { draggingKey, dragPosition, handlePointerDown } = useDragAndDrop({
    potRef,
    placedIngredients,
    timerExpired,
    onPlace: handlePlace,
  });

  // Timer regressivo de 30s
  useEffect(() => {
    if (showSuccess || timerExpired) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showSuccess, timerExpired]);

  // Detecta conclusão e salva progresso
  useEffect(() => {
    if (allPlaced) {
      setShowSuccess(true);
      if (timerRef.current) clearInterval(timerRef.current);
      completePhase(phaseId);
    }
  }, [allPlaced, phaseId]);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className={styles.page}>
      <Link href={`/kitchen?phase=${phase.id}&started=1`} className={baseStyles.backButton} aria-label="Voltar">
        <ChevronLeft size={22} />
      </Link>

      {/* Área principal da cozinha com panela e ingredientes */}
      <section className={styles.stage} aria-label={`Etapa de cozinha da fase ${phase.name}`}>
        <Image
          src={kitchenImage}
          alt=""
          fill
          priority
          className={`${styles.stageImage} ${styles.mobileOnly}`}
          sizes="(max-width: 767px) 100vw, 1px"
        />
        <Image
          src={kitchenDesktopImage}
          alt=""
          fill
          priority
          className={`${styles.stageImage} ${styles.desktopOnly}`}
          sizes="(min-width: 768px) 420px, 1px"
        />

        {/* Timer */}
        <section className={styles.topBar} aria-label="Timer da etapa">
          <div className={`${styles.energyPill} ${timeLeft <= 10 ? styles.energyPillUrgent : ""}`}>
            {formatTime(timeLeft)}
          </div>
        </section>

        {/* Zona de drop (panela) */}
        <div
          ref={potRef}
          className={`${styles.potDropZone} ${draggingKey ? styles.potDropZoneActive : ""}`}
          aria-label="Panela"
        >
          <div className={styles.potContents}>
            {placedObjects.map((ingredient, index) => (
              <span
                key={ingredient.key}
                className={styles.potIngredient}
                style={{ transform: `translate(${index * 0.85}rem, ${index % 2 === 0 ? "0" : "0.25rem"})` }}
              >
                <Image src={ingredient.image} alt={ingredient.label} className={styles.potIngredientImage} />
              </span>
            ))}
          </div>
        </div>

        {/* Bandeja de ingredientes arrastáveis */}
        <div className={styles.tray}>
          {COOK_INGREDIENTS.map((ingredient) => {
            const isPlaced = placedIngredients.includes(ingredient.key);
            const isDragging = draggingKey === ingredient.key;
            return (
              <div
                key={ingredient.key}
                className={`${styles.trayItem} ${isPlaced ? styles.trayItemPlaced : ""}`}
                onPointerDown={(event) => handlePointerDown(event, ingredient)}
                aria-label={`Arrastar ${ingredient.label}`}
                style={isDragging ? { opacity: 0.15 } : undefined}
              >
                <span className={styles.trayIcon}>
                  <Image src={ingredient.image} alt={ingredient.label} className={styles.trayImage} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ghost do ingrediente sendo arrastado */}
      {draggingKey && (
        <div className={styles.dragGhost} style={{ left: dragPosition.left, top: dragPosition.top }}>
          <span className={styles.trayIcon}>
            <Image
              src={COOK_INGREDIENTS.find((i) => i.key === draggingKey)?.image ?? tomatoImage}
              alt="Ingrediente em movimento"
              className={styles.trayImage}
            />
          </span>
        </div>
      )}

      {/* Dialogs de resultado */}
      {showSuccess && <CookResultDialog variant="success" phaseName={phase.name} phaseId={phase.id} />}
      {timerExpired && !showSuccess && <CookResultDialog variant="timeout" phaseName={phase.name} phaseId={phase.id} />}

      {/* Dica fixa no rodapé */}
      {!allPlaced && !timerExpired && (
        <div className={styles.footerNote}>Complete a panela para finalizar a fase.</div>
      )}
    </div>
  );
}
