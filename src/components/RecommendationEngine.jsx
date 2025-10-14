import { useMemo } from "react";
import { motion } from "framer-motion";
import { SAMPLE_AUTOMATIONS } from "../data/automations";

const RECOMMENDATION_LIMIT = 3;

const DEFAULT_BEHAVIOR = {
  categories: [],
  tags: [],
  interests: [],
  industry: "",
  role: "",
};

function normalizeBehavior(userBehavior = {}) {
  return {
    categories: new Set((userBehavior.categories || userBehavior.interests || []).map((item) => item.toLowerCase())),
    tags: new Set((userBehavior.tags || userBehavior.viewedTags || []).map((item) => item.toLowerCase())),
    industry: (userBehavior.industry || "").toLowerCase(),
    role: (userBehavior.role || "").toLowerCase(),
  };
}

function scoreAutomation(automation, behavior, deployments) {
  const deployedIds = new Set(deployments.map((deployment) => deployment?.id || deployment?.automationId));
  if (deployedIds.has(automation.id)) {
    return null;
  }

  let score = 55;
  const reasons = [];

  const category = (automation.category || "").toLowerCase();
  if (category && behavior.categories.has(category)) {
    score += 22;
    reasons.push(`Popular in your ${category} workflows`);
  }

  const automationTags = (automation.tags || []).map((tag) => tag.toLowerCase());
  const matchingTags = automationTags.filter((tag) => behavior.tags.has(tag));
  if (matchingTags.length > 0) {
    score += Math.min(18, matchingTags.length * 6);
    reasons.push(`Aligns with interests in ${matchingTags.slice(0, 2).join(", ")}`);
  }

  if (behavior.industry && automationTags.some((tag) => behavior.industry.includes(tag))) {
    score += 10;
    reasons.push("Tailored to your industry signals");
  }

  if (behavior.role && automationTags.some((tag) => behavior.role.includes(tag))) {
    score += 8;
    reasons.push("Built for your role");
  }

  if (automation.roi) {
    score += Math.min(20, automation.roi * 3);
  }

  if (automation.deploymentsPerWeek) {
    score += Math.min(10, automation.deploymentsPerWeek / 3);
  }

  if (automation.hoursSavedWeekly) {
    score += Math.min(8, automation.hoursSavedWeekly / 60);
  }

  const matchScore = Math.max(60, Math.min(99, Math.round(score)));
  const reason = reasons[0] || "High-impact automation for teams like yours";

  return {
    ...automation,
    matchScore,
    reason,
  };
}

function calculateRecommendations(userBehavior = DEFAULT_BEHAVIOR, deployments = []) {
  const behavior = normalizeBehavior({ ...DEFAULT_BEHAVIOR, ...userBehavior });

  return SAMPLE_AUTOMATIONS.map((automation) => scoreAutomation(automation, behavior, deployments))
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, RECOMMENDATION_LIMIT);
}

function RecommendationEngine({ userBehavior = DEFAULT_BEHAVIOR, deployments = [] }) {
  const recommendations = useMemo(
    () => calculateRecommendations(userBehavior, deployments),
    [userBehavior, deployments],
  );

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="recommendations" data-animate-root>
      <motion.h2
        className="recommendations__title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      >
        Recommended for You
      </motion.h2>
      <div className="recommendation-grid">
        {recommendations.map((automation, index) => (
          <RecommendationCard key={automation.id} automation={automation} index={index} />
        ))}
      </div>
    </section>
  );
}

function RecommendationCard({ automation, index }) {
  const { icon, name, description, highlights = [], matchScore, reason } = automation;

  return (
    <motion.article
      className="recommendation-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.33, 1, 0.68, 1] }}
    >
      <div className="recommendation-card__header">
        <span className="recommendation-card__icon" aria-hidden="true">
          {icon || "⚙️"}
        </span>
        <span className="recommendation-card__score">{matchScore}% match</span>
      </div>
      <h3 className="recommendation-card__title">{name}</h3>
      <p className="recommendation-card__description">{description}</p>
      <div className="recommendation-card__reason">{reason}</div>
      {highlights.length > 0 && (
        <ul className="recommendation-card__highlights">
          {highlights.slice(0, 3).map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

export default RecommendationEngine;