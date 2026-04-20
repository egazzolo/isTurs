"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareLinkDialog } from "@/components/shared/ShareLinkDialog";
import type { QuizContentType, QuizQuestionType } from "./types";

interface Props {
  activityId?: string;
  initialTitle?: string;
  initialContent?: QuizContentType;
}

function emptyQuestion(): QuizQuestionType {
  return {
    id: nanoid(),
    prompt: "",
    options: [
      { id: nanoid(), text: "", correct: true },
      { id: nanoid(), text: "", correct: false },
    ],
  };
}

export function QuizEditor({ activityId, initialTitle = "", initialContent }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [questions, setQuestions] = useState<QuizQuestionType[]>(
    initialContent?.questions ?? [emptyQuestion()]
  );
  const [saving, setSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);

  function addQuestion() {
    setQuestions((q) => [...q, emptyQuestion()]);
  }

  function removeQuestion(idx: number) {
    setQuestions((q) => q.filter((_, i) => i !== idx));
  }

  function updatePrompt(idx: number, prompt: string) {
    setQuestions((q) => q.map((question, i) => (i === idx ? { ...question, prompt } : question)));
  }

  function updateOption(qIdx: number, oIdx: number, text: string) {
    setQuestions((q) =>
      q.map((question, i) =>
        i === qIdx
          ? {
              ...question,
              options: question.options.map((opt, j) => (j === oIdx ? { ...opt, text } : opt)),
            }
          : question
      )
    );
  }

  function setCorrect(qIdx: number, oIdx: number) {
    setQuestions((q) =>
      q.map((question, i) =>
        i === qIdx
          ? {
              ...question,
              options: question.options.map((opt, j) => ({ ...opt, correct: j === oIdx })),
            }
          : question
      )
    );
  }

  function addOption(qIdx: number) {
    setQuestions((q) =>
      q.map((question, i) =>
        i === qIdx
          ? { ...question, options: [...question.options, { id: nanoid(), text: "", correct: false }] }
          : question
      )
    );
  }

  function removeOption(qIdx: number, oIdx: number) {
    setQuestions((q) =>
      q.map((question, i) =>
        i === qIdx
          ? { ...question, options: question.options.filter((_, j) => j !== oIdx) }
          : question
      )
    );
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    const hasEmpty = questions.some(
      (q) => !q.prompt.trim() || q.options.some((o) => !o.text.trim())
    );
    if (hasEmpty) {
      toast.error("Fill in all question prompts and options.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(activityId ? `/api/activities/${activityId}` : "/api/activities", {
        method: activityId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quiz",
          title,
          content: { questions, settings: { shuffleQuestions: false, shuffleOptions: true, showAnswersAtEnd: true } },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to save.");
        return;
      }

      toast.success("Activity saved!");
      setSavedSlug(data.slug);
      setShowShare(true);
      if (!activityId) router.replace(`/activities/${data.id}/edit`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Activity title</Label>
        <Input
          id="title"
          placeholder="e.g. Photosynthesis Quiz"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {questions.map((q, qIdx) => (
        <Card key={q.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Question {qIdx + 1}</CardTitle>
              {questions.length > 1 && (
                <Button size="icon" variant="ghost" onClick={() => removeQuestion(qIdx)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What is the question?"
              value={q.prompt}
              onChange={(e) => updatePrompt(qIdx, e.target.value)}
            />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Options — click circle to mark correct answer</p>
              {q.options.map((opt, oIdx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrect(qIdx, oIdx)}
                    className={`h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${
                      opt.correct ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}
                    aria-label={opt.correct ? "Correct answer" : "Mark as correct"}
                  />
                  <Input
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                  />
                  {q.options.length > 2 && (
                    <Button size="icon" variant="ghost" onClick={() => removeOption(qIdx, oIdx)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              {q.options.length < 6 && (
                <Button size="sm" variant="outline" onClick={() => addOption(qIdx)}>
                  <Plus className="h-3.5 w-3.5" />
                  Add option
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addQuestion} disabled={questions.length >= 50}>
        <Plus className="h-4 w-4" />
        Add question
      </Button>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save activity"}
        </Button>
        {savedSlug && (
          <Button variant="outline" onClick={() => setShowShare(true)}>
            Share link
          </Button>
        )}
      </div>

      {savedSlug && (
        <ShareLinkDialog
          slug={savedSlug}
          open={showShare}
          onOpenChange={setShowShare}
        />
      )}
    </div>
  );
}
