import PhaseCard from "./_components/phase-card/phase-card"
import styles from "./home.module.css";
import { phases } from "../_data/phases";
import { getUserProgress } from "@/app/actions/progress";

export default async function HomePage() {
    const { completedPhases } = await getUserProgress();

    return(
        <section className={styles.page} aria-label="Fases disponíveis">
            {phases.map((fase, index) => {
                const isCompleted = completedPhases.includes(fase.id);
                // Determina estado da fase: concluída, disponível ou bloqueada
                const previousCompleted = index === 0 || completedPhases.includes(phases[index - 1].id);
                const variant = isCompleted ? "completed" : previousCompleted ? "available" : "locked";

                return (
                    <PhaseCard
                        key={fase.id}
                        duration={fase.duracao}
                        image={fase.image}
                        name={fase.name}
                        variant={variant}
                        href={`/kitchen?phase=${fase.id}`}
                    />
                );
            })}
        </section>
    )
}
