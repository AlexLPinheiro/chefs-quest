import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { phases } from "../_data/phases";
import { formatSecondsToMinutes } from "@/lib/utils/format-time";
import StageGame from "./_components/stage-game";
import styles from "./kitchen.module.css";

type KitchenPageProps = {
  searchParams: Promise<{
    phase?: string;
    started?: string;
  }>;
};

export default async function KitchenPage({ searchParams }: KitchenPageProps) {
  const params = await searchParams;
  const phaseId = Number(params.phase);
  const hasStarted = params.started === "1";
  const phase = phases.find((item) => item.id === phaseId) ?? phases[0];

  if (hasStarted) {
    return <StageGame phaseId={phase.id} phaseName={phase.name} ingredients={phase.ingredients} />;
  }

  return (
    <div className={styles.summaryPage}>
      <Link href="/home" className={styles.summaryBackLink}>
        <ChevronLeft size={18} />
        Voltar para fases
      </Link>

      <section className={styles.summaryCard}>
        <div className={styles.summaryImageWrap}>
          <Image src={phase.image} alt={phase.name} className={styles.summaryImage} priority />
        </div>

        <div className={styles.summaryContent}>
          <span className={styles.summaryBadge}>Resumo da fase</span>
          <h1 className={styles.summaryTitle}>{phase.name}</h1>

          <div className={styles.summaryMeta}>
            <span>Duração: {formatSecondsToMinutes(phase.duracao)}</span>
          </div>

          <div className={styles.summarySection}>
            <h2 className={styles.summarySectionTitle}>Ingredientes a serem encontrados</h2>
            <ul className={styles.summaryList}>
              {phase.ingredients.map((ingredient) => (
                <li key={ingredient} className={styles.summaryListItem}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <Button asChild>
            <Link href={`/kitchen?phase=${phase.id}&started=1`}>
              <Play size={18} />
              Iniciar
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
