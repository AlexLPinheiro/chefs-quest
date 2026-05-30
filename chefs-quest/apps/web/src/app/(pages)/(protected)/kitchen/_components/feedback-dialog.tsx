import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StageIngredient } from "../_data/ingredients";
import styles from "../kitchen.module.css";

type FeedbackDialogProps = {
  ingredient: StageIngredient;
  onClose: () => void;
  onStartQuiz: () => void;
};

// Dialog exibido ao coletar um ingrediente no mapa
export default function FeedbackDialog({ ingredient, onClose, onStartQuiz }: FeedbackDialogProps) {
  return (
    <div className={styles.feedbackOverlay} role="presentation">
      <div className={styles.feedbackCard} role="dialog" aria-modal="true" aria-labelledby="feedback-title">
        <button type="button" className={styles.feedbackClose} onClick={onClose} aria-label="Fechar aviso">
          <X size={18} />
        </button>

        <div className={styles.feedbackIcon}>
          <Image src={ingredient.image} alt={ingredient.label} className={styles.feedbackImage} />
        </div>
        <p className={styles.feedbackEyebrow}>Ingrediente encontrado</p>
        <h2 id="feedback-title" className={styles.feedbackTitle}>
          {ingredient.label} coletado
        </h2>
        <p className={styles.feedbackText}>Agora responda ao quiz deste ingrediente para avançar na missão.</p>

        <Button onClick={onStartQuiz}>Iniciar quiz</Button>
      </div>
    </div>
  );
}
