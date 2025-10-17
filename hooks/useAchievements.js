import { useEffect, useMemo, useState } from "react";
import { achievementsCatalog, defaultAchievementsState } from "../data/achievements";
import { toast } from "../components/Toast";

const STORAGE_KEY = "artifically:achievements";

const readStoredAchievements = () => {
  if (typeof window === "undefined") {
    return defaultAchievementsState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultAchievementsState;
    }

    const parsed = JSON.parse(raw);
    return {
      ...defaultAchievementsState,
      ...Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [
          key,
          {
            ...defaultAchievementsState[key],
            ...value,
          },
        ])
      ),
    };
  } catch (error) {
    console.warn("Failed to parse stored achievements", error);
    return defaultAchievementsState;
  }
};

export const useAchievements = ({ deploymentsCount = 0, streak = 0 } = {}) => {
  const [achievements, setAchievements] = useState(readStoredAchievements);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const unlocks = [];

    setAchievements((previous) => {
      let changed = false;
      const next = { ...previous };

      const unlock = (key) => {
        const template =
          defaultAchievementsState[key] ||
          achievementsCatalog[key] || {
            id: key,
            title: key,
            description: "",
            reward: "",
          };

        if (!next[key]) {
          next[key] = {
            ...template,
            unlocked: true,
            unlockedAt: Date.now(),
          };
          changed = true;
          unlocks.push(key);
          return;
        }

        if (!next[key].unlocked) {
          next[key] = {
            ...template,
            ...next[key],
            unlocked: true,
            unlockedAt: Date.now(),
          };
          changed = true;
          unlocks.push(key);
        }
      };

      if (deploymentsCount > 0) {
        unlock("firstDemo");
      }

      if (deploymentsCount >= 5) {
        unlock("fiveAutomations");
      }

      if (streak >= 7) {
        unlock("weekStreak");
      }

      return changed ? next : previous;
    });

    if (unlocks.length) {
      unlocks.forEach((key, index) => {
        const achievement = achievementsCatalog[key];
        if (!achievement) {
          return;
        }

        setTimeout(() => {
          toast(achievement.title, {
            type: "celebration",
            title: `${achievement.title} unlocked!`,
            description: achievement.description,
            reward: achievement.reward,
            duration: 6000,
          });
        }, index * 250);
      });
    }
  }, [deploymentsCount, streak]);

  const unlockedCount = useMemo(
    () => Object.values(achievements).filter((achievement) => achievement.unlocked).length,
    [achievements]
  );

  const totalCount = useMemo(() => Object.keys(achievements).length, [achievements]);

  const completion = useMemo(() => {
    if (totalCount === 0) {
      return 0;
    }

    return Math.round((unlockedCount / totalCount) * 100);
  }, [totalCount, unlockedCount]);

  return {
    achievements,
    unlockedCount,
    totalCount,
    completion,
  };
};

export default useAchievements;