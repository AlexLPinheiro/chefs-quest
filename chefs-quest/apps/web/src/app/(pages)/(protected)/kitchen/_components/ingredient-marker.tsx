import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { StageIngredient } from "../_data/ingredients";
import styles from "../kitchen.module.css";

type IngredientMarkerProps = {
  ingredient: StageIngredient;
  isCollected: boolean;
  isActive: boolean;
  isDisabled: boolean;
  onCollect: () => void;
};

// Marcador de ingrediente no mapa (botão clicável)
export default function IngredientMarker({
  ingredient,
  isCollected,
  isActive,
  isDisabled,
  onCollect,
}: IngredientMarkerProps) {
  return (
    <button
      type="button"
      className={`${styles.marker} ${isCollected ? styles.markerCollected : ""} ${
        isActive ? styles.markerActive : ""
      }`}
      style={{ left: `${ingredient.position.x}%`, top: `${ingredient.position.y}%` }}
      onClick={onCollect}
      disabled={isDisabled}
      aria-label={`Coletar ${ingredient.label}`}
    >
      <Image src={ingredient.image} alt={ingredient.label} className={styles.markerImage} />
      {isCollected && <CheckCircle2 size={18} className={styles.markerCheck} />}
    </button>
  );
}
