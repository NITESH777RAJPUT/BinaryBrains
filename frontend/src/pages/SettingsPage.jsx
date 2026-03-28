import { BellRing, Gauge, IndianRupee, MoonStar, ShieldCheck, SunMedium, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import { useCurrency } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";

const SETTINGS_KEY = "tracker_dashboard_settings";

const ToggleRow = ({ icon: Icon, title, description, enabled, onToggle }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 240, damping: 18 }}
    className="premium-dark-card flex items-center justify-between gap-4 rounded-[28px] p-5"
  >
    <div className="flex items-start gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
        <Icon size={18} />
      </div>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-gray-300">{description}</p>
      </div>
    </div>
    <button type="button" onClick={onToggle} className={`premium-switch ${enabled ? "bg-teal-500/80" : "bg-white/10"}`}>
      <span className={`premium-switch-thumb ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  </motion.div>
);

const SettingsPage = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          notifications: true,
          rateThreshold: "1500",
        };
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Settings"
        title="Personalize the dashboard experience"
        description="Tighten theme, alerts, and pricing defaults so the workspace feels closer to a premium operating system than a basic dashboard."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Theme" value={theme === "dark" ? "Dark" : "Light"} hint="Saved in localStorage" icon={theme === "dark" ? MoonStar : SunMedium} />
        <StatsCard label="Notifications" value={settings.notifications ? "Enabled" : "Muted"} hint="Portfolio alerts and AI updates" tone="profit" icon={BellRing} />
        <StatsCard label="Currency" value={currency} hint="Applied app-wide in real time" tone="warn" icon={IndianRupee} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <ToggleRow
            icon={theme === "dark" ? MoonStar : SunMedium}
            title="Theme mode"
            description="Switch between the clean light canvas and the premium dark cockpit."
            enabled={theme === "dark"}
            onToggle={toggleTheme}
          />
          <ToggleRow
            icon={BellRing}
            title="Notifications"
            description="Surface threshold drops, scope creep warnings, and insight updates."
            enabled={settings.notifications}
            onToggle={() => updateSetting("notifications", !settings.notifications)}
          />
          <div className="premium-dark-card rounded-[28px] p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                <IndianRupee size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Currency preference</p>
                <p className="mt-1 text-sm text-gray-300">Keep pricing defaults aligned with your freelance market.</p>
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="premium-input max-w-xs"
                >
                  <option value="INR">Indian Rupee (Rs)</option>
                  <option value="USD">$ US Dollar</option>
                  <option value="EUR">€ Euro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Defaults</p>
          <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">Operating preferences</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Set a reusable minimum rate target so new projects start with a smarter baseline.
          </p>

          <div className="mt-6 space-y-5">
            <div className="premium-dark-card rounded-[28px] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                  <Gauge size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Default rate threshold</p>
                  <p className="text-sm text-gray-300">Applied when planning project profitability targets.</p>
                </div>
              </div>
              <input
                type="number"
                min="0"
                value={settings.rateThreshold}
                onChange={(event) => updateSetting("rateThreshold", event.target.value)}
                className="premium-input mt-4"
                placeholder="1500"
              />
            </div>

            <div className="premium-dark-card rounded-[28px] p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Account environment</p>
                  <p className="mt-1 text-sm text-gray-300">JWT auth is active and preferences are persisted locally for quick reloads.</p>
                </div>
              </div>
            </div>

            <div className="premium-dark-card rounded-[28px] p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                  <WandSparkles size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">AI workspace mode</p>
                  <p className="mt-1 text-sm text-gray-300">Saved reports and insight actions stay ready for analyst-style review.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${theme === "dark" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-slate-100"}`}
            >
              Dark mode
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${theme === "light" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-slate-100"}`}
            >
              Light mode
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default SettingsPage;
