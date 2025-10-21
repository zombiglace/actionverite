import { GameContainer } from "@/components/game-container"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <ThemeToggle />
      <GameContainer />
    </main>
  )
}
