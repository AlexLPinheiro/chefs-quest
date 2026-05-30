"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import mapImage from "@/app/assets/image/mapa.png";
import mapDesktopImage from "@/app/assets/image/mapa-desktop.png";
import chefImage from "@/app/assets/image/avatar-complete.png";
import {
  HOME_POSITION,
  MOVE_DURATION,
  STORAGE_PREFIX,
  ingredientCatalog,
  getIngredientKey,
  getStageObjective,
  type IngredientKey,
  type MapPoint,
  type StageIngredient,
} from "../_data/ingredients";
import IngredientMarker from "./ingredient-marker";
import ObjectiveList from "./objective-list";
import FeedbackDialog from "./feedback-dialog";
import CompletionBanner from "./completion-banner";
import styles from "../kitchen.module.css";

type StageGameProps = {
  phaseId: number;
  phaseName: string;
  ingredients: string[];
  userId: string;
};

export default function StageGame({ phaseId, phaseName, ingredients, userId }: StageGameProps) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [avatarPosition, setAvatarPosition] = useState<MapPoint>(HOME_POSITION);
  const [collectedKeys, setCollectedKeys] = useState<Record<string, boolean>>({});
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const [feedbackKey, setFeedbackKey] = useState<IngredientKey | null>(null);
  const [movingKey, setMovingKey] = useState<IngredientKey | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ingredientes da fase filtrados a partir da lista de nomes
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

  // Carrega progresso salvo no localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_PREFIX}-${userId}-${phaseId}`;
    const storedValue = window.localStorage.getItem(storageKey);

    if (storedValue) {
      try {
        const parsedKeys = JSON.parse(storedValue) as string[];
        const nextCollected = parsedKeys.reduce<Record<string, boolean>>((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setCollectedKeys(nextCollected);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setHasLoadedProgress(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phaseId]);

  // Persiste progresso no localStorage quando muda
  useEffect(() => {
    if (!hasLoadedProgress) return;

    const storageKey = `${STORAGE_PREFIX}-${userId}-${phaseId}`;
    const collectedList = Object.keys(collectedKeys).filter((key) => collectedKeys[key]);
    window.localStorage.setItem(storageKey, JSON.stringify(collectedList));
  }, [collectedKeys, hasLoadedProgress, phaseId, userId]);

  function handleCollect(ingredient: StageIngredient) {
    if (isAnimating || collectedKeys[ingredient.key]) return;

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

  function handleStartQuiz() {
    if (!feedbackKey) return;
    router.push(`/kitchen/quiz?phase=${phaseId}&ingredient=${feedbackKey}&uid=${userId}`);
  }

  const feedbackIngredient = feedbackKey ? ingredientCatalog[feedbackKey] : null;

  return (
    <div className={styles.stagePage}>
      <Link href="/home" className={styles.backButton} aria-label="Voltar para as fases">
        <ChevronLeft size={22} />
      </Link>

      {/* Seção do mapa com ingredientes e avatar */}
      <section className={styles.mapCard} aria-label={`Mapa da fase ${phaseName}`}>
        <div className={styles.mapFrame}>
          <Image
            src={mapImage}
            alt="Mapa da fase"
            fill
            priority
            className={`${styles.mapImage} ${styles.mobileOnly}`}
            sizes="(max-width: 767px) 100vw, 1px"
          />
          <Image
            src={mapDesktopImage}
            alt="Mapa da fase"
            fill
            priority
            className={`${styles.mapImage} ${styles.desktopOnly}`}
            sizes="(min-width: 768px) 420px, 1px"
          />

          <div className={styles.mapHeader}>
            <h1 className={styles.mapTitle}>{phaseName}</h1>
            <p className={styles.mapSubtitle}>{getStageObjective(phaseId)}</p>
          </div>

          {stageIngredients.map((ingredient) => (
            <IngredientMarker
              key={ingredient.key}
              ingredient={ingredient}
              isCollected={Boolean(collectedKeys[ingredient.key])}
              isActive={movingKey === ingredient.key}
              isDisabled={Boolean(collectedKeys[ingredient.key]) || isAnimating}
              onCollect={() => handleCollect(ingredient)}
            />
          ))}

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

      {/* Lista de objetivos */}
      <ObjectiveList ingredients={stageIngredients} collectedKeys={collectedKeys} />

      {/* Dialog de feedback ao coletar ingrediente */}
      {feedbackIngredient && (
        <FeedbackDialog
          ingredient={feedbackIngredient}
          onClose={() => setFeedbackKey(null)}
          onStartQuiz={handleStartQuiz}
        />
      )}

      {/* Banner de conclusão */}
      {allCollected && !feedbackIngredient && <CompletionBanner phaseId={phaseId} />}
    </div>
  );
}
