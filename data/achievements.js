export const achievementsCatalog = {
  firstDemo: {
    id: "firstDemo",
    title: "First Automation Demo",
    description: "Deploy your first automation or request a live demo.",
    reward: "Early Adopter Badge"
  },
  fiveAutomations: {
    id: "fiveAutomations",
    title: "Automation Architect",
    description: "Maintain five active automations across your organization.",
    reward: "Automation Architect Emblem"
  },
  weekStreak: {
    id: "weekStreak",
    title: "Consistency Champion",
    description: "Log in seven days in a row to review performance.",
    reward: "10% Discount"
  }
};

export const defaultAchievementsState = Object.fromEntries(
  Object.keys(achievementsCatalog).map((key) => [
    key,
    {
      ...achievementsCatalog[key],
      unlocked: false,
      unlockedAt: null
    }
  ])
);

export default achievementsCatalog;