import { StaticImageData } from "next/image";
import macarrao from "@/app/assets/image/macarrao.png";
import hamburguer from "@/app/assets/image/hambug.png";
import lasanha from "@/app/assets/image/lasanha.png";
import { PhaseCardVariant } from "../home/_components/phase-card/phase-card";

export type Phase = {
  id: number;
  duracao: number;
  image: StaticImageData;
  ingredients: string[];
  name: string;
  variant?: PhaseCardVariant;
};

export const phases: Phase[] = [
  {
    id: 1,
    duracao: 200,
    image: macarrao,
    ingredients: ["Macarrão", "Molho de tomate", "Queijo ralado"],
    name: "Macarronada",
    variant: "available",
  },
  {
    id: 2,
    duracao: 350,
    image: hamburguer,
    ingredients: ["Pão", "Carne", "Queijo cheddar", "Alface"],
    name: "Hambúrguer",
    variant: "locked",
  },
  {
    id: 3,
    duracao: 350,
    image: lasanha,
    ingredients: ["Massa", "Molho bolonhesa", "Presunto", "Muçarela"],
    name: "Lasanha",
    variant: "available",
  },
];
