"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mapImage from "@/app/assets/image/mapa.png";
import tomatoImage from "@/app/assets/image/tomate.png";
import eggImage from "@/app/assets/image/ovo.png";
import cheeseImage from "@/app/assets/image/queijo.png";
import chefImage from "@/app/assets/image/avatar-complete.png";
import styles from "../kitchen.module.css";

type StageGameProps = {
  phaseId: number;
  phaseName: string;
  ingredients: string[];
};

type IngredientKey = "tomate" | "ovo" | "queijo";

type MapPoint = {
  x: number;
  y: number;
};

type StageIngredient = {
  key: IngredientKey;
  label: string;
  image: StaticImageData;
  target: number;
  position: MapPoint;
};

const HOME_POSITION: MapPoint = { x: 80, y: 77 };
const MOVE_DURATION = 1800;
const STORAGE_PREFIX = "chefs-quest-kitchen-phase";

const ingredientCatalog: Record<IngredientKey, StageIngredient> = {
  tomate: {
    key: "tomate",
    label: "Tomate",
    image: tomatoImage,
    target: 1,
    position: { x: 18, y: 40 },
  },
  ovo: {
    key: "ovo",
    label: "Ovo",
    image: eggImage,
    target: 1,
    position: { x: 20, y: 70 },
  },
  queijo: {
    key: "queijo",
    label: "Queijo",
    image: cheeseImage,
    target: 1,
    position: { x: 84, y: 46 },
  },
};

function getIngredientKey(ingredient: string): IngredientKey | null {
  const normalized = ingredient.toLowerCase();

  if (normalized.includes("tomate")) {
    return "tomate";
  }

  if (normalized.includes("ovo")) {
    return "ovo";
  }

  if (normalized.includes("queijo")) {
    return "queijo";
  }

  return null;
}

function getStageObjective(phaseId: number) {
  if (phaseId === 1) {
    return "Busque os ingredientes para cozinhar a macarronada.";
  }

  return "Explore o mapa e encontre todos os ingredientes da receita.";
}

export default function StageGame({ phaseId, phaseName, ingredients }: StageGameProps) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [avatarPosition, setAvatarPosition] = useState<MapPoint>(HOME_POSITION);
  const [collectedKeys, setCollectedKeys] = useState<Record<string, boolean>>({});
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [feedbackKey, setFeedbackKey] = useState<IngredientKey | null>(null);
  const [movingKey, setMovingKey] = useState<IngredientKey | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const stageIngredients = useMemo(() => {
    const uniqueKeys = Array.from(
      new Set(
        ingredients
          .map((ingredient) => getIngredientKey(ingredient))
          .filter((value): value is IngredientKey => value !== null),
      ),
    );

    return uniqueKeys.map((key) => ingredientCatalog[key]);
  }, [ingredients]);

  const allCollected =
    stageIngredients.length > 0 && stageIngredients.every((ingredient) => collectedKeys[ingredient.key]);

  useEffect(() => {
    const storageKey = `${STORAGE_PREFIX}-${phaseId}`;
    const storedValue = window.localStorage.getItem(storageKey);

    if (storedValue) {
      try {
        const parsedKeys = JSON.parse(storedValue) as string[];
        const nextCollected = parsedKeys.reduce<Record<string, boolean>>((accumulator, key) => {
          accumulator[key] = true;
          return accumulator;
        }, {});

        setCollectedKeys(nextCollected);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setHasLoadedProgress(true);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [phaseId]);

  useEffect(() => {
    if (!hasLoadedProgress) {
      return;
    }

    const storageKey = `${STORAGE_PREFIX}-${phaseId}`;
    const collectedList = Object.keys(collectedKeys).filter((key) => collectedKeys[key]);

    window.localStorage.setItem(storageKey, JSON.stringify(collectedList));
  }, [collectedKeys, hasLoadedProgress, phaseId]);

  function handleCollect(ingredient: StageIngredient) {
    if (isAnimating || collectedKeys[ingredient.key]) {
      return;
    }

    setFeedbackKey(null);
    setMovingKey(ingredient.key);
    setIsAnimating(true);
    setAvatarPosition(ingredient.position);

    timeoutRef.current = setTimeout(() => {
      setFeedbackKey(ingredient.key);
      setMovingKey(null);
      setIsAnimating(false);
    }, MOVE_DURATION);
  }

  function closeFeedback() {
    setFeedbackKey(null);
  }

  function startQuiz() {
    if (!feedbackIngredient) {
      return;
    }

    router.push(`/kitchen/quiz?phase=${phaseId}&ingredient=${feedbackIngredient.key}`);
  }

  const feedbackIngredient = feedbackKey ? ingredientCatalog[feedbackKey] : null;

  return (
    <div className={styles.stagePage}>
      <Link href="/home" className={styles.backButton} aria-label="Voltar para as fases">
        <ChevronLeft size={22} />
      </Link>

      <section className={styles.mapCard} aria-label={`Mapa da fase ${phaseName}`}>
        <div className={styles.mapFrame}>
          <Image
            src={mapImage}
            alt="Mapa da fase"
            fill
            priority
            className={styles.mapImage}
            sizes="(max-width: 768px) 100vw, 420px"
          />

          <div className={styles.mapHeader}>
            <h1 className={styles.mapTitle}>{phaseName}</h1>
            <p className={styles.mapSubtitle}>{getStageObjective(phaseId)}</p>
          </div>

          {stageIngredients.map((ingredient) => {
            const isCollected = Boolean(collectedKeys[ingredient.key]);
            const isCurrentTarget = movingKey === ingredient.key;

            return (
              <button
                key={ingredient.key}
                type="button"
                className={`${styles.marker} ${isCollected ? styles.markerCollected : ""} ${
                  isCurrentTarget ? styles.markerActive : ""
                }`}
                style={{ left: `${ingredient.position.x}%`, top: `${ingredient.position.y}%` }}
                onClick={() => handleCollect(ingredient)}
                disabled={isCollected || isAnimating}
                aria-label={`Coletar ${ingredient.label}`}
              >
                <Image src={ingredient.image} alt={ingredient.label} className={styles.markerImage} />
                {isCollected && <CheckCircle2 size={18} className={styles.markerCheck} />}
              </button>
            );
          })}

          <div
            className={`${styles.avatarMarker} ${isAnimating ? styles.avatarMoving : ""}`}
            style={{ left: `${avatarPosition.x}%`, top: `${avatarPosition.y}%` }}
            aria-label={isAnimating ? "Personagem em movimento" : "Personagem na fase"}
          >
            <Image src={chefImage} alt="Personagem da fase" className={styles.avatarImage} />
          </div>

          <div className={styles.homeMarker} aria-hidden="true">
            <span className={styles.homeRoof} />
            <span className={styles.homeBody} />
          </div>
        </div>
      </section>

      <section className={styles.objectiveSection}>
        <p className={styles.objectiveLabel}>Missão: encontre todos os ingredientes espalhados pelo mapa.</p>

        <div className={styles.objectiveList}>
          {stageIngredients.map((ingredient) => {
            const collected = Boolean(collectedKeys[ingredient.key]);

            return (
              <article
                key={ingredient.key}
                className={`${styles.objectiveItem} ${collected ? styles.objectiveItemCollected : ""}`}
              >
                <div className={styles.objectiveIcon}>
                  <Image src={ingredient.image} alt={ingredient.label} className={styles.objectiveImage} />
                </div>

                <div className={styles.objectiveInfo}>
                  <span className={styles.objectiveName}>{ingredient.label}</span>
                  <span className={styles.objectiveHint}>
                    {collected ? "Ingrediente encontrado" : "Toque no ingrediente no mapa"}
                  </span>
                </div>

                <strong className={styles.objectiveCount}>{collected ? "1/1" : "0/1"}</strong>
              </article>
            );
          })}
        </div>
      </section>

      {feedbackIngredient && (
        <div className={styles.feedbackOverlay} role="presentation">
          <div className={styles.feedbackCard} role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <button type="button" className={styles.feedbackClose} onClick={closeFeedback} aria-label="Fechar aviso">
              <X size={18} />
            </button>

            <div className={styles.feedbackIcon}>
              <Image src={feedbackIngredient.image} alt={feedbackIngredient.label} className={styles.feedbackImage} />
            </div>
            <p className={styles.feedbackEyebrow}>Ingrediente encontrado</p>
            <h2 id="feedback-title" className={styles.feedbackTitle}>
              {feedbackIngredient.label} coletado
            </h2>
            <p className={styles.feedbackText}>Agora responda ao quiz deste ingrediente para avançar na missão.</p>

            <Button onClick={startQuiz}>Iniciar quiz</Button>
          </div>
        </div>
      )}

      {allCollected && !feedbackIngredient && (
        <div className={styles.completionBanner}>
          <div>
            <p className={styles.completionEyebrow}>Fase concluída</p>
            <h2 className={styles.completionTitle}>Todos os ingredientes foram encontrados.</h2>
            <p className={styles.completionText}>Agora é hora de cozinhar o prato final.</p>
          </div>

          <Button asChild>
            <Link href={`/kitchen/cook?phase=${phaseId}`}>Cozinhar agora</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
