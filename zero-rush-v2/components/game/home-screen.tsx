"use client";

import { useState } from "react";
import type { Difficulty } from "@/lib/types/game";
import { DIFFICULTY_CONFIG } from "@/lib/game/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HomeScreenProps {
  /** Callback when difficulty is selected and player starts */
  onStart: (difficulty: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "challenger"];

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4">
      {/* Logo/Title */}
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-linear-to-r from-sky-500 to-amber-500 bg-clip-text text-transparent bg-size-[200%_200%] animate-gradient">
          Zero Rush
        </h1>
        <p className="text-lg text-muted-foreground mt-3">
          Find the arrangements that produce the lowest and highest values
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <h2 className="text-lg font-semibold">Select Difficulty</h2>

        <div className="grid grid-cols-2 gap-3 w-full">
          {DIFFICULTIES.map((diff) => {
            const config = DIFFICULTY_CONFIG[diff];
            const isSelected = selectedDifficulty === diff;
            const isChallenger = diff === "challenger";

            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                disabled={isChallenger}
                className={cn(
                  "flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all",
                  "text-left",
                  isSelected &&
                    !isChallenger &&
                    "border-primary bg-primary/10 shadow-md",
                  !isSelected &&
                    !isChallenger &&
                    "border-border hover:border-primary/50 hover:bg-muted/50",
                  isChallenger &&
                    "opacity-50 cursor-not-allowed border-border bg-muted/30"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-bold capitalize",
                      isSelected && !isChallenger && "text-primary"
                    )}
                  >
                    {diff}
                  </span>
                  {isChallenger && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      Locked
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {config.cards} cards
                </span>
                <span className="text-xs text-muted-foreground">
                  {config.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <Button
        onClick={() => onStart(selectedDifficulty)}
        size="lg"
        className="min-w-[200px] text-lg h-14"
      >
        Start Game
      </Button>

      {/* Quick info */}
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>
          Arrange cards to create equations. Find the arrangements that produce
          the lowest value (dusk) and highest value (dawn).
        </p>
      </div>
    </div>
  );
}
