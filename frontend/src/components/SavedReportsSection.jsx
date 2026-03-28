import { Eye, FileText, Trash2 } from "lucide-react";

const SavedReportsSection = ({ reports, selectedReportId, onView, onDelete }) => (
  <div className="glass-panel rounded-[30px] p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Saved Reports</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
          Revisit previous AI analyses
        </h3>
      </div>
      <div className="rounded-full bg-slate-900/5 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
        {reports.length} saved
      </div>
    </div>

    {reports.length ? (
      <div className="mt-5 space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`rounded-[24px] border p-4 ${
              selectedReportId === report.id
                ? "border-teal-400/50 bg-teal-500/10"
                : "border-white/10 bg-slate-900/5 dark:bg-white/5"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <FileText size={15} />
                  <span>{new Date(report.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">{report.projectName}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{report.summary}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onView(report)}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                >
                  <Eye size={15} />
                  View report
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(report.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-700 dark:text-rose-200"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-5 rounded-2xl border border-dashed border-white/20 px-4 py-8 text-sm text-slate-600 dark:text-slate-300">
        Save a generated AI insight and it will appear here with project name, date, and summary.
      </div>
    )}
  </div>
);

export default SavedReportsSection;
