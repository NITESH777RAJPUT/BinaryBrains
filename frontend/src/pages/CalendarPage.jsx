import "react-calendar/dist/Calendar.css";
import { CalendarDays, Clock3, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import { useToast } from "../context/ToastContext";
import usePortfolioData from "../hooks/usePortfolioData";
import { timeLogService } from "../services/api";

const logTypes = ["Billable", "Calls", "Emails", "Revisions", "Admin"];

const normalizeDateKey = (date) => new Date(date).toISOString().slice(0, 10);

const CalendarPage = () => {
  const { data, loadPortfolio } = usePortfolioData();
  const { pushToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    duration: "",
    type: "Billable",
    notes: "",
  });

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await timeLogService.getAllLogs();
      setAllLogs(response.timeLogs || []);
    } catch (error) {
      pushToast({ tone: "error", title: "Could not load calendar data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const logsByDay = useMemo(() => {
    return allLogs.reduce((acc, log) => {
      const key = normalizeDateKey(log.createdAt);
      acc[key] = acc[key] || [];
      acc[key].push(log);
      return acc;
    }, {});
  }, [allLogs]);

  const selectedKey = normalizeDateKey(selectedDate);
  const selectedLogs = logsByDay[selectedKey] || [];

  const dayTone = (date) => {
    const entries = logsByDay[normalizeDateKey(date)] || [];
    if (!entries.length) return "";

    const total = entries.reduce((sum, log) => sum + log.duration, 0);
    const nonBillable = entries
      .filter((log) => log.type !== "Billable")
      .reduce((sum, log) => sum + log.duration, 0);

    if (nonBillable > total * 0.45) return "calendar-high-nonbillable";
    if (total >= 4) return "calendar-productive";
    return "calendar-low";
  };

  const handleCreateLog = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      await timeLogService.createTimeLog({
        ...form,
        duration: Number(form.duration),
        createdAt: new Date(selectedDate).toISOString(),
      });
      pushToast({ tone: "success", title: "Log added", description: "Calendar and project data updated." });
      setForm((current) => ({ ...current, duration: "", notes: "" }));
      await Promise.all([loadLogs(), loadPortfolio()]);
    } catch (error) {
      pushToast({ tone: "error", title: "Could not add log", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Calendar"
        title="See productivity patterns across the month"
        description="Days with logged work are highlighted. Click a date to inspect logs and add a new time entry directly from the calendar."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Logged Days" value={Object.keys(logsByDay).length} hint="Days with at least one entry" icon={CalendarDays} />
        <StatsCard label="Selected Day Entries" value={selectedLogs.length} hint="Entries on the active date" icon={Clock3} />
        <StatsCard
          label="Calendar Actions"
          value="Live"
          hint="Add new logs from the selected day"
          tone="profit"
          icon={PlusCircle}
        />
      </section>

      {data.projects.length ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="glass-panel calendar-shell rounded-[32px] p-5">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              tileClassName={({ date, view }) => (view === "month" ? dayTone(date) : "")}
            />
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-700 dark:text-emerald-200">Green = productive</div>
              <div className="rounded-full bg-rose-500/15 px-4 py-2 text-rose-700 dark:text-rose-200">Red = low productivity</div>
              <div className="rounded-full bg-amber-400/15 px-4 py-2 text-amber-700 dark:text-amber-200">Yellow = high non-billable</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-[32px] p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Selected Date</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                {selectedDate.toDateString()}
              </h3>
              <div className="mt-5 space-y-3">
                {selectedLogs.length ? (
                  selectedLogs.map((log) => (
                    <div key={log._id} className="rounded-2xl bg-slate-900/5 px-4 py-4 dark:bg-white/5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{log.projectId?.title || "Project"}</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {log.type} | {log.duration}h
                          </p>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                      {log.notes ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{log.notes}</p> : null}
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No logs on this day"
                    description="Add a new time entry below to populate this date."
                  />
                )}
              </div>
            </div>

            <form onSubmit={handleCreateLog} className="glass-panel rounded-[32px] p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Add Time Log</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Project
                  <select
                    value={form.projectId}
                    onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value }))}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
                  >
                    <option value="">Select a project</option>
                    {data.projects.map((item) => (
                      <option key={item.project._id} value={item.project._id}>
                        {item.project.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Duration (hours)
                  <input
                    value={form.duration}
                    onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                    required
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Type
                  <select
                    value={form.type}
                    onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
                  >
                    {logTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Notes
                  <input
                    value={form.notes}
                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add log to selected date"}
              </button>
            </form>
          </div>
        </section>
      ) : (
        <EmptyState
          title="Calendar unlocks once projects exist"
          description="Create a project first, then the calendar can connect dates, logs, and productivity highlights."
        />
      )}
    </PageShell>
  );
};

export default CalendarPage;
