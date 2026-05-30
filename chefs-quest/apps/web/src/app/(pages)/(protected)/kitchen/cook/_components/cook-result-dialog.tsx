import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "../cook.module.css";

type CookResultDialogProps = {
  variant: "success" | "timeout";
  phaseName: string;
  phaseId: number;
};

// Dialog de resultado: sucesso ou tempo esgotado
export default function CookResultDialog({ variant, phaseName, phaseId }: CookResultDialogProps) {
  const isSuccess = variant === "success";

  return (
    <div className={styles.successOverlay} role="presentation">
      <div
        className={styles.successCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby={isSuccess ? "success-title" : "timeout-title"}
      >
        <p className={styles.successBadge} style={!isSuccess ? { color: "#d32f2f" } : undefined}>
          {isSuccess ? "Prato pronto" : "Tempo esgotado!"}
        </p>
        <h2 id={isSuccess ? "success-title" : "timeout-title"} className={styles.successTitle}>
          {isSuccess ? `${phaseName} finalizada` : "Não foi dessa vez"}
        </h2>
        <p className={styles.successText}>
          {isSuccess
            ? "Você adicionou todos os ingredientes e concluiu a missão."
            : "O tempo acabou antes de completar a receita. Tente novamente!"}
        </p>

        <Button asChild>
          <Link href={isSuccess ? "/home" : `/kitchen?phase=${phaseId}&started=1`}>
            {isSuccess ? "Voltar para fases" : "Tentar novamente"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
