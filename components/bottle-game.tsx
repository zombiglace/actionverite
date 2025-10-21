"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, ArrowLeft, Sparkles } from "lucide-react"
import { getGameData, type GameMode, type DifficultyLevel } from "@/lib/game-data"

interface BottleGameProps {
  players: string[]
  gameMode: GameMode
  difficulty: DifficultyLevel
  onBack: () => void
  onRestart: () => void
}

type Screen = "bottle" | "choice" | "challenge"
type ChallengeType = "truth" | "dare"

export function BottleGame({ players, gameMode, difficulty, onBack, onRestart }: BottleGameProps) {
  const [screen, setScreen] = useState<Screen>("bottle")
  const [selectedPlayer, setSelectedPlayer] = useState<string>("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [challengeType, setChallengeType] = useState<ChallengeType>("truth")
  const [currentChallenge, setCurrentChallenge] = useState("")
  const [usedTruths, setUsedTruths] = useState<Set<string>>(new Set())
  const [usedDares, setUsedDares] = useState<Set<string>>(new Set())

  const gameData = getGameData(gameMode)

  const getRandomItem = (items: string[], usedItems: Set<string>) => {
    const availableItems = items.filter((item) => !usedItems.has(item))

    if (availableItems.length === 0) {
      return items[Math.floor(Math.random() * items.length)]
    }

    return availableItems[Math.floor(Math.random() * availableItems.length)]
  }

  const spinBottle = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const spins = 3 + Math.random() * 2
    const randomAngle = Math.random() * 360
    const finalRotation = rotation + spins * 360 + randomAngle

    setRotation(finalRotation)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * players.length)
      setSelectedPlayer(players[randomIndex])
      setIsSpinning(false)
      setScreen("choice")
    }, 2500)
  }

  const handleChoice = (choice: ChallengeType) => {
    setChallengeType(choice)
    const items = choice === "truth" ? gameData.truths[difficulty] : gameData.dares[difficulty]
    const usedItems = choice === "truth" ? usedTruths : usedDares
    const challenge = getRandomItem(items, usedItems)

    if (choice === "truth") {
      setUsedTruths(new Set([...usedTruths, challenge]))
    } else {
      setUsedDares(new Set([...usedDares, challenge]))
    }

    setCurrentChallenge(challenge)
    setScreen("challenge")
  }

  const handleNext = () => {
    setScreen("bottle")
    setCurrentChallenge("")
    setSelectedPlayer("")
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

      {screen === "bottle" && (
        <Card className="p-8 space-y-6 shadow-xl">
          <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor()}`}>
              Niveau: {getDifficultyLabel()}
            </span>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Jeu de la Bouteille
            </h2>
            <p className="text-muted-foreground">Fais tourner la bouteille !</p>
          </div>

          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border-2 border-dashed border-muted-foreground/20" />

            {players.map((player, index) => {
              const angle = (360 / players.length) * index
              const radius = 110
              const x = radius * Math.cos((angle - 90) * (Math.PI / 180))
              const y = radius * Math.sin((angle - 90) * (Math.PI / 180))

              return (
                <div
                  key={index}
                  className="absolute px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {player}
                </div>
              )
            })}

            <div
              className="absolute transition-transform duration-2500 ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: isSpinning ? "2500ms" : "0ms",
              }}
            >
              <svg width="120" height="40" viewBox="0 0 120 40" className="drop-shadow-lg">
                <defs>
                  <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="oklch(0.62 0.28 340)" />
                    <stop offset="50%" stopColor="oklch(0.48 0.24 290)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 30)" />
                  </linearGradient>
                </defs>
                <ellipse cx="20" cy="20" rx="8" ry="12" fill="url(#bottleGradient)" opacity="0.9" />
                <rect x="28" y="15" width="70" height="10" rx="2" fill="url(#bottleGradient)" opacity="0.9" />
                <polygon points="98,15 110,20 98,25" fill="url(#bottleGradient)" />
              </svg>
            </div>
          </div>

          <Button onClick={spinBottle} disabled={isSpinning} className="w-full text-lg h-14" size="lg">
            {isSpinning ? "La bouteille tourne..." : "Faire tourner"}
          </Button>
        </Card>
      )}

      {screen === "choice" && (
        <Card className="p-8 space-y-6 shadow-xl animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">La bouteille a choisi</p>
            <h3 className="text-4xl font-bold text-primary">{selectedPlayer}</h3>
          </div>

          <div className="space-y-4">
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
        </Card>
      )}

      {screen === "challenge" && (
        <Card className="p-8 space-y-6 shadow-xl animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-primary">{selectedPlayer}</h3>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor()}`}>
              {challengeType === "truth" ? "Vérité" : "Action"}
            </span>
          </div>

          <p className="text-lg text-center leading-relaxed text-balance min-h-[100px] flex items-center justify-center">
            {currentChallenge}
          </p>

          <Button onClick={handleNext} className="w-full" size="lg">
            Prochain tour
          </Button>
        </Card>
      )}
    </div>
  )
}
