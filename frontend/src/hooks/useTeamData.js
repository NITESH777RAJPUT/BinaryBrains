import { useCallback, useEffect, useState } from "react";
import { teamService } from "../services/api";
import { useToast } from "../context/ToastContext";

const defaultTeamState = {
  team: null,
  members: [],
  analytics: null,
  activityFeed: [],
  pendingInvites: [],
  projects: [],
};

const useTeamData = () => {
  const { pushToast } = useToast();
  const [data, setData] = useState(defaultTeamState);
  const [loading, setLoading] = useState(true);

  const loadTeam = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teamService.getTeam();
      setData({ ...defaultTeamState, ...response });
      return response;
    } catch (error) {
      pushToast({ tone: "error", title: "Could not load team", description: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    loadTeam().catch(() => null);
  }, [loadTeam]);

  return {
    data,
    setData,
    loading,
    loadTeam,
  };
};

export default useTeamData;
