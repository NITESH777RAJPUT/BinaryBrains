import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tracker_saved_ai_reports";

const useSavedReports = () => {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  const sortedReports = useMemo(
    () =>
      [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [reports]
  );

  const saveReport = (report) => {
    const next = {
      id: crypto.randomUUID(),
      ...report,
      createdAt: new Date().toISOString(),
    };
    setReports((current) => [next, ...current]);
    return next;
  };

  const deleteReport = (id) => {
    setReports((current) => current.filter((report) => report.id !== id));
  };

  return {
    reports: sortedReports,
    saveReport,
    deleteReport,
  };
};

export default useSavedReports;

