import { useState } from "react";
import useTimer from "../hooks/useTimer";

const TIMER_TYPES = ["Billable", "Calls", "Emails", "Revisions", "Admin"];

const TimerWidget = ({ projectId, onLog, canEdit = true }) => {
  const { seconds, isRunning, start, stop, reset } = useTimer();
  const [type, setType] = useState("Billable");

  const formatted = new Date(seconds * 1000).toISOString().slice(11, 19);

  const handleStop = async () => {
    const result = stop();
    const hours = Number((result.seconds / 3600).toFixed(2));
    if (hours > 0) {
      await onLog({
        projectId,
        duration: hours,
        type,
        startedAt: result.startedAt,
        notes: `Timer entry: ${formatted}`,
      });
    }
    reset();
  };

  return (
    <div className="glass-panel rounded-[30px] bg-gradient-to-br from-teal-500/20 to-transparent p-5">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Bonus Timer</p>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-display text-4xl font-semibold text-slate-900 dark:text-white">{formatted}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Start a live timer and save it straight to the project.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap items-center gap-2">
            {TIMER_TYPES.map((timerType) => {
              const isActive = type === timerType;
              return (
                <button
                  key={timerType}
                  type="button"
                  onClick={() => setType(timerType)}
                  disabled={!canEdit}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                      : "bg-gray-200 text-slate-800 hover:bg-teal-500 hover:text-white dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-teal-500"
                  }`}
                >
                  {timerType}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
          {!isRunning ? (
            <button type="button" onClick={start} disabled={!canEdit} className="rounded-full bg-teal-500 px-5 py-3 font-semibold text-white disabled:opacity-60">
              {canEdit ? "Start" : "Viewer access"}
            </button>
          ) : (
            <button type="button" onClick={handleStop} className="rounded-full bg-rose-500 px-5 py-3 font-semibold text-white">
              Stop & Save
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerWidget;
