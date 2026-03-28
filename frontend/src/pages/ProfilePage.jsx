import { Camera, Mail, PencilLine, Phone, Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import SectionHeading from "../components/SectionHeading";
import StatsCard from "../components/StatsCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ProfilePage = () => {
  const { user, refreshProfile, updateProfile } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refreshProfile().catch(() => null);
  }, []);

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await updateProfile(form);
      setIsEditing(false);
      pushToast({ tone: "success", title: "Profile updated", description: "Your account details were saved." });
    } catch (error) {
      pushToast({ tone: "error", title: "Could not update profile", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Profile"
        title="Personal details and account identity"
        description="Manage your contact details, avatar, and presentation across the app."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Name" value={user?.name || "Unknown"} hint="Primary display name" icon={UserRound} />
        <StatsCard label="Email" value={user?.email || "Unknown"} hint="Connected to authentication" icon={Mail} />
        <StatsCard label="Phone" value={user?.phone || "Unknown"} hint="Visible in your profile" icon={Phone} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-panel rounded-[32px] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Avatar</p>
          <div className="mt-6 flex flex-col items-center">
            {form.avatar ? (
              <img src={form.avatar} alt={form.name} className="h-40 w-40 rounded-full object-cover ring-4 ring-teal-500/20" />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-5xl font-semibold text-white">
                {form.name?.slice(0, 1)?.toUpperCase() || "U"}
              </div>
            )}
            <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
              <Camera size={16} />
              Upload avatar
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSave} className="glass-panel rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Profile Form</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                Edit your profile
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-white/10 dark:text-white"
            >
              <PencilLine size={16} />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["name", "User Name"],
              ["email", "Email"],
              ["phone", "Phone Number"],
            ].map(([name, label]) => (
              <label key={name} className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {label}
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-900/60 dark:text-white"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={!isEditing || saving}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </PageShell>
  );
};

export default ProfilePage;

