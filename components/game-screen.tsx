"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Sparkles, ArrowLeft } from "lucide-react"
import { getGameData, type GameMode, type DifficultyLevel } from "@/lib/game-data"

interface GameScreenProps {
  players: string[]
  gameMode: GameMode
  difficulty: DifficultyLevel
  onBack: () => void
  onRestart: () => void
}

type Screen = "choice" | "challenge"
type ChallengeType = "truth" | "dare"

export function GameScreen({ players, gameMode, difficulty, onBack, onRestart }: GameScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>("choice")
  const [challengeType, setChallengeType] = useState<ChallengeType>("truth")
  const [currentChallenge, setCurrentChallenge] = useState("")
  const [usedTruths, setUsedTruths] = useState<Set<string>>(new Set())
  const [usedDares, setUsedDares] = useState<Set<string>>(new Set())

  const currentPlayer = players[currentPlayerIndex]
  const gameData = getGameData(gameMode)

  const getRandomItem = (items: string[], usedItems: Set<string>) => {
    const availableItems = items.filter((item) => !usedItems.has(item))

    // If all items have been used, reset the used items
    if (availableItems.length === 0) {
      return items[Math.floor(Math.random() * items.length)]
    }

    return availableItems[Math.floor(Math.random() * availableItems.length)]
  }

  const handleChoice = (choice: ChallengeType) => {
    setChallengeType(choice)
    const items = choice === "truth" ? gameData.truths[difficulty] : gameData.dares[difficulty]
    const usedItems = choice === "truth" ? usedTruths : usedDares
    const challenge = getRandomItem(items, usedItems)

    // Add to used items
    if (choice === "truth") {
      setUsedTruths(new Set([...usedTruths, challenge]))
    } else {
      setUsedDares(new Set([...usedDares, challenge]))
    }

    setCurrentChallenge(challenge)
    setScreen("challenge")
  }

  const handleNext = () => {
    setScreen("choice")
    setCurrentChallenge("")
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
  }

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case "soft":
        return "Soft"
      case "medium":
        return "Medium"
      case "hot":
        return "HOT"
    }
  }

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "soft":
        return "bg-secondary text-secondary-foreground"
      case "medium":
        return "bg-primary text-primary-foreground"
      case "hot":
        return "bg-accent text-accent-foreground"
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button variant="outline" size="icon" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="p-8 space-y-6 shadow-xl">
        <div className="flex justify-center">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor()}`}>
            Niveau: {getDifficultyLabel()}
          </span>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">C'est le tour de</p>
          <h3 className="text-4xl font-bold text-primary animate-in zoom-in duration-300">{currentPlayer}</h3>
        </div>

        {screen === "choice" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-center text-muted-foreground">Choisis ton destin...</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleChoice("truth")}
                className="h-32 text-xl font-bold bg-secondary hover:bg-secondary/90 flex flex-col gap-2"
                size="lg"
              >
                <Sparkles className="h-8 w-8" />
                Vérité
              </Button>
              <Button
                onClick={() => handleChoice("dare")}
                className="h-32 text-xl font-bold bg-primary hover:bg-primary/90 flex flex-col gap-2"
                size="lg"
              >
                <Sparkles className="h-8 w-8" />
                Action
              </Button>
            </div>
          </div>
        )}

        {screen === "challenge" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor()}`}>
                {challengeType === "truth" ? "Vérité" : "Action"}
              </span>
            </div>
            <p className="text-lg text-center leading-relaxed text-balance min-h-[100px] flex items-center justify-center">
              {currentChallenge}
            </p>
            <Button onClick={handleNext} className="w-full" size="lg">
              Joueur suivant
            </Button>
          </div>
        )}
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {players.map((player, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              index === currentPlayerIndex
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {player}
          </div>
        ))}
      </div>
    </div>
  )
}
