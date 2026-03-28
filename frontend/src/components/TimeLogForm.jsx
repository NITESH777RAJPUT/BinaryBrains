import { useState } from "react";

const defaultForm = {
  duration: "",
  type: "Billable",
  notes: "",
};

const TimeLogForm = ({ projectId, onSubmit, loading }) => {
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      projectId,
      duration: Number(form.duration),
      type: form.type,
      notes: form.notes,
    });
    setForm(defaultForm);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-[30px] p-5">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Time Entry</p>
      <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">Log hours manually</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
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
            <option>Billable</option>
            <option>Emails</option>
            <option>Calls</option>
            <option>Revisions</option>
            <option>Admin</option>
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
        disabled={loading}
        className="mt-5 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"
      >
        {loading ? "Saving..." : "Add Time Entry"}
      </button>
    </form>
  );
};

export default TimeLogForm;

