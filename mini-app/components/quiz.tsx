"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
};

const QUESTIONS: Question[] = [
  {
    question: "Who won the FIFA World Cup in 2018?",
    options: ["France", "Croatia", "Brazil", "Germany"],
    answerIndex: 0,
  },
  {
    question: "Which player has won the most Ballon d’Or awards?",
    options: ["Lionel Messi", "Cristiano Ronaldo", "Zinedine Zidane", "Michel Platini"],
    answerIndex: 0,
  },
  {
    question: "What is the offside rule in football?",
    options: [
      "A player is offside if they are ahead of the ball and the last defender",
      "A player is offside if they are behind the ball",
      "A player is offside if they are in the opponent's penalty area",
      "A player is offside if they are in their own half",
    ],
    answerIndex: 0,
  },
  {
    question: "Which club has the most Champions League titles?",
    options: ["Real Madrid", "Barcelona", "AC Milan", "Liverpool"],
    answerIndex: 0,
  },
  {
    question: "Who scored the “Hand of God” goal?",
    options: ["Diego Maradona", "Zinedine Zidane", "Lionel Messi", "Cristiano Ronaldo"],
    answerIndex: 0,
  },
  {
    question: "Which country has won the most World Cups?",
    options: ["Brazil", "Germany", "Italy", "Argentina"],
    answerIndex: 0,
  },
  {
    question: "What is the maximum number of substitutions allowed in a match?",
    options: ["3", "4", "5", "6"],
    answerIndex: 1,
  },
  {
    question: "Which player holds the record for most goals in a single World Cup?",
    options: ["Just Fontaine", "Miroslav Klose", "Ronaldo", "Gerd Müller"],
    answerIndex: 0,
  },
  {
    question: "Which club won the first ever Premier League title?",
    options: ["Manchester United", "Arsenal", "Liverpool", "Chelsea"],
    answerIndex: 1,
  },
  {
    question: "What is the name of the trophy awarded to the World Cup winner?",
    options: ["FIFA World Cup Trophy", "World Cup Cup", "World Trophy", "FIFA Trophy"],
    answerIndex: 0,
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [shuffled, setShuffled] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    setShuffled(shuffleArray(QUESTIONS));
    const stored = localStorage.getItem("football-quiz-best");
    if (stored) setBestScore(Number(stored));
  }, []);

  const handleSelect = (index: number) => {
    if (selected !== null) return; // already answered
    setSelected(index);
    const isCorrect = index === shuffled[current].answerIndex;
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 < shuffled.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setShowResult(true);
        const newBest = Math.max(score + (isCorrect ? 1 : 0), bestScore ?? 0);
        setBestScore(newBest);
        localStorage.setItem("football-quiz-best", String(newBest));
      }
    }, 800);
  };

  const resetQuiz = () => {
    setShuffled(shuffleArray(QUESTIONS));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
  };

  const getMotivation = () => {
    if (score === 10) return "Legend!";
    if (score >= 7) return "Great job!";
    if (score >= 4) return "Nice try!";
    return "Keep practicing!";
  };

  if (shuffled.length === 0) return null;

  return (
    <main className="flex flex-col items-center gap-6 px-4 py-8 min-h-screen bg-white">
      <h1 className="text-2xl font-semibold text-blue-600">Football IQ Challenge</h1>

      {showResult ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-bold">
            You scored {score} out of {shuffled.length}!
          </div>
          <div className="text-xl">{getMotivation()}</div>
          {bestScore !== null && (
            <div className="text-sm text-muted-foreground">
              Best score: {bestScore}
            </div>
          )}
          <button
            onClick={resetQuiz}
            className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-xl border p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-medium">
              Question {current + 1} / {shuffled.length}
            </span>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{
                  width: `${((current + (selected !== null ? 1 : 0)) / shuffled.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h2 className="mb-4 text-lg font-medium">{shuffled[current].question}</h2>

          <div className="flex flex-col gap-3">
            {shuffled[current].options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = idx === shuffled[current].answerIndex;
              const bgClass = isSelected
                ? isCorrect
                  ? "bg-green-100"
                  : "bg-red-100"
                : "bg-white";
              const borderClass = isSelected
                ? isCorrect
                  ? "border-green-400"
                  : "border-red-400"
                : "border-gray-200";
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`flex items-center justify-between rounded-md border p-3 transition-colors ${bgClass} ${borderClass}`}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    <span className="ml-2">
                      {isCorrect ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
