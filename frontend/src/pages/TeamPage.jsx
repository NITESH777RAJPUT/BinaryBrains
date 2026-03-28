import { Copy, Link2, Mail, ShieldCheck, Trash2, UserPlus, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import PageShell from "../components/PageShell";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../context/ToastContext";
import useTeamData from "../hooks/useTeamData";
import { teamService } from "../services/api";

const TeamPage = () => {
  const { user, refreshProfile } = useAuth();
  const { formatCurrency, formatRate } = useCurrency();
  const { pushToast } = useToast();
  const { data, loading, loadTeam } = useTeamData();
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteLink, setInviteLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await teamService.createTeam({ name: teamName });
      await refreshProfile();
      await loadTeam();
      setTeamName("");
      pushToast({ tone: "success", title: "Team created", description: "Your collaboration workspace is ready." });
    } catch (error) {
      pushToast({ tone: "error", title: "Could not create team", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const response = await teamService.invite({ email: inviteEmail, role: inviteRole });
      setInviteLink(response.invite.inviteLink);
      setInviteEmail("");
      await loadTeam();
      pushToast({ tone: "success", title: "Invite created", description: "Share the generated invite link with your teammate." });
    } catch (error) {
      pushToast({ tone: "error", title: "Could not create invite", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const copyInvite = async (value) => {
    await navigator.clipboard.writeText(value);
    pushToast({ tone: "success", title: "Copied", description: "Invite link copied to clipboard." });
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setSubmitting(true);
      await teamService.removeMember({ memberId });
      await loadTeam();
      pushToast({ tone: "info", title: "Member removed", description: "The user was removed from the team." });
    } catch (error) {
      pushToast({ tone: "error", title: "Could not remove member", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId, role) => {
    try {
      setSubmitting(true);
      await teamService.updateRole({ memberId, role });
      await refreshProfile();
      await loadTeam();
      pushToast({ tone: "success", title: "Role updated", description: "Permissions were updated successfully." });
    } catch (error) {
      pushToast({ tone: "error", title: "Could not update role", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="glass-panel rounded-[30px] px-5 py-10 text-center">Loading team workspace...</div>;
  }

  if (!data.team) {
    return (
      <PageShell>
        <SectionHeading
          eyebrow="Team"
          title="Create your collaboration workspace"
          description="Invite teammates, assign projects, and analyze profitability together from a shared operating system."
        />

        <form onSubmit={handleCreateTeam} className="premium-dark-card mx-auto max-w-2xl rounded-[32px] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-300">New Team</p>
          <h3 className="mt-2 font-display text-3xl font-semibold text-white">Start a shared workspace</h3>
          <label className="premium-label mt-6 block">
            Team name
            <input
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              className="premium-input"
              placeholder="Freelance Growth Studio"
              required
            />
          </label>
          <button type="submit" disabled={submitting} className="mt-6 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white disabled:opacity-60">
            {submitting ? "Creating..." : "Create Team"}
          </button>
        </form>
      </PageShell>
    );
  }

  const analytics = data.analytics || { memberContributions: [] };

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Team"
        title={data.team.name}
        description="Manage membership, assignment flow, and performance visibility from one collaboration hub."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Members" value={data.members.length} hint="Active collaborators" icon={Users2} />
        <StatsCard label="Team Earnings" value={formatCurrency(analytics.totalTeamEarnings || 0)} hint="Shared portfolio revenue" tone="profit" icon={ShieldCheck} />
        <StatsCard label="Avg Hourly Rate" value={formatRate(analytics.averageHourlyRate || 0)} hint="Across all team work" icon={Link2} />
        <StatsCard label="Best Performer" value={analytics.bestPerformingMember?.name || "N/A"} hint={analytics.bestPerformingMember ? formatRate(analytics.bestPerformingMember.effectiveRate || 0) : "Waiting for team activity"} tone="warn" icon={Mail} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Members</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">Team roster</h3>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {data.members.map((member) => (
              <motion.div key={member.id} whileHover={{ y: -4 }} className="premium-dark-card flex flex-col gap-4 rounded-[28px] p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-lg font-semibold text-white">
                      {member.name?.slice(0, 1)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-sm text-gray-300">{member.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={member.role}
                    disabled={!isAdmin || member.id === user?.id}
                    onChange={(event) => handleRoleChange(member.id, event.target.value)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white disabled:opacity-60"
                  >
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                    <option value="viewer">viewer</option>
                  </select>
                  {isAdmin && member.id !== user?.id ? (
                    <button type="button" onClick={() => handleRemoveMember(member.id)} className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-200">
                      <Trash2 size={15} />
                      Remove
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleInvite} className="glass-panel rounded-[30px] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Invite</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">Add teammates</h3>
            <div className="mt-6 space-y-4">
              <input
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@example.com"
                disabled={!isAdmin}
                className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 disabled:opacity-60 dark:bg-slate-900/60 dark:text-white"
              />
              <select
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value)}
                disabled={!isAdmin}
                className="w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 disabled:opacity-60 dark:bg-slate-900/60 dark:text-white"
              >
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={!isAdmin || submitting} className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white disabled:opacity-60">
              <UserPlus size={16} />
              Generate invite
            </button>
            {inviteLink ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-gray-200">
                <p className="break-all">{inviteLink}</p>
                <button type="button" onClick={() => copyInvite(inviteLink)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white">
                  <Copy size={15} />
                  Copy link
                </button>
              </div>
            ) : null}
          </form>

          <div className="glass-panel rounded-[30px] p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Contribution</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">Member-wise impact</h3>
            <div className="mt-5 space-y-3">
              {analytics.memberContributions?.map((member) => (
                <div key={member.memberId} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-300">{member.projectsAssigned} assigned</p>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-gray-300 md:grid-cols-3">
                    <span>{formatCurrency(member.earnings)} earned</span>
                    <span>{member.hours}h logged</span>
                    <span>{formatRate(member.effectiveRate)} effective</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[30px] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Activity Feed</p>
        <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">Recent team moves</h3>
        <div className="mt-5 space-y-3">
          {data.activityFeed.map((activity) => (
            <div key={activity.id} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-white">
              <p>{activity.message}</p>
              <p className="mt-2 text-sm text-gray-300">{new Date(activity.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default TeamPage;
