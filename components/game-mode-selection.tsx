"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dices, Disc, Flame, ArrowLeft } from "lucide-react"

interface GameModeSelectionProps {
  onSelect: (mode: "classic" | "wheel" | "bottle") => void
  onBack: () => void
}

export function GameModeSelection({ onSelect, onBack }: GameModeSelectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Mode de Jeu
        </h1>
        <p className="text-lg text-muted-foreground">Comment voulez-vous jouer ?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-primary group"
          onClick={() => onSelect("classic")}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Flame className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Classique</h2>
              <p className="text-sm text-muted-foreground">Le jeu traditionnel avec niveaux de difficulté</p>
            </div>
            <Button size="lg" className="w-full">
              Jouer
            </Button>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-secondary group"
          onClick={() => onSelect("wheel")}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <Dices className="w-10 h-10 text-secondary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-secondary">Roulette</h2>
              <p className="text-sm text-muted-foreground">La roue décide qui joue</p>
            </div>
            <Button size="lg" variant="secondary" className="w-full">
              Jouer
            </Button>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-accent group"
          onClick={() => onSelect("bottle")}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Disc className="w-10 h-10 text-accent" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-accent">Bouteille</h2>
              <p className="text-sm text-muted-foreground">La bouteille choisit pour toi</p>
            </div>
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
              Jouer
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
