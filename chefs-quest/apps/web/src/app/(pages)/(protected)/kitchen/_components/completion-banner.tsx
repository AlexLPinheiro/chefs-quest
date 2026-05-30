import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "../kitchen.module.css";

type CompletionBannerProps = {
  phaseId: number;
};

// Banner exibido quando todos os ingredientes foram coletados
export default function CompletionBanner({ phaseId }: CompletionBannerProps) {
  return (
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
  );
}
