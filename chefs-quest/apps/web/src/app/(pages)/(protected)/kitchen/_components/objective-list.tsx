import Image from "next/image";
import { StageIngredient } from "../_data/ingredients";
import styles from "../kitchen.module.css";

type ObjectiveListProps = {
  ingredients: StageIngredient[];
  collectedKeys: Record<string, boolean>;
};

// Lista de objetivos mostrando progresso de coleta
export default function ObjectiveList({ ingredients, collectedKeys }: ObjectiveListProps) {
  return (
    <section className={styles.objectiveSection}>
      <p className={styles.objectiveLabel}>Missão: encontre todos os ingredientes espalhados pelo mapa.</p>

      <div className={styles.objectiveList}>
        {ingredients.map((ingredient) => {
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
  );
}
