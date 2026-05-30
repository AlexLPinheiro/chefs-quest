"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { phases } from "../../_data/phases";
import { STORAGE_PREFIX, type IngredientKey } from "../_data/ingredients";
import { quizBank } from "../_data/quiz-bank";
import baseStyles from "../kitchen.module.css";
import styles from "./quiz.module.css";

function parseIngredientKey(value: string | null): IngredientKey {
  if (value === "ovo" || value === "queijo") return value;
  return "tomate";
}

// Wrapper com Suspense para useSearchParams
export default function QuizPage() {
  return (
    <Suspense>
      <QuizPageContent />
    </Suspense>
  );
}

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phaseId = Number(searchParams.get("phase") ?? "1");
  const ingredientKey = parseIngredientKey(searchParams.get("ingredient"));
  const userId = searchParams.get("uid") ?? "";

  const phase = phases.find((item) => item.id === phaseId) ?? phases[0];
  const question = quizBank[ingredientKey];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  // Marca ingrediente como coletado no localStorage
  function markIngredientAsCollected() {
    const storageKey = `${STORAGE_PREFIX}-${userId}-${phase.id}`;
    const storedValue = window.localStorage.getItem(storageKey);
    const collected = storedValue ? (JSON.parse(storedValue) as string[]) : [];

    if (!collected.includes(ingredientKey)) {
      collected.push(ingredientKey);
    }

    window.localStorage.setItem(storageKey, JSON.stringify(collected));
  }

  // Valida resposta e redireciona se correto
  function handleConfirm() {
    if (selectedIndex === null) return;

    if (selectedIndex !== question.correctIndex) {
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

      {/* Cabeçalho do quiz */}
      <section className={styles.header}>
        <span className={styles.badge}>QUIZ: {phase.name}</span>
        <h1 className={styles.title}>MESTRE DAS RECEITAS</h1>
      </section>

      {/* Indicador de progresso */}
      <section className={styles.progressCard} aria-label="Progresso do quiz">
        <span className={styles.progressLabel}>Questão 1 de 1</span>
        <div className={styles.progressDots} aria-hidden="true">
          <span className={`${styles.progressDot} ${styles.progressDotActive}`} />
        </div>
      </section>

      {/* Pergunta */}
      <section className={styles.questionCard}>
        <div className={styles.questionBadge} aria-hidden="true">
          <span className={styles.questionBadgeDot} />
        </div>
        <p className={styles.questionText}>{question.title}</p>
      </section>

      {/* Alternativas */}
      <section className={styles.options} aria-label="Alternativas">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            className={`${styles.option} ${index === selectedIndex ? styles.optionSelected : ""}`}
            onClick={() => {
              setSelectedIndex(index);
              setStatus("idle");
            }}
          >
            <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
            <span className={styles.optionLabel}>{option}</span>
          </button>
        ))}
      </section>

      <Button className={styles.confirmButton} onClick={handleConfirm} disabled={selectedIndex === null}>
        CONFIRMAR RESPOSTA
      </Button>

      {/* Feedback de resultado */}
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
