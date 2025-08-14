import React, { useEffect } from 'react';
import { useDecisionSystem } from '../../../lib/stores/useDecisionSystem';
import { useWealthSprintGame } from '../../../lib/stores/useWealthSprintGame';
import DecisionCard from './DecisionCard';
import DecisionResultScreen from './DecisionResultScreen';

const DecisionManager: React.FC = () => {
  const {
    showDecisionCard,
    showResultScreen,
    currentDecision,
    currentSession,
    gameDay,
    hasCompletedToday,
    checkAndStartTodaysDecisions
  } = useDecisionSystem();

  const { currentDay, updatePlayerStats, updateFinancialData } = useWealthSprintGame();

  // Sync game day with decision system
  useEffect(() => {
    if (currentDay !== gameDay) {
      useDecisionSystem.setState({ gameDay: currentDay, hasCompletedToday: false });
    }
  }, [currentDay, gameDay]);

  // Auto-start decisions when day changes or game loads
  useEffect(() => {
    if (!hasCompletedToday && currentDay > 0) {
      checkAndStartTodaysDecisions();
    }
  }, [currentDay, hasCompletedToday, checkAndStartTodaysDecisions]);

  // Apply decision consequences to game state
  useEffect(() => {
    const unsubscribe = useDecisionSystem.subscribe(
      (state) => state.allPlayerDecisions,
      (decisions) => {
        const latestDecision = decisions[decisions.length - 1];
        if (latestDecision && latestDecision.consequences) {
          const consequences = latestDecision.consequences;
          
          // Apply stat changes
          const statUpdates: any = {};
          const financialUpdates: any = {};
          
          if (consequences.emotion !== undefined) statUpdates.emotion = consequences.emotion;
          if (consequences.stress !== undefined) statUpdates.stress = consequences.stress;
          if (consequences.karma !== undefined) statUpdates.karma = consequences.karma;
          if (consequences.logic !== undefined) statUpdates.logic = consequences.logic;
          if (consequences.reputation !== undefined) statUpdates.reputation = consequences.reputation;
          if (consequences.energy !== undefined) statUpdates.energy = consequences.energy;
          
          if (consequences.financial !== undefined) {
            financialUpdates.bankBalance = consequences.financial;
          }
          
          // Apply updates to game state
          if (Object.keys(statUpdates).length > 0) {
            updatePlayerStats(statUpdates);
          }
          
          if (Object.keys(financialUpdates).length > 0) {
            updateFinancialData(financialUpdates);
          }
        }
      }
    );

    return unsubscribe;
  }, [updatePlayerStats, updateFinancialData]);

  // Don't render anything if no active decision session
  if (!showDecisionCard && !showResultScreen) {
    return null;
  }

  return (
    <>
      {/* Decision Card */}
      {showDecisionCard && currentDecision && (
        <DecisionCard 
          decision={currentDecision} 
          dayNumber={gameDay}
        />
      )}

      {/* Result Screen */}
      {showResultScreen && currentSession && (
        <DecisionResultScreen 
          playerDecision={currentSession.completedDecisions[currentSession.completedDecisions.length - 1]}
          isLastDecision={
            currentSession.currentDecisionIndex >= currentSession.decisions.length - 1
          }
        />
      )}
    </>
  );
};

export default DecisionManager;