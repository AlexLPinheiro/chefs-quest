import { getUserProgress } from "@/app/actions/progress";
import Header from "../home/_components/header/header";

export default async function HeaderWithProgress() {
  const { level, completedPhases } = await getUserProgress();
  const totalPhases = 3;
  const progress = Math.round((completedPhases.length / totalPhases) * 100);

  return <Header level={level} progress={progress} />;
}
