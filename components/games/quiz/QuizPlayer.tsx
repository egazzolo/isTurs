"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { QuizContentType, QuizQuestionType } from "./types";

interface Props {
  activityId: string;
  content: QuizContentType;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function QuizPlayer({ activityId, content }: Props) {
  const questions: QuizQuestionType[] = content.settings.shuffleQuestions
    ? shuffle(content.questions)
    : content.questions;

  const [qIdx, setQIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selectedId: string; correct: boolean }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const current = questions[qIdx];
  const options = content.settings.shuffleOptions
    ? shuffle(current.options)
    : current.options;

  useEffect(() => {
    setSelectedId(null);
    setConfirmed(false);
    if (current.timeLimitSec) {
      setTimeLeft(current.timeLimitSec);
    } else {
      setTimeLeft(null);
    }
  }, [qIdx, current.timeLimitSec]);

  const handleTimeout = useCallback(() => {
    if (!confirmed) {
      setConfirmed(true);
      setAnswers((a) => [
        ...a,
        { questionId: current.id, selectedId: "", correct: false },
      ]);
    }
  }, [confirmed, current.id]);

  useEffect(() => {
    if (timeLeft === null || confirmed) return;
    if (timeLeft === 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, confirmed, handleTimeout]);

  function handleSelect(optId: string) {
    if (confirmed) return;
    setSelectedId(optId);
  }

  function handleConfirm() {
    if (!selectedId || confirmed) return;
    const isCorrect = current.options.find((o) => o.id === selectedId)?.correct ?? false;
    if (isCorrect) setScore((s) => s + 1);
    setConfirmed(true);
    setAnswers((a) => [...a, { questionId: current.id, selectedId, correct: isCorrect }]);
  }

  async function handleNext() {
    if (qIdx + 1 < questions.length) {
      setQIdx((i) => i + 1);
    } else {
      setFinished(true);
      setSubmitting(true);
      try {
        await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityId,
            score,
            maxScore: questions.length,
            payload: { answers },
          }),
        });
      } catch {
        toast.error("Could not save your result.");
      } finally {
        setSubmitting(false);
      }
    }
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold"
        >
          {score}/{questions.length}
        </motion.div>
        <h2 className="text-2xl font-bold">
          {score === questions.length ? "Perfect score!" : score > questions.length / 2 ? "Well done!" : "Keep practising!"}
        </h2>
        <p className="text-muted-foreground">
          You scored {score} out of {questions.length}.
        </p>
        {submitting && <p className="text-sm text-muted-foreground">Saving result…</p>}
        <Button onClick={() => { setQIdx(0); setScore(0); setAnswers([]); setFinished(false); }}>
          Play again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {qIdx + 1} of {questions.length}</span>
        {timeLeft !== null && (
          <span className={`font-mono font-medium ${timeLeft <= 5 ? "text-destructive" : ""}`}>
            {timeLeft}s
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">{current.prompt}</h2>

          <div className="grid gap-3">
            {options.map((opt) => {
              let variant: "default" | "outline" | "secondary" = "outline";
              if (confirmed) {
                if (opt.correct) variant = "default";
                else if (opt.id === selectedId) variant = "destructive" as "default";
              } else if (opt.id === selectedId) {
                variant = "secondary";
              }
              return (
                <Button
                  key={opt.id}
                  variant={variant as "default" | "outline" | "secondary"}
                  className="h-auto justify-start py-3 text-left"
                  onClick={() => handleSelect(opt.id)}
                  disabled={confirmed}
                >
                  {opt.text}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!confirmed ? (
              <Button onClick={handleConfirm} disabled={!selectedId}>
                Confirm
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {qIdx + 1 < questions.length ? "Next question" : "See results"}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
