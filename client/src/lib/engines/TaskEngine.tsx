import { GameScenario, PlayerStats } from "../types/GameTypes";
import { scenarioTemplates } from "./ScenarioData";

export function generateInitialScenarios(count: number): GameScenario[] {
  const scenarios: GameScenario[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = scenarioTemplates[Math.floor(Math.random() * scenarioTemplates.length)];
    const scenario: GameScenario = {
      id: `scenario_${Date.now()}_${i}`,
      category: template.category,
      title: template.title,
      description: template.description,
      context: template.context,
      options: template.options.map((option, index) => ({
        id: `option_${index}`,
        text: option.text,
        consequences: option.consequences,
      })),
      rarity: template.rarity,
      requiredStats: template.requiredStats,
    };
    scenarios.push(scenario);
  }
  
  return scenarios;
}

export function generateScenarioBasedOnStats(playerStats: PlayerStats): GameScenario {
  // Filter scenarios based on player stats
  const suitableScenarios = scenarioTemplates.filter(template => {
    if (!template.requiredStats) return true;
    
    return Object.entries(template.requiredStats).every(([key, value]) => {
      if (value === undefined) return true;
      return (playerStats as any)[key] >= value;
    });
  });
  
  const template = suitableScenarios[Math.floor(Math.random() * suitableScenarios.length)];
  
  return {
    id: `scenario_${Date.now()}`,
    category: template.category,
    title: template.title,
    description: template.description,
    context: template.context,
    options: template.options.map((option, index) => ({
      id: `option_${index}`,
      text: option.text,
      consequences: option.consequences,
    })),
    rarity: template.rarity,
    requiredStats: template.requiredStats,
  };
}

export function getScenariosByCategory(category: string): GameScenario[] {
  return scenarioTemplates
    .filter(template => template.category === category)
    .map(template => ({
      id: `scenario_${Date.now()}_${Math.random()}`,
      category: template.category,
      title: template.title,
      description: template.description,
      context: template.context,
      options: template.options.map((option, index) => ({
        id: `option_${index}`,
        text: option.text,
        consequences: option.consequences,
      })),
      rarity: template.rarity,
      requiredStats: template.requiredStats,
    }));
}
