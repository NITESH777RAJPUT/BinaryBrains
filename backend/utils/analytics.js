const NON_BILLABLE_TYPES = ["Emails", "Calls", "Revisions", "Admin"];

const round = (value) => Number((value || 0).toFixed(2));

export const calculateProjectMetrics = (project, timeLogs = []) => {
  const totalHours = timeLogs.reduce((sum, log) => sum + log.duration, 0);
  const billableHours = timeLogs
    .filter((log) => log.type === "Billable")
    .reduce((sum, log) => sum + log.duration, 0);
  const nonBillableHours = totalHours - billableHours;

  const breakdown = NON_BILLABLE_TYPES.reduce((acc, key) => {
    acc[key] = round(
      timeLogs
        .filter((log) => log.type === key)
        .reduce((sum, log) => sum + log.duration, 0)
    );
    return acc;
  }, {});

  const effectiveRate = totalHours > 0 ? project.price / totalHours : project.price;
  const estimatedRate =
    project.estimatedHours > 0 ? project.price / project.estimatedHours : project.price;
  const profitabilityStatus =
    effectiveRate >= project.thresholdRate ? "profitable" : "unprofitable";
  const progress =
    project.estimatedHours > 0
      ? Math.min((totalHours / project.estimatedHours) * 100, 100)
      : 0;

  const recentLogs = [...timeLogs]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-5);
  const recentNonBillable = recentLogs
    .filter((log) => NON_BILLABLE_TYPES.includes(log.type))
    .reduce((sum, log) => sum + log.duration, 0);

  const scopeCreepDetected =
    nonBillableHours > billableHours * 0.35 ||
    (recentLogs.length >= 3 && recentNonBillable > billableHours * 0.15);

  const profitDelta = effectiveRate - project.thresholdRate;

  return {
    totalHours: round(totalHours),
    billableHours: round(billableHours),
    nonBillableHours: round(nonBillableHours),
    effectiveRate: round(effectiveRate),
    estimatedRate: round(estimatedRate),
    profitabilityStatus,
    progress: round(progress),
    thresholdRate: round(project.thresholdRate),
    price: round(project.price),
    breakdown,
    scopeCreepDetected,
    profitDelta: round(profitDelta),
    alerts: [
      ...(effectiveRate < project.thresholdRate
        ? ["Project is becoming unprofitable"]
        : []),
      ...(scopeCreepDetected ? ["Scope creep detected"] : []),
    ],
  };
};

export const buildPortfolioSummary = (projectsWithMetrics = []) => {
  const totalEarnings = projectsWithMetrics.reduce(
    (sum, item) => sum + item.project.price,
    0
  );
  const totalHours = projectsWithMetrics.reduce(
    (sum, item) => sum + item.metrics.totalHours,
    0
  );

  const clientMap = new Map();
  projectsWithMetrics.forEach(({ project, metrics }) => {
    const existing = clientMap.get(project.client) || {
      client: project.client,
      earnings: 0,
      hours: 0,
      projects: 0,
    };
    existing.earnings += project.price;
    existing.hours += metrics.totalHours;
    existing.projects += 1;
    clientMap.set(project.client, existing);
  });

  const clientAnalysis = [...clientMap.values()].map((client) => ({
    ...client,
    earnings: round(client.earnings),
    hours: round(client.hours),
    effectiveRate: round(client.hours > 0 ? client.earnings / client.hours : client.earnings),
  }));

  const sortedByRate = [...projectsWithMetrics].sort(
    (a, b) => b.metrics.effectiveRate - a.metrics.effectiveRate
  );

  return {
    totalEarnings: round(totalEarnings),
    averageHourlyRate: round(totalHours > 0 ? totalEarnings / totalHours : totalEarnings),
    mostProfitableProject: sortedByRate[0]
      ? {
          id: sortedByRate[0].project._id,
          title: sortedByRate[0].project.title,
          effectiveRate: sortedByRate[0].metrics.effectiveRate,
        }
      : null,
    leastProfitableProject: sortedByRate.at(-1)
      ? {
          id: sortedByRate.at(-1).project._id,
          title: sortedByRate.at(-1).project.title,
          effectiveRate: sortedByRate.at(-1).metrics.effectiveRate,
        }
      : null,
    clientAnalysis,
  };
};

export const buildMonthlyAnalytics = (timeLogs = []) => {
  const monthMap = new Map();

  timeLogs.forEach((log) => {
    const date = new Date(log.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const existing = monthMap.get(key) || {
      month: key,
      billable: 0,
      nonBillable: 0,
      total: 0,
    };
    existing.total += log.duration;
    if (log.type === "Billable") {
      existing.billable += log.duration;
    } else {
      existing.nonBillable += log.duration;
    }
    monthMap.set(key, existing);
  });

  return [...monthMap.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((item) => ({
      month: item.month,
      billable: round(item.billable),
      nonBillable: round(item.nonBillable),
      total: round(item.total),
    }));
};

