self.onmessage = (event) => {
  const payload = event?.data;
  if (!payload || typeof payload !== "object") {
    self.postMessage({ type: "error", message: "Invalid payload" });
    return;
  }

  const { automations = [], signals = [], focus } = payload;

  const roiValues = [];
  const categoryMap = new Map();
  const comboScores = [];

  automations.forEach((automation) => {
    if (!automation || typeof automation !== "object") return;
    const roi = Number(automation?.roi);
    if (Number.isFinite(roi)) {
      roiValues.push(roi);
    }

    const category = automation?.category || automation?.vertical || "General";
    const entry = categoryMap.get(category) || { count: 0, roi: 0 };
    entry.count += 1;
    if (Number.isFinite(roi)) {
      entry.roi += roi;
    }
    categoryMap.set(category, entry);

    const tags = Array.isArray(automation?.tags) ? automation.tags : [];
    const overlap = signals.filter((signal) => {
      const normalized = String(signal || "").toLowerCase();
      return (
        normalized &&
        (String(category).toLowerCase().includes(normalized) ||
          tags.some((tag) => String(tag).toLowerCase().includes(normalized)))
      );
    });
    if (overlap.length >= 2) {
      comboScores.push({
        id: automation.id,
        name: automation.name,
        overlap,
        roi: Number.isFinite(roi) ? roi : 0,
      });
    }
  });

  const averageROI =
    roiValues.length > 0
      ? roiValues.reduce((total, value) => total + value, 0) / roiValues.length
      : null;

  const topCategory = Array.from(categoryMap.entries())
    .map(([category, { count, roi }]) => ({
      category,
      count,
      roiAverage: count > 0 ? roi / count : 0,
    }))
    .sort((a, b) => {
      if (b.roiAverage === a.roiAverage) {
        return b.count - a.count;
      }
      return b.roiAverage - a.roiAverage;
    })[0] || null;

  const combo = comboScores
    .map((entry) => ({
      ...entry,
      score: entry.roi + entry.overlap.length * 1.75 + (focus ? 2.5 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  self.postMessage({
    type: "metrics",
    averageROI,
    topCategory,
    combo,
  });
};