import { getUserProgress } from "@/app/actions/progress";
import { getCurrentUserId } from "@/lib/session";
import { database, userTable, eq } from "@repo/db";
import styles from "./profile.module.css";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Faça login para ver seu perfil.</p>
      </div>
    );
  }

  const user = await database.query.userTable.findFirst({
    where: eq(userTable.id, userId),
  });

  const { level, completedPhases } = await getUserProgress();
  const totalPhases = 3;

  return (
    <div className={styles.page} aria-label="Perfil do jogador">
      <div className={styles.card} role="region" aria-label="Informações do perfil">
        <div className={styles.avatar} aria-hidden="true">
          {(user?.name ?? "?").charAt(0).toUpperCase()}
        </div>

        <h1 className={styles.name}>{user?.name ?? "Jogador"}</h1>

        <div className={styles.stats} role="group" aria-label="Estatísticas do jogador">
          <div className={styles.stat}>
            <span className={styles.statValue}>{level}</span>
            <span className={styles.statLabel}>Nível</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{completedPhases.length}/{totalPhases}</span>
            <span className={styles.statLabel}>Fases</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round((completedPhases.length / totalPhases) * 100)}%</span>
            <span className={styles.statLabel}>Progresso</span>
          </div>
        </div>
      </div>
    </div>
  );
}

