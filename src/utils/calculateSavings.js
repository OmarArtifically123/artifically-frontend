export function calculateSavings(teamSize, hourlyRate) {
  const normalizedTeam = Math.max(1, Math.min(1000, Number(teamSize) || 0));
  const normalizedRate = Math.max(20, Math.min(200, Number(hourlyRate) || 0));
  const automationCoverage = Math.min(0.85, 0.35 + normalizedTeam * 0.0006);
  const hoursSavedPerWeek = Math.round(normalizedTeam * automationCoverage * 2);
  const monthlySavings = Math.round(hoursSavedPerWeek * 4 * normalizedRate);
  const roi = Math.max(1.5, Math.min(10, Number((monthlySavings / 1250).toFixed(1))));

  return {
    hoursSavedPerWeek,
    monthlySavings,
    roi,
  };
}