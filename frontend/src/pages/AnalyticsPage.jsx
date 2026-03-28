import { BarChart3, Clock3, TrendingUp } from "lucide-react";
import BillableSplitChart from "../charts/BillableSplitChart";
import ProfitTrendChart from "../charts/ProfitTrendChart";
import ProjectComparisonChart from "../charts/ProjectComparisonChart";
import TimeDistributionChart from "../charts/TimeDistributionChart";
import EmptyState from "../components/EmptyState";
import PageShell from "../components/PageShell";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import usePortfolioData from "../hooks/usePortfolioData";

const AnalyticsPage = () => {
  const { data, derived } = usePortfolioData();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Analytics"
        title="Visualize profitability, effort, and hidden work"
        description="These charts spotlight earning momentum, work mix, project rate comparisons, and where non-billable time stacks up."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard
          label="Tracked Projects"
          value={data.projects.length}
          hint="Projects included in analytics views"
          icon={BarChart3}
        />
        <StatsCard
          label="Billable Hours"
          value={`${derived.billableHours}h`}
          hint="Revenue-generating tracked time"
          tone="profit"
          icon={TrendingUp}
        />
        <StatsCard
          label="Non-Billable Hours"
          value={`${derived.nonBillableHours}h`}
          hint="Emails, calls, revisions, and admin"
          tone="warn"
          icon={Clock3}
        />
      </section>

      {data.projects.length ? (
        <>
          <section className="grid gap-6 xl:grid-cols-2">
            <ProfitTrendChart data={derived.profitTrend} />
            <BillableSplitChart data={derived.profitabilityMix} />
          </section>
          <section className="grid gap-6">
            <ProjectComparisonChart data={derived.projectComparison} />
            <TimeDistributionChart data={derived.timeDistribution} />
          </section>
        </>
      ) : (
        <EmptyState
          title="Analytics wake up once projects exist"
          description="Create and log time against a project to unlock all advanced graphs."
        />
      )}
    </PageShell>
  );
};

export default AnalyticsPage;

