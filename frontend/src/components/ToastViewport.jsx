const toneClasses = {
  success: "border-emerald-400/40 bg-emerald-500/20 text-emerald-100",
  error: "border-rose-400/40 bg-rose-500/20 text-rose-100",
  info: "border-sky-400/40 bg-sky-500/20 text-sky-100",
};

const ToastViewport = ({ toasts }) => (
  <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`animate-rise rounded-2xl border px-4 py-3 shadow-glass backdrop-blur-xl ${toneClasses[toast.tone]}`}
      >
        <p className="font-semibold">{toast.title}</p>
        {toast.description ? <p className="mt-1 text-sm opacity-90">{toast.description}</p> : null}
      </div>
    ))}
  </div>
);

export default ToastViewport;

