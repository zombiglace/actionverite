/* Code complet mis à jour — GameScreen avec :
   - AUCUNE répétition de questions par joueur
   - Gestion séparée des questions utilisées POUR CHAQUE joueur
   - Timer moderne pour les défis contenant une durée (ex: "30 secondes", "1 minute", etc.)
*/

"use client"

import { useState, useEffect } from "react"
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

type Screen = "choice" | "challenge" | "timer"
type ChallengeType = "truth" | "dare"

type UsedMap = Record<string, { truths: Set<string>; dares: Set<string> }>

export function GameScreen({ players, gameMode, difficulty, onBack, onRestart }: GameScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [screen, setScreen] = useState<Screen>("choice")
  const [challengeType, setChallengeType] = useState<ChallengeType>("truth")
  const [currentChallenge, setCurrentChallenge] = useState("")

  // Map par joueur pour éviter toute répétition
  const [usedByPlayer, setUsedByPlayer] = useState<UsedMap>(() => {
    const map: UsedMap = {}
    players.forEach((p) => {
      map[p] = { truths: new Set(), dares: new Set() }
    })
    return map
  })

  // Timer
  const [timerDuration, setTimerDuration] = useState<number>(0) // en secondes
  const [timerRemaining, setTimerRemaining] = useState<number>(0)
  const [timerActive, setTimerActive] = useState(false)

  const currentPlayer = players[currentPlayerIndex]
  const gameData = getGameData(gameMode)

  // Détection automatique d'une durée dans le défi
  const extractTime = (challenge: string): number => {
    const match = challenge.match(/(\d+) ?(seconde|secondes|minute|minutes)/i)
    if (!match) return 0

    const value = parseInt(match[1])
    const unit = match[2].toLowerCase()

    if (unit.includes("minute")) return value * 60
    return value
  }

  const getRandomItem = (items: string[], used: Set<string>) => {
    const available = items.filter((i) => !used.has(i))

    if (available.length === 0) {
      // si plus rien de disponible → reset
      return items[Math.floor(Math.random() * items.length)]
    }

    return available[Math.floor(Math.random() * available.length)]
  }

  const handleChoice = (choice: ChallengeType) => {
    setChallengeType(choice)

    const items = choice === "truth" ? gameData.truths[difficulty] : gameData.dares[difficulty]
    const used = usedByPlayer[currentPlayer][choice === "truth" ? "truths" : "dares"]

    const challenge = getRandomItem(items, used)

    // mise à jour du used map
    setUsedByPlayer((prev) => ({
      ...prev,
      [currentPlayer]: {
        truths: choice === "truth" ? new Set([...prev[currentPlayer].truths, challenge]) : prev[currentPlayer].truths,
        dares: choice === "dare" ? new Set([...prev[currentPlayer].dares, challenge]) : prev[currentPlayer].dares,
      },
    }))

    setCurrentChallenge(challenge)

    const duration = extractTime(challenge)
    if (duration > 0) {
      setTimerDuration(duration)
      setTimerRemaining(duration)
      setTimerActive(true)
      setScreen("timer")
    } else {
      setScreen("challenge")
    }
  }

  // Timer logique
  useEffect(() => {
    if (!timerActive) return
    if (timerRemaining <= 0) {
      setTimerActive(false)
      return
    }

    const interval = setInterval(() => {
      setTimerRemaining((t) => t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, timerRemaining])

  const handleNext = () => {
    setScreen("choice")
    setCurrentChallenge("")
    setCurrentPlayerIndex((i) => (i + 1) % players.length)
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`
  }

  const getDifficultyLabel = () => {
    switch (difficulty) {
      case "soft": return "Soft"
      case "medium": return "Medium"
      case "hot": return "HOT"
    }
  }

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "soft": return "bg-secondary text-secondary-foreground"
      case "medium": return "bg-primary text-primary-foreground"
      case "hot": return "bg-accent text-accent-foreground"
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <Button variant="outline" size="icon" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Card */}
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

        {/* CHOIX TRUE/FALSE */}
        {screen === "choice" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-center text-muted-foreground">Choisis ton destin...</p>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleChoice("truth")} className="h-32 text-xl font-bold bg-secondary hover:bg-secondary/90 flex flex-col gap-2">
                <Sparkles className="h-8 w-8" /> Vérité
              </Button>
              <Button onClick={() => handleChoice("dare")} className="h-32 text-xl font-bold bg-primary hover:bg-primary/90 flex flex-col gap-2">
                <Sparkles className="h-8 w-8" /> Action
              </Button>
            </div>
          </div>
        )}

        {/* AFFICHAGE DU DEFIS */}
        {screen === "challenge" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor()}`}>
                {challengeType === "truth" ? "Vérité" : "Action"}
              </span>
            </div>
            <p className="text-lg text-center leading-relaxed min-h-[100px] flex items-center justify-center">
              {currentChallenge}
            </p>
            <Button onClick={handleNext} className="w-full" size="lg">Joueur suivant</Button>
          </div>
        )}

        {/* TIMER MODERNE */}
        {screen === "timer" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-center text-2xl font-bold text-primary">Défi avec temps !</h3>
            <p className="text-lg text-center min-h-[80px] flex items-center justify-center">{currentChallenge}</p>

            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full border-4 border-primary flex items-center justify-center text-4xl font-bold">
                {formatTime(timerRemaining)}
              </div>

              {!timerActive && (
                <Button onClick={() => setScreen("challenge")} className="w-full" size="lg">
                  Continuer
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Liste des joueurs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {players.map((p, i) => (
          <div key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${i === currentPlayerIndex ? "bg-primary text-primary-foreground scale-105" : "bg-muted text-muted-foreground"}`}>
            {p}
          </div>
        ))}
      </div>
    </div>
  )
}
