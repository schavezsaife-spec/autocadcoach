import { createFileRoute } from "@tanstack/react-router";
import { quiz } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GuestGate } from "@/components/coach/GuestGate";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz — AutoCAD Coach" }] }),
  component: QuizPage,
});

function QuizPage() {
  const { state, set } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  const answers = state.quizAnswers;

  const correctCount = quiz.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0
  );

  const pick = (i: number, choice: number) => {
    if (answers[i] !== undefined) return;
    set((s) => {
      const isCorrect = choice === quiz[i].answer;
      const newAnswers = { ...s.quizAnswers, [i]: choice };
      const xpGain = isCorrect ? quiz[i].xp : 0;
      if (isCorrect) toast.success(`+${xpGain} XP — Correct!`);
      else toast.error("Not quite. Try the next one!");
      return { quizAnswers: newAnswers, quizXp: s.quizXp + xpGain };
    });
  };

  const reset = () => set({ quizAnswers: {}, quizXp: 0 });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Knowledge Quiz</h1>
          <p className="text-muted-foreground mt-1">Earn XP for every correct answer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Trophy className="size-3 mr-1" /> {state.quizXp} XP
          </Badge>
          <Badge variant="outline">{correctCount}/{quiz.length} correct</Badge>
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="size-4 mr-1" /> Reset</Button>
        </div>
      </header>

      <GuestGate isAuthenticated={isAuthed}>
      <div className="space-y-4">
        {quiz.map((q, i) => {
          const ans = answers[i];
          const answered = ans !== undefined;
          return (
            <div key={i} className="rounded-2xl bg-card border border-border p-4 sm:p-5">
              <div className="font-semibold">{i + 1}. {q.q}</div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.choices.map((c, ci) => {
                  const isPicked = ans === ci;
                  const isAnswer = q.answer === ci;
                  return (
                    <button
                      key={ci}
                      onClick={() => pick(i, ci)}
                      disabled={answered}
                      className={cn(
                        "text-left rounded-lg border px-4 py-3 text-sm transition-colors flex items-center justify-between gap-2",
                        !answered && "border-border hover:border-primary/40 hover:bg-secondary",
                        answered && isAnswer && "border-primary/40 bg-primary/10 text-primary",
                        answered && isPicked && !isAnswer && "border-destructive/40 bg-destructive/10 text-destructive"
                      )}
                    >
                      <span>{c}</span>
                      {answered && isAnswer && <CheckCircle2 className="size-4" />}
                      {answered && isPicked && !isAnswer && <XCircle className="size-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      </GuestGate>
    </div>
  );
}