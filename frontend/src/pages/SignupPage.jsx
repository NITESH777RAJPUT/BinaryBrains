import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const SignupPage = () => {
  const { signup } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await signup(form);
      pushToast({ tone: "success", title: "Account created", description: "Let's start tracking profits." });
      navigate("/dashboard");
    } catch (error) {
      pushToast({ tone: "error", title: "Signup failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-panel w-full max-w-2xl rounded-[36px] p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Create Account</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-slate-900 dark:text-white">
          Build a healthier freelance portfolio
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          {[
            ["name", "Full Name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone Number", "text"],
            ["password", "Password", "password"],
          ].map(([name, label, type]) => (
            <label key={name} className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {label}
              <input
                type={type}
                value={form[name]}
                onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                required
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-slate-900 dark:bg-slate-900/60 dark:text-white"
              />
            </label>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-teal-600 dark:text-teal-300">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
};

export default SignupPage;
