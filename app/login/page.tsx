"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "./page.module.scss";
import Navbar from "@/components/Navbar";
import heroImage from "../../public/hero.webp";

export default function LoginPage() {
  const { login, user, isLoading, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);
  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : null;
      setError(msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      <Navbar color="black" hideLinks="true" />
      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <h1 className={styles.title}>Log In</h1>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={styles.input}
              />
            </div>
            <p className={styles.forgotRow}>
              <button type="button" className={styles.forgotBtn}>
                Forgot password?
              </button>
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className={`button-secondary ${styles.submitBtn}`}
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          <p className={styles.footer}>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </div>

      <div className={styles.imageSide}>
        <div className={styles.imageSideInner}>
          <img src={heroImage.src} alt="" />
        </div>
      </div>
    </div>
  );
}
