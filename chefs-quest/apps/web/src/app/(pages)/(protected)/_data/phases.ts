import { StaticImageData } from "next/image";
import macarrao from "@/app/assets/image/macarrao.png";
import hamburguer from "@/app/assets/image/hambug.png";
import lasanha from "@/app/assets/image/lasanha.png";

export type Phase = {
  id: number;
  duracao: number;
  image: StaticImageData;
  ingredients: string[];
  name: string;
};

export const phases: Phase[] = [
  {
    id: 1,
    duracao: 200,
    image: macarrao,
    ingredients: ["Macarrão", "Molho de tomate", "Queijo ralado"],
    name: "Macarronada",
  },
  {
    id: 2,
    duracao: 350,
    image: hamburguer,
    ingredients: ["Pão", "Carne", "Queijo cheddar", "Alface"],
    name: "Hambúrguer",
  },
  {
    id: 3,
    duracao: 350,
    image: lasanha,
    ingredients: ["Massa", "Molho bolonhesa", "Presunto", "Muçarela"],
    name: "Lasanha",
  },
];
