"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, X, Play, ArrowLeft } from "lucide-react"

interface WelcomeScreenProps {
  onStart: (players: string[]) => void
  onBack: () => void
}

export function WelcomeScreen({ onStart, onBack }: WelcomeScreenProps) {
  const [players, setPlayers] = useState<string[]>(["", ""])
  const [error, setError] = useState("")

  const addPlayer = () => {
    if (players.length < 10) {
      setPlayers([...players, ""])
      setError("")
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index))
    }
  }

  const updatePlayer = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
    setError("")
  }

  const handleStart = () => {
    const validPlayers = players.filter((p) => p.trim() !== "")
    if (validPlayers.length < 2) {
      setError("Il faut au moins 2 joueurs pour commencer !")
      return
    }
    onStart(validPlayers)
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-balance">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Ajouter les joueurs
          </span>
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">Entrez les noms des participants</p>
      </div>

      <Card className="p-6 space-y-4 shadow-lg">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Joueurs</h2>
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Joueur ${index + 1}`}
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                className="flex-1"
              />
              {players.length > 2 && (
                <Button variant="outline" size="icon" onClick={() => removePlayer(index)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        {players.length < 10 && (
          <Button variant="outline" onClick={addPlayer} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un joueur
          </Button>
        )}

        <Button onClick={handleStart} className="w-full text-lg h-12 bg-primary hover:bg-primary/90" size="lg">
          <Play className="h-5 w-5 mr-2" />
          Continuer
        </Button>
      </Card>
    </div>
  )
}
