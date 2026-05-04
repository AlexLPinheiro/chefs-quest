import PhaseCard from "./_components/phase-card/phase-card"
import macarrao from "@/app/assets/image/macarrao.png";

export default function HomePage() {
    return(
        <div className="mt-8 w-full flex flex-col items-center">
            <PhaseCard duration={200} image={macarrao} name={"Missão: macarronada"}></PhaseCard>
        </div>
    )
}