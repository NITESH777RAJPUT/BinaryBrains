import { Palette, ShieldCheck, WandSparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Settings"
        title="Personalize the dashboard experience"
        description="Theme, environment, and workflow preferences live here so the app feels more like a polished SaaS cockpit."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Theme" value={theme === "dark" ? "Dark" : "Light"} hint="Saved in localStorage" icon={Palette} />
        <StatsCard label="Security" value="JWT Auth" hint="Protected routes active" tone="profit" icon={ShieldCheck} />
        <StatsCard
          label="AI Mode"
          value="Powered by AI"
          hint="Configured via environment settings"
          tone="warn"
          icon={WandSparkles}
        />
      </section>

      <section className="glass-panel rounded-[30px] p-6">
        <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Appearance</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Switch the theme and keep the preference synced for future sessions.
        </p>
        <button
          type="button"
          onClick={toggleTheme}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
        >
          Toggle {theme === "dark" ? "Light" : "Dark"} mode
        </button>
      </section>
    </PageShell>
  );
};

export default SettingsPage;
