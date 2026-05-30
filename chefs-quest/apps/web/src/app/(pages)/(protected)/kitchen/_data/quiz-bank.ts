import { IngredientKey } from "../_data/ingredients";

// Banco de perguntas do quiz por ingrediente
export type QuizQuestion = {
  title: string;
  options: string[];
  correctIndex: number;
};

export const quizBank: Record<IngredientKey, QuizQuestion> = {
  tomate: {
    title: "Qual é o ingrediente principal que dá a base vermelha e saborosa para o molho da Macarronada?",
    options: ["Cenouras trituradas", "Tomates frescos maduros", "Azeite de dendê"],
    correctIndex: 1,
  },
  ovo: {
    title: "Qual ingrediente entra na missão e ajuda a deixar o prato mais completo?",
    options: ["Ovos", "Morango", "Pão de queijo"],
    correctIndex: 0,
  },
  queijo: {
    title: "Qual ingrediente costuma finalizar o prato com mais sabor e cremosidade?",
    options: ["Queijo ralado", "Gelatina", "Chocolate"],
    correctIndex: 0,
  },
};
