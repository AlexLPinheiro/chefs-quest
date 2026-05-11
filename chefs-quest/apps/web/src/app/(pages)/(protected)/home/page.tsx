import PhaseCard from "./_components/phase-card/phase-card"
import macarrao from "@/app/assets/image/macarrao.png";
import hamburguer from "@/app/assets/image/hambug.png";
import lasanha from "@/app/assets/image/lasanha.png";
import { PhaseCardVariant } from "./_components/phase-card/phase-card";

type Fase = {
    id: number;
    duracao: number;
    image: typeof macarrao;
    name: string;
    variant?: PhaseCardVariant;
}

const fases: Fase[] = [
    {
        id: 1,
        duracao: 200,
        image: macarrao,
        name: "Missão: macarronada",
        variant: "available"
    },
    {
        id: 2,
        duracao: 350,
        image: hamburguer,
        name: "Missão: hamburguer",
        variant: "locked"
    },
    {
        id: 3,
        duracao: 350,
        image: lasanha,
        name: "Missão: lasanha",
        variant: "available"
    }
]

export default function HomePage() {
    return(
        <div className="mt-8 w-full flex flex-col gap-3 items-center">
            {fases.map((fase)=>(
                <PhaseCard key={fase.id} duration={fase.duracao} image={fase.image} name={fase.name} variant={fase.variant}></PhaseCard>
            ))}
            
        </div>
    )
}