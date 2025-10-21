"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Flame, Snowflake, Zap, ArrowLeft } from "lucide-react"
import type { DifficultyLevel } from "@/lib/game-data"

interface DifficultySelectionProps {
  onSelect: (level: DifficultyLevel) => void
  onBack: () => void
}

export function DifficultySelection({ onSelect, onBack }: DifficultySelectionProps) {
  const getDifficultyColor = (level: DifficultyLevel) => {
    switch (level) {
      case "soft":
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground border-secondary"
      case "medium":
        return "bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
      case "hot":
        return "bg-accent hover:bg-accent/90 text-accent-foreground border-accent"
    }
  }

  const getDifficultyIcon = (level: DifficultyLevel) => {
    switch (level) {
      case "soft":
        return <Snowflake className="w-12 h-12" />
      case "medium":
        return <Zap className="w-12 h-12" />
      case "hot":
        return <Flame className="w-12 h-12" />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Niveau de Difficulté
        </h1>
        <p className="text-lg text-muted-foreground">Choisissez l'intensité du jeu</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-secondary group"
          onClick={() => onSelect("soft")}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              {getDifficultyIcon("soft")}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-secondary">Soft</h2>
              <p className="text-sm text-muted-foreground">Questions et défis légers et amusants</p>
            </div>
            <Button size="lg" variant="secondary" className="w-full">
              Choisir
            </Button>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-primary group"
          onClick={() => onSelect("medium")}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {getDifficultyIcon("medium")}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary">Medium</h2>
              <p className="text-sm text-muted-foreground">Ça commence à devenir intéressant</p>
            </div>
            <Button size="lg" className="w-full">
              Choisir
            </Button>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:scale-105 transition-transform duration-300 border-2 hover:border-accent group"
          onClick={() => onSelect("hot")}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              {getDifficultyIcon("hot")}
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-accent">HOT</h2>
              <p className="text-sm text-muted-foreground">Pour les plus audacieux</p>
            </div>
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
              Choisir
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
