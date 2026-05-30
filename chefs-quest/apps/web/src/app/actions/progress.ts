"use server";

import { database, phaseProgressTable, userTable, eq, and } from "@repo/db";
import { getCurrentUserId, setCurrentUserId } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Cria ou encontra usuário pelo nome e salva sessão
export async function loginUser(name: string) {
  let user = await database.query.userTable.findFirst({
    where: eq(userTable.name, name),
  });

  if (!user) {
    const id = crypto.randomUUID();
    await database.insert(userTable).values({
      id,
      name,
      password: "bypass",
    });
    user = { id, name, password: "bypass", createdAt: new Date() };
  }

  await setCurrentUserId(user.id);
  return { success: true };
}

// Marca fase como concluída no banco (idempotente)
export async function completePhase(phaseId: number) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const existing = await database.query.phaseProgressTable.findFirst({
    where: and(
      eq(phaseProgressTable.userId, userId),
      eq(phaseProgressTable.phaseId, phaseId),
    ),
  });

  if (existing) {
    return { success: true, alreadyCompleted: true };
  }

  await database.insert(phaseProgressTable).values({
    userId,
    phaseId,
    completed: true,
    completedAt: new Date(),
  });

  revalidatePath("/home");
  revalidatePath("/kitchen");
  return { success: true };
}

// Retorna nível e lista de fases concluídas do usuário
export async function getUserProgress() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { level: 1, completedPhases: [] as number[] };
  }

  const progress = await database.query.phaseProgressTable.findMany({
    where: and(
      eq(phaseProgressTable.userId, userId),
      eq(phaseProgressTable.completed, true),
    ),
  });

  const completedPhases = progress.map((p) => p.phaseId);
  const level = 1 + completedPhases.length;

  return { level, completedPhases };
}
