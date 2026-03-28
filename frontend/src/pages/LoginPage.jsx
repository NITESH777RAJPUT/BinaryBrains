import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const LoginPage = () => {
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(form);
      pushToast({ tone: "success", title: "Welcome back", description: "Your dashboard is ready." });
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (error) {
      pushToast({ tone: "error", title: "Login failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[36px] bg-slate-950 px-8 py-10 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-teal-300">Hackathon Build</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">
            Protect your margin before a project quietly eats your week.
          </h1>
          <p className="mt-6 max-w-xl text-base text-slate-300">
            Track billable versus hidden work, spot scope creep early, and turn every freelance project into a visible profitability signal.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {["Live effective rate", "Glassmorphism dashboards", "AI pricing insight", "Portfolio analytics"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[36px] p-8">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Sign In</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-900 px-5 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-teal-600 dark:text-teal-300">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

