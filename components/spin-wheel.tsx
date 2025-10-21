"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, ArrowLeft, Sparkles } from "lucide-react"
import { getGameData, type GameMode, type DifficultyLevel } from "@/lib/game-data"

interface SpinWheelProps {
  players: string[]
  gameMode: GameMode
  difficulty: DifficultyLevel
  onBack: () => void
  onRestart: () => void
}

type Screen = "wheel" | "choice" | "challenge"
type ChallengeType = "truth" | "dare"

export function SpinWheel({ players, gameMode, difficulty, onBack, onRestart }: SpinWheelProps) {
  const [screen, setScreen] = useState<Screen>("wheel")
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

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const spins = 5 + Math.random() * 3
    const randomIndex = Math.floor(Math.random() * players.length)
    const degreesPerPlayer = 360 / players.length
    const finalRotation = rotation + spins * 360 + randomIndex * degreesPerPlayer

    setRotation(finalRotation)

    setTimeout(() => {
      setSelectedPlayer(players[randomIndex])
      setIsSpinning(false)
      setScreen("choice")
    }, 3000)
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
    setScreen("wheel")
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

      {screen === "wheel" && (
        <Card className="p-8 space-y-6 shadow-xl">
          <div className="flex justify-center">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor()}`}>
              Niveau: {getDifficultyLabel()}
            </span>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Roulette
            </h2>
            <p className="text-muted-foreground">Fais tourner la roue !</p>
          </div>

          <div className="relative w-80 h-80 mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
              <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[36px] border-t-foreground drop-shadow-2xl" />
            </div>

            <div className="relative w-full h-full drop-shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-accent z-10 shadow-2xl border-4 border-background" />

              <svg
                className="w-full h-full transition-transform ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isSpinning ? "3000ms" : "0ms",
                }}
                viewBox="0 0 200 200"
              >
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "oklch(0.62 0.28 340)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "oklch(0.72 0.28 340)", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "oklch(0.48 0.24 290)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "oklch(0.58 0.24 290)", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "oklch(0.65 0.22 30)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "oklch(0.75 0.22 30)", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "oklch(0.55 0.25 200)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "oklch(0.65 0.25 200)", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "oklch(0.6 0.23 120)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "oklch(0.7 0.23 120)", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "oklch(0.58 0.26 60)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "oklch(0.68 0.26 60)", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {players.map((player, index) => {
                  const angle = (360 / players.length) * index
                  const nextAngle = (360 / players.length) * (index + 1)
                  const gradients = [
                    "url(#grad1)",
                    "url(#grad2)",
                    "url(#grad3)",
                    "url(#grad4)",
                    "url(#grad5)",
                    "url(#grad6)",
                  ]

                  const startAngle = (angle - 90) * (Math.PI / 180)
                  const endAngle = (nextAngle - 90) * (Math.PI / 180)
                  const x1 = 100 + 100 * Math.cos(startAngle)
                  const y1 = 100 + 100 * Math.sin(startAngle)
                  const x2 = 100 + 100 * Math.cos(endAngle)
                  const y2 = 100 + 100 * Math.sin(endAngle)
                  const largeArc = nextAngle - angle > 180 ? 1 : 0

                  const textAngle = ((angle + nextAngle) / 2 - 90) * (Math.PI / 180)
                  const textX = 100 + 65 * Math.cos(textAngle)
                  const textY = 100 + 65 * Math.sin(textAngle)
                  const textRotation = (angle + nextAngle) / 2

                  const displayName = player.length > 10 ? player.substring(0, 10) + "..." : player

                  return (
                    <g key={index}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={gradients[index % gradients.length]}
                        stroke="white"
                        strokeWidth="3"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="14"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        style={{
                          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                        }}
                      >
                        {displayName}
                      </text>
                    </g>
                  )
                })}
                <circle cx="100" cy="100" r="100" fill="none" stroke="white" strokeWidth="4" />
              </svg>
            </div>
          </div>

          <Button onClick={spinWheel} disabled={isSpinning} className="w-full text-lg h-14" size="lg">
            {isSpinning ? "La roue tourne..." : "Faire tourner"}
          </Button>
        </Card>
      )}

      {screen === "choice" && (
        <Card className="p-8 space-y-6 shadow-xl animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">C'est le tour de</p>
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
