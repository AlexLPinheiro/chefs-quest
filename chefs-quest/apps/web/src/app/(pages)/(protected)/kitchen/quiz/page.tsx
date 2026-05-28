"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { phases } from "../../_data/phases";
import baseStyles from "../kitchen.module.css";
import styles from "./quiz.module.css";

type IngredientKey = "tomate" | "ovo" | "queijo";

type QuizQuestion = {
  title: string;
  options: string[];
  correctIndex: number;
};

const STORAGE_PREFIX = "chefs-quest-kitchen-phase";

const quizBank: Record<IngredientKey, QuizQuestion> = {
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

function getIngredientKey(value: string | null): IngredientKey {
  if (value === "ovo" || value === "queijo") {
    return value;
  }

  return "tomate";
}

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phaseId = Number(searchParams.get("phase") ?? "1");
  const ingredientKey = getIngredientKey(searchParams.get("ingredient"));

  const phase = phases.find((item) => item.id === phaseId) ?? phases[0];
  const question = quizBank[ingredientKey];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  function markIngredientAsCollected() {
    const storageKey = `${STORAGE_PREFIX}-${phase.id}`;
    const storedValue = window.localStorage.getItem(storageKey);
    const collected = storedValue ? (JSON.parse(storedValue) as string[]) : [];

    if (!collected.includes(ingredientKey)) {
      collected.push(ingredientKey);
    }

    window.localStorage.setItem(storageKey, JSON.stringify(collected));
  }

  function handleConfirm() {
    if (selectedIndex === null) {
      return;
    }

    const isCorrect = selectedIndex === question.correctIndex;

    if (!isCorrect) {
      setStatus("wrong");
      return;
    }

    setStatus("correct");
    markIngredientAsCollected();

    window.setTimeout(() => {
      router.push(`/kitchen?phase=${phase.id}&started=1`);
    }, 700);
  }

  return (
    <div className={styles.page}>
      <Link href={`/kitchen?phase=${phase.id}&started=1`} className={baseStyles.backButton} aria-label="Voltar">
        <ChevronLeft size={22} />
      </Link>

      <section className={styles.header}>
        <span className={styles.badge}>QUIZ: {phase.name}</span>
        <h1 className={styles.title}>MESTRE DAS RECEITAS</h1>
      </section>

      <section className={styles.progressCard} aria-label="Progresso do quiz">
        <span className={styles.progressLabel}>Questão 1 de 1</span>
        <div className={styles.progressDots} aria-hidden="true">
          <span className={`${styles.progressDot} ${styles.progressDotActive}`} />
        </div>
      </section>

      <section className={styles.questionCard}>
        <div className={styles.questionBadge} aria-hidden="true">
          <span className={styles.questionBadgeDot} />
        </div>

        <p className={styles.questionText}>{question.title}</p>
      </section>

      <section className={styles.options} aria-label="Alternativas">
        {question.options.map((option, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={option}
              type="button"
              className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
              onClick={() => {
                setSelectedIndex(index);
                setStatus("idle");
              }}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
              <span className={styles.optionLabel}>{option}</span>
            </button>
          );
        })}
      </section>

      <Button className={styles.confirmButton} onClick={handleConfirm} disabled={selectedIndex === null}>
        CONFIRMAR RESPOSTA
      </Button>

      {status !== "idle" && (
        <section className={`${styles.feedback} ${status === "correct" ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          <p className={styles.feedbackTitle}>
            {status === "correct" ? "Resposta correta" : "Tente novamente"}
          </p>
          <p className={styles.feedbackText}>
            {status === "correct"
              ? "Ingrediente confirmado. Voltando para o mapa..."
              : "Selecione outra alternativa e tente de novo."}
          </p>

          {status === "correct" ? (
            <Button asChild>
              <Link href={`/kitchen?phase=${phase.id}&started=1`}>Voltar ao mapa</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setStatus("idle")}>
              Fechar
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
