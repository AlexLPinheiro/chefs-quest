import { StaticImageData } from "next/image";
import tomatoImage from "@/app/assets/image/tomate.png";
import eggImage from "@/app/assets/image/ovo.png";
import cheeseImage from "@/app/assets/image/queijo.png";

// Tipos compartilhados entre os componentes da kitchen
export type IngredientKey = "tomate" | "ovo" | "queijo";

export type MapPoint = {
  x: number;
  y: number;
};

export type StageIngredient = {
  key: IngredientKey;
  label: string;
  image: StaticImageData;
  target: number;
  position: MapPoint;
};

export type Ingredient = {
  key: IngredientKey;
  label: string;
  image: StaticImageData;
};

// Catálogo de ingredientes com posições no mapa
export const ingredientCatalog: Record<IngredientKey, StageIngredient> = {
  tomate: {
    key: "tomate",
    label: "Tomate",
    image: tomatoImage,
    target: 1,
    position: { x: 18, y: 40 },
  },
  ovo: {
    key: "ovo",
    label: "Ovo",
    image: eggImage,
    target: 1,
    position: { x: 20, y: 70 },
  },
  queijo: {
    key: "queijo",
    label: "Queijo",
    image: cheeseImage,
    target: 1,
    position: { x: 84, y: 46 },
  },
};

// Lista de ingredientes para a etapa de cozinha (drag-and-drop)
export const COOK_INGREDIENTS: Ingredient[] = [
  { key: "tomate", label: "Tomate", image: tomatoImage },
  { key: "ovo", label: "Ovos", image: eggImage },
  { key: "queijo", label: "Queijo", image: cheeseImage },
];

// Constantes de configuração
export const HOME_POSITION: MapPoint = { x: 80, y: 77 };
export const MOVE_DURATION = 1800;
export const STORAGE_PREFIX = "chefs-quest-kitchen-phase";
export const TIMER_SECONDS = 30;

// Resolve string de ingrediente para a chave tipada
export function getIngredientKey(ingredient: string): IngredientKey | null {
  const normalized = ingredient.toLowerCase();
  if (normalized.includes("tomate")) return "tomate";
  if (normalized.includes("ovo")) return "ovo";
  if (normalized.includes("queijo")) return "queijo";
  return null;
}

// Texto objetivo da fase
export function getStageObjective(phaseId: number) {
  if (phaseId === 1) {
    return "Busque os ingredientes para cozinhar a macarronada.";
  }
  return "Explore o mapa e encontre todos os ingredientes da receita.";
}
