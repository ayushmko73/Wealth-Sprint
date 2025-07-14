import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameDashboard from "./components/game/GameDashboard";
import { Toaster } from "./components/ui/sonner";
import "@fontsource/inter";

const queryClient = new QueryClient();

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    // Initialize game  
    const timer = setTimeout(() => {
      setGameStarted(true);
      setShowGame(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!showGame) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#3a3a3a] mb-4">Wealth Sprint</h1>
          <p className="text-lg text-[#3a3a3a] opacity-70">Loading your financial journey...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#f5f0e6] overflow-x-hidden">
        <GameDashboard />
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
