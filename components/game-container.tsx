"use client"

import { useState } from "react"
import { ModeSelection } from "./mode-selection"
import { WelcomeScreen } from "./welcome-screen"
import { GameModeSelection } from "./game-mode-selection"
import { DifficultySelection } from "./difficulty-selection"
import { GameScreen } from "./game-screen"
import { SpinWheel } from "./spin-wheel"
import { BottleGame } from "./bottle-game"
import type { GameMode, DifficultyLevel } from "@/lib/game-data"

type Screen = "mode" | "players" | "game-mode" | "difficulty" | "classic" | "wheel" | "bottle"

export function GameContainer() {
  const [screen, setScreen] = useState<Screen>("mode")
  const [gameMode, setGameMode] = useState<GameMode>("friends")
  const [players, setPlayers] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("soft")
  const [selectedGameMode, setSelectedGameMode] = useState<"classic" | "wheel" | "bottle">("classic")

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode)
    setScreen("players")
  }

  const handlePlayersSet = (playerNames: string[]) => {
    setPlayers(playerNames)
    setScreen("game-mode")
  }

  const handleGameModeSelect = (mode: "classic" | "wheel" | "bottle") => {
    setSelectedGameMode(mode)
    setScreen("difficulty")
  }

  const handleDifficultySelect = (level: DifficultyLevel) => {
    setDifficulty(level)
    setScreen(selectedGameMode)
  }

  const handleRestart = () => {
    setScreen("mode")
    setPlayers([])
  }

  const handleBack = () => {
    if (screen === "players") {
      setScreen("mode")
    } else if (screen === "game-mode") {
      setScreen("players")
    } else if (screen === "difficulty") {
      setScreen("game-mode")
    } else {
      setScreen("difficulty")
    }
  }

  if (screen === "mode") {
    return <ModeSelection onSelect={handleModeSelect} />
  }

  if (screen === "players") {
    return <WelcomeScreen onStart={handlePlayersSet} onBack={handleBack} />
  }

  if (screen === "game-mode") {
    return <GameModeSelection onSelect={handleGameModeSelect} onBack={handleBack} />
  }

  if (screen === "difficulty") {
    return <DifficultySelection onSelect={handleDifficultySelect} onBack={handleBack} />
  }

  if (screen === "wheel") {
    return (
      <SpinWheel
        players={players}
        gameMode={gameMode}
        difficulty={difficulty}
        onBack={handleBack}
        onRestart={handleRestart}
      />
    )
  }

  if (screen === "bottle") {
    return (
      <BottleGame
        players={players}
        gameMode={gameMode}
        difficulty={difficulty}
        onBack={handleBack}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <GameScreen
      players={players}
      gameMode={gameMode}
      difficulty={difficulty}
      onBack={handleBack}
      onRestart={handleRestart}
    />
  )
}
