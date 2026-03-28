import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { teamService } from "../services/api";

const TeamJoinPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const { pushToast } = useToast();
  const [status, setStatus] = useState("Joining your team workspace...");

  useEffect(() => {
    const joinTeam = async () => {
      try {
        await teamService.join({ token });
        await refreshProfile();
        setStatus("Invite accepted. Redirecting to team workspace...");
        pushToast({ tone: "success", title: "Team joined", description: "You are now part of the shared workspace." });
        setTimeout(() => navigate("/team"), 1200);
      } catch (error) {
        setStatus(error.message);
      }
    };

    joinTeam();
  }, [token, refreshProfile, navigate, pushToast]);

  return (
    <PageShell>
      <div className="premium-dark-card mx-auto max-w-2xl rounded-[32px] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-300">Team Invite</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">Joining collaboration workspace</h1>
        <p className="mt-4 text-base text-gray-300">{status}</p>
      </div>
    </PageShell>
  );
};

export default TeamJoinPage;
