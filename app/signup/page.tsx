"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "./page.module.scss";
import Navbar from "@/components/Navbar";
import heroImage from "../../public/hero.webp";

export default function SignupPage() {
  const { register, user, isLoading, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
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
      await register(form);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : null;
      setError(msg || "Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      <Navbar color="black" hideLinks={true} />
      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <h1 className={styles.title}>Sign Up</h1>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>First Name</label>
              <input
                type="text"
                placeholder="Pavlo"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                placeholder="+380 000000000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={styles.input}
              />
            </div>
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
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={styles.input}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`button-secondary ${styles.submitBtn}`}
            >
              {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
            <p className={styles.terms}>
              By signing up, you agree to our <span>Terms</span> &amp;{" "}
              <span>Privacy Policy</span>
            </p>
          </form>

          <p className={styles.footer}>
            Already have an account? <Link href="/login">Log in</Link>
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
