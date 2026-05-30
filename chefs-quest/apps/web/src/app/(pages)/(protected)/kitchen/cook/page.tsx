"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { phases } from "../../_data/phases";
import { Button } from "@/components/ui/button";
import { completePhase } from "@/app/actions/progress";
import kitchenImage from "@/app/assets/image/cozinha.png";
import tomatoImage from "@/app/assets/image/tomate.png";
import eggImage from "@/app/assets/image/ovo.png";
import cheeseImage from "@/app/assets/image/queijo.png";
import baseStyles from "../kitchen.module.css";
import styles from "./cook.module.css";

type IngredientKey = "tomate" | "ovo" | "queijo";

type Ingredient = {
  key: IngredientKey;
  label: string;
  image: StaticImageData;
};

type DragPosition = {
  left: number;
  top: number;
};

const COOK_INGREDIENTS: Ingredient[] = [
  { key: "tomate", label: "Tomate", image: tomatoImage },
  { key: "ovo", label: "Ovos", image: eggImage },
  { key: "queijo", label: "Queijo", image: cheeseImage },
];

const INITIAL_POSITION: DragPosition = { left: 0, top: 0 };
const TIMER_SECONDS = 30;

export default function CookPage() {
  const searchParams = useSearchParams();
  const phaseId = Number(searchParams.get("phase") ?? "1");
  const phase = phases.find((item) => item.id === phaseId) ?? phases[0];

  const potRef = useRef<HTMLDivElement>(null);
  const activeKeyRef = useRef<IngredientKey | null>(null);
  const [placedIngredients, setPlacedIngredients] = useState<IngredientKey[]>([]);
  const [draggingKey, setDraggingKey] = useState<IngredientKey | null>(null);
  const [dragPosition, setDragPosition] = useState<DragPosition>(INITIAL_POSITION);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remainingIngredients = useMemo(
    () => COOK_INGREDIENTS.filter((ingredient) => !placedIngredients.includes(ingredient.key)),
    [placedIngredients],
  );

  const placedObjects = useMemo(
    () =>
      placedIngredients
        .map((key) => COOK_INGREDIENTS.find((ingredient) => ingredient.key === key))
        .filter(Boolean) as Ingredient[],
    [placedIngredients],
  );

  const allPlaced = placedIngredients.length === COOK_INGREDIENTS.length;

  // Timer countdown
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

  useEffect(() => {
    if (allPlaced) {
      setShowSuccess(true);
      if (timerRef.current) clearInterval(timerRef.current);
      completePhase(phaseId);
    }
  }, [allPlaced, phaseId]);

  useEffect(() => {
    if (!draggingKey) return;

    function handlePointerMove(event: PointerEvent) {
      event.preventDefault();
      setDragPosition({
        left: event.clientX,
        top: event.clientY,
      });
    }

    function handlePointerUp(event: PointerEvent) {
      const key = activeKeyRef.current;
      const potRect = potRef.current?.getBoundingClientRect();
      const isInsidePot =
        potRect &&
        event.clientX >= potRect.left &&
        event.clientX <= potRect.right &&
        event.clientY >= potRect.top &&
        event.clientY <= potRect.bottom;

      if (isInsidePot && key) {
        setPlacedIngredients((current) =>
          current.includes(key) ? current : [...current, key],
        );
      }

      activeKeyRef.current = null;
      setDraggingKey(null);
    }

    function handlePointerCancel() {
      activeKeyRef.current = null;
      setDraggingKey(null);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [draggingKey]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>, ingredient: Ingredient) {
    if (placedIngredients.includes(ingredient.key) || timerExpired) {
      return;
    }

    event.preventDefault();
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    activeKeyRef.current = ingredient.key;
    setDraggingKey(ingredient.key);
    setDragPosition({
      left: event.clientX,
      top: event.clientY,
    });
  }

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

      <section className={styles.stage} aria-label={`Etapa de cozinha da fase ${phase.name}`}>
        <Image
          src={kitchenImage}
          alt=""
          fill
          priority
          className={styles.stageImage}
          sizes="(max-width: 768px) 100vw, 420px"
        />

        <section className={styles.topBar} aria-label="Timer da etapa">
          <div className={`${styles.energyPill} ${timeLeft <= 10 ? styles.energyPillUrgent : ""}`}>
            {formatTime(timeLeft)}
          </div>
        </section>

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

      {draggingKey ? (
        <div className={styles.dragGhost} style={{ left: dragPosition.left, top: dragPosition.top }}>
          <span className={styles.trayIcon}>
            <Image
              src={COOK_INGREDIENTS.find((ingredient) => ingredient.key === draggingKey)?.image ?? tomatoImage}
              alt="Ingrediente em movimento"
              className={styles.trayImage}
            />
          </span>
        </div>
      ) : null}

      {showSuccess ? (
        <div className={styles.successOverlay} role="presentation">
          <div className={styles.successCard} role="dialog" aria-modal="true" aria-labelledby="success-title">
            <p className={styles.successBadge}>Prato pronto</p>
            <h2 id="success-title" className={styles.successTitle}>
              {phase.name} finalizada
            </h2>
            <p className={styles.successText}>Você adicionou todos os ingredientes e concluiu a missão.</p>

            <Button asChild>
              <Link href="/home">Voltar para fases</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {timerExpired && !showSuccess ? (
        <div className={styles.successOverlay} role="presentation">
          <div className={styles.successCard} role="dialog" aria-modal="true" aria-labelledby="timeout-title">
            <p className={styles.successBadge} style={{ color: "#d32f2f" }}>Tempo esgotado!</p>
            <h2 id="timeout-title" className={styles.successTitle}>
              Não foi dessa vez
            </h2>
            <p className={styles.successText}>O tempo acabou antes de completar a receita. Tente novamente!</p>

            <Button asChild>
              <Link href={`/kitchen?phase=${phase.id}&started=1`}>Tentar novamente</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {allPlaced || timerExpired ? null : <div className={styles.footerNote}>Complete a panela para finalizar a fase.</div>}
    </div>
  );
}
