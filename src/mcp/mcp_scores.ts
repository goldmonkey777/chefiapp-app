// ChefIApp™ - MCP_SCORES Server
// Performance KPIs and Ranking Intelligence

import {
  PerformanceKPIs,
  Ranking,
  RankedEmployee,
  WeeklyEvolution,
  WeeklyData,
  SmartRecommendation,
} from './types';

// ============================================================================
// CALCULATE KPIs
// ============================================================================

export function calculateKPIs(
  tasksCompleted: number,
  totalTasks: number,
  averageTime: number, // in minutes
  attendance: number // percentage
): PerformanceKPIs {
  // Punctuality (based on attendance)
  const punctuality = Math.round(attendance);

  // Compliance (task completion rate)
  const compliance = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  // Efficiency (based on average time - lower is better)
  // Assume optimal time is 15 minutes per task
  const optimalTime = 15;
  let efficiency = 100;
  if (averageTime > optimalTime) {
    efficiency = Math.max(0, Math.round(100 - ((averageTime - optimalTime) / optimalTime) * 50));
  } else {
    efficiency = 100;
  }

  // Reliability (combination of compliance and punctuality)
  const reliability = Math.round((compliance * 0.6 + punctuality * 0.4));

  // Overall score (weighted average)
  const overall = Math.round(
    punctuality * 0.25 +
    compliance * 0.30 +
    efficiency * 0.25 +
    reliability * 0.20
  );

  // Determine trend (would be calculated from historical data in production)
  let trend: 'improving' | 'stable' | 'declining';
  if (overall >= 85) trend = 'improving';
  else if (overall >= 70) trend = 'stable';
  else trend = 'declining';

  return {
    punctuality,
    compliance,
    efficiency,
    reliability,
    overall,
    trend,
  };
}

// ============================================================================
// GENERATE RANKING
// ============================================================================

export function generateRanking(
  employees: Array<{
    userId: string;
    userName: string;
    kpis: PerformanceKPIs;
  }>,
  companyId: string
): Ranking {
  // Sort employees by overall score
  const sorted = [...employees].sort((a, b) => b.kpis.overall - a.kpis.overall);

  const rankedEmployees: RankedEmployee[] = sorted.map((emp, index) => ({
    userId: emp.userId,
    userName: emp.userName,
    rank: index + 1,
    score: emp.kpis.overall,
    kpis: emp.kpis,
    badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : undefined,
  }));

  const top3 = rankedEmployees.slice(0, 3);

  return {
    companyId,
    employees: rankedEmployees,
    top3,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// WEEKLY EVOLUTION
// ============================================================================

export function weeklyEvolution(
  userId: string,
  weeksCount: number = 8
): WeeklyEvolution {
  // In production, fetch historical data from database
  // For now, generate sample trend data

  const weeks: WeeklyData[] = [];
  const baseScore = 70 + Math.random() * 15; // 70-85 base
  const trend = Math.random() > 0.5 ? 'improving' : Math.random() > 0.5 ? 'stable' : 'declining';

  for (let i = weeksCount - 1; i >= 0; i--) {
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() - (i * 7));

    const weekStart = new Date(weekDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Saturday

    // Generate score with trend
    let score = baseScore;
    if (trend === 'improving') {
      score += ((weeksCount - i) / weeksCount) * 15; // Gradual improvement
    } else if (trend === 'declining') {
      score -= ((weeksCount - i) / weeksCount) * 10; // Gradual decline
    }
    score += (Math.random() - 0.5) * 5; // Random variation
    score = Math.max(50, Math.min(100, Math.round(score)));

    const tasksCompleted = Math.floor(15 + Math.random() * 10); // 15-25 tasks per week

    weeks.push({
      weekNumber: weeksCount - i,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      score,
      tasksCompleted,
    });
  }

  // Calculate improvement rate
  const firstWeekScore = weeks[0].score;
  const lastWeekScore = weeks[weeks.length - 1].score;
  const improvementRate = Math.round(((lastWeekScore - firstWeekScore) / firstWeekScore) * 100);

  const graphData = weeks.map((w) => w.score);

  return {
    userId,
    weeks,
    trend,
    improvementRate,
    graphData,
  };
}

// ============================================================================
// SMART RECOMMENDATIONS
// ============================================================================

export function smartRecommendations(
  performanceObject: PerformanceKPIs,
  userId: string
): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];

  // Analyze each KPI and provide recommendations
  if (performanceObject.punctuality < 85) {
    recommendations.push({
      category: 'punctuality',
      priority: 'high',
      action: 'Defina alarmes 15 minutos antes do turno para garantir chegada pontual',
      expectedImpact: `+${Math.round((85 - performanceObject.punctuality) * 0.8)}% em pontualidade`,
      estimatedTime: '1 semana',
    });
  }

  if (performanceObject.compliance < 80) {
    recommendations.push({
      category: 'compliance',
      priority: 'high',
      action: 'Revise os procedimentos padrão e tire dúvidas com seu supervisor',
      expectedImpact: `+${Math.round((80 - performanceObject.compliance) * 0.7)}% em conformidade`,
      estimatedTime: '2 semanas',
    });
  }

  if (performanceObject.efficiency < 75) {
    recommendations.push({
      category: 'efficiency',
      priority: 'medium',
      action: 'Organize seu mise en place antes de iniciar as tarefas para ganhar velocidade',
      expectedImpact: `+${Math.round((75 - performanceObject.efficiency) * 0.6)}% em eficiência`,
      estimatedTime: '1 semana',
    });
  }

  if (performanceObject.reliability < 80) {
    recommendations.push({
      category: 'reliability',
      priority: 'medium',
      action: 'Documente suas tarefas completadas e mantenha consistência no padrão de qualidade',
      expectedImpact: `+${Math.round((80 - performanceObject.reliability) * 0.7)}% em confiabilidade`,
      estimatedTime: '2 semanas',
    });
  }

  // If all scores are good, provide advanced tips
  if (performanceObject.overall >= 85) {
    recommendations.push({
      category: 'efficiency',
      priority: 'low',
      action: 'Considere fazer o curso avançado na ChefIApp Academy para se especializar',
      expectedImpact: 'Evolução de carreira e possível promoção',
      estimatedTime: '1 mês',
    });
  }

  return recommendations;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MCPScores = {
  calculateKPIs,
  generateRanking,
  weeklyEvolution,
  smartRecommendations,
};

export default MCPScores;
