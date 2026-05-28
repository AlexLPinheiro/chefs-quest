"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { phases } from "../../_data/phases";
import { Button } from "@/components/ui/button";
import baseStyles from "../kitchen.module.css";
import tomatoImage from "@/app/assets/image/tomate.png";
import eggImage from "@/app/assets/image/ovo.png";
import cheeseImage from "@/app/assets/image/queijo.png";
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

export default function CookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phaseId = Number(searchParams.get("phase") ?? "1");
  const phase = phases.find((item) => item.id === phaseId) ?? phases[0];

  const potRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const activeKeyRef = useRef<IngredientKey | null>(null);
  const [placedIngredients, setPlacedIngredients] = useState<IngredientKey[]>([]);
  const [draggingKey, setDraggingKey] = useState<IngredientKey | null>(null);
  const [dragPosition, setDragPosition] = useState<DragPosition>(INITIAL_POSITION);
  const [showSuccess, setShowSuccess] = useState(false);

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

  useEffect(() => {
    if (!draggingKey) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      setDragPosition({
        left: event.clientX - offsetRef.current.x,
        top: event.clientY - offsetRef.current.y,
      });
    }

    function handlePointerUp(event: PointerEvent) {
      const potRect = potRef.current?.getBoundingClientRect();
      const isInsidePot =
        potRect &&
        event.clientX >= potRect.left &&
        event.clientX <= potRect.right &&
        event.clientY >= potRect.top &&
        event.clientY <= potRect.bottom;

      if (isInsidePot && activeKeyRef.current) {
        setPlacedIngredients((current) =>
          current.includes(activeKeyRef.current as IngredientKey)
            ? current
            : [...current, activeKeyRef.current as IngredientKey],
        );
      }

      activeKeyRef.current = null;
      setDraggingKey(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingKey]);

  useEffect(() => {
    if (allPlaced) {
      setShowSuccess(true);
    }
  }, [allPlaced]);

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>, ingredient: Ingredient) {
    if (placedIngredients.includes(ingredient.key)) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    offsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    activeKeyRef.current = ingredient.key;
    setDraggingKey(ingredient.key);
    setDragPosition({
      left: event.clientX - offsetRef.current.x,
      top: event.clientY - offsetRef.current.y,
    });
  }

  return (
    <div className={styles.page}>
      <Link href={`/kitchen?phase=${phase.id}&started=1`} className={baseStyles.backButton} aria-label="Voltar">
        <ChevronLeft size={22} />
      </Link>

      <section className={styles.topBar}>
        <div className={styles.energyPill}>65% ENERGIA!</div>
        <div className={styles.energyTrack}>
          <span className={styles.energyFill} />
        </div>
      </section>

      <section className={styles.stage} aria-label={`Etapa de cozinha da fase ${phase.name}`}>
        <div className={`${styles.shelf} ${styles.shelfTop}`} aria-hidden="true" />
        <div className={`${styles.shelf} ${styles.shelfMid}`} aria-hidden="true" />
        <div className={`${styles.shelf} ${styles.shelfBottom}`} aria-hidden="true" />

        <div className={styles.instruction}>Arraste os ingredientes para a panela</div>

        <div className={styles.potArea}>
          <div className={styles.flame} aria-hidden="true" />
          <div className={styles.stove} aria-hidden="true" />

          <div ref={potRef} className={styles.pot} aria-label="Panela">
            <div className={styles.potRim} />
            <div className={styles.potBody} />
            <div className={styles.potHandleLeft} />
            <div className={styles.potHandleRight} />

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
        </div>

        <div className={styles.dragHint} aria-hidden="true">
          <span className={styles.dragCircle} />
          <span className={styles.dragText}>Arraste para cá</span>
        </div>

        <div className={styles.tray}>
          {remainingIngredients.map((ingredient) => (
            <button
              key={ingredient.key}
              type="button"
              className={styles.trayItem}
              onPointerDown={(event) => handlePointerDown(event, ingredient)}
              aria-label={`Arrastar ${ingredient.label}`}
              style={draggingKey === ingredient.key ? { opacity: 0.15 } : undefined}
            >
              <span className={styles.trayIcon}>
                <Image src={ingredient.image} alt={ingredient.label} className={styles.trayImage} />
              </span>
            </button>
          ))}
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

      {allPlaced ? null : (
        <div className={styles.footerNote}>Complete a panela para finalizar a fase.</div>
      )}
    </div>
  );
}
