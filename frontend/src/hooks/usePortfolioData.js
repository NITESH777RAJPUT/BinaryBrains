import { useCallback, useEffect, useMemo, useState } from "react";
import { projectService } from "../services/api";
import { useToast } from "../context/ToastContext";

const defaultState = {
  projects: [],
  portfolioSummary: { clientAnalysis: [] },
  monthlyAnalytics: [],
};

const usePortfolioData = () => {
  const { pushToast } = useToast();
  const [data, setData] = useState(defaultState);
  const [loading, setLoading] = useState(true);

  const loadPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setData(response);
      return response;
    } catch (error) {
      pushToast({ tone: "error", title: "Could not load portfolio", description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const derived = useMemo(() => {
    const projectCards = data.projects || [];
    const totalHoursLogged = projectCards.reduce(
      (sum, item) => sum + (item.metrics?.totalHours || 0),
      0
    );
    const billableHours = projectCards.reduce(
      (sum, item) => sum + (item.metrics?.billableHours || 0),
      0
    );
    const nonBillableHours = projectCards.reduce(
      (sum, item) => sum + (item.metrics?.nonBillableHours || 0),
      0
    );

    const profitabilityMix = [
      { name: "Billable", value: billableHours },
      { name: "Non-Billable", value: nonBillableHours },
    ];

    const projectComparison = projectCards.map((item) => ({
      name: item.project.title,
      effectiveRate: item.metrics.effectiveRate,
      thresholdRate: item.metrics.thresholdRate,
    }));

    const profitTrend = (data.monthlyAnalytics || []).map((item) => ({
      month: item.month,
      earnings: Number((item.billable * (data.portfolioSummary.averageHourlyRate || 0)).toFixed(2)),
      totalHours: item.total,
    }));

    const timeDistribution = projectCards.map((item) => ({
      name: item.project.title,
      Emails: item.metrics.breakdown?.Emails || 0,
      Calls: item.metrics.breakdown?.Calls || 0,
      Revisions: item.metrics.breakdown?.Revisions || 0,
      Admin: item.metrics.breakdown?.Admin || 0,
    }));

    const alerts = projectCards.flatMap((item) =>
      (item.metrics.alerts || []).map((alert) => ({
        id: `${item.project._id}-${alert}`,
        projectId: item.project._id,
        projectTitle: item.project.title,
        message: alert,
      }))
    );

    return {
      totalHoursLogged: Number(totalHoursLogged.toFixed(2)),
      billableHours: Number(billableHours.toFixed(2)),
      nonBillableHours: Number(nonBillableHours.toFixed(2)),
      profitabilityMix,
      projectComparison,
      profitTrend,
      timeDistribution,
      alerts,
    };
  }, [data]);

  return {
    data,
    setData,
    loading,
    loadPortfolio,
    derived,
  };
};

export default usePortfolioData;

