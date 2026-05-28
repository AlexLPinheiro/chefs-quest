import PhaseCard from "./_components/phase-card/phase-card"
import styles from "./home.module.css";
import BottomNav from "@/components/shared/bottom-nav";
import { phases } from "../_data/phases";

export default function HomePage() {
    return(
        <>
            <div className={styles.page}>
                {phases.map((fase)=>(
                    <PhaseCard
                        key={fase.id}
                        duration={fase.duracao}
                        image={fase.image}
                        name={fase.name}
                        variant={fase.variant}
                        href={`/kitchen?phase=${fase.id}`}
                    />
                ))}
            </div>
            <BottomNav />
        </>
    )
}
