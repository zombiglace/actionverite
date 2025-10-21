"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users } from "lucide-react"
import type { GameMode } from "@/lib/game-data"

interface ModeSelectionProps {
  onSelect: (mode: GameMode) => void
}

export function ModeSelection({ onSelect }: ModeSelectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Action ou Vérité
        </h1>
        <p className="text-lg text-muted-foreground">Choisis ton mode de jeu</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          className="p-8 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-primary group"
          onClick={() => onSelect("friends")}
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary">Entre Amis</h2>
              <p className="text-muted-foreground">Pour des soirées fun et délirantes avec tes potes</p>
            </div>
            <Button size="lg" className="w-full">
              Jouer entre amis
            </Button>
          </div>
        </Card>

        <Card
          className="p-8 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-accent group"
          onClick={() => onSelect("couple")}
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Heart className="w-12 h-12 text-accent" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-accent">En Couple</h2>
              <p className="text-muted-foreground">Pour pimenter ta relation et mieux te connaître</p>
            </div>
            <Button size="lg" variant="destructive" className="w-full bg-accent hover:bg-accent/90">
              Jouer en couple
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
