"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import styles from "./Navbar.module.scss";

export default function Navbar({ color = "white", hideLinks = false }: { color?: "white" | "black"; hideLinks?: boolean }) {
  const { user, loadFromStorage } = useAuthStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const handler = () => {
      const currentY = window.scrollY;
      const prev = lastScrollY.current;

      if (currentY <= 80) {
        setScrolled(false);
        setHidden(false);
      } else {
        setScrolled(true);
        setHidden(currentY > prev);
      }

      lastScrollY.current = currentY;
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isSolid = scrolled || menuOpen;
  const isHidden = hidden && !menuOpen;

  const navLinks = [
    { href: "/locations", label: "LOCATIONS" },
    { href: "/pricing", label: "PRICING" },
    { href: "/about", label: "ABOUT US" },
    { href: "/events", label: "EVENTS" },
  ];

  return (
    <header
      className={`${styles.header} ${isSolid ? styles.solid : ""} ${isHidden ? styles.hidden : ""} ${color === "black" && !isSolid ? styles.darkText : ""}`}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          SPARK
        </Link>

        {!hideLinks && (
          <nav className={styles.nav}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.navLink} ${pathname === l.href ? styles.active : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        {!hideLinks && (<div className={styles.actions}>
          {user?.role === "ADMIN" && (
            <Link href="/admin" className={styles.accountLink}>
              ADMIN
            </Link>
          )}
          {user ? (
            <Link href="/dashboard" className={styles.accountLink}>
              ACCOUNT
            </Link>
          ) : (
            <Link href="/login" className={styles.accountLink}>
              LOG IN
            </Link>
          )}
          <Link
            href="/book"
            className={`${color === "black" && !isSolid ? "button-secondary" : "button-primary-small"} ${styles.navButton}`}
          >
            BOOK A SEAT
          </Link>

          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>)}
      </div>

      {!hideLinks && (
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.opened : ""}`}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.mobileLink} ${pathname === l.href ? styles.mobileLinkActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              ADMIN
            </Link>
          )}
          {user ? (
            <Link href="/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              ACCOUNT
            </Link>
          ) : (
            <Link href="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              LOG IN
            </Link>
          )}
          <Link href="/book" className={styles.mobileLinkCta} onClick={() => setMenuOpen(false)}>
            BOOK A SEAT
          </Link>
        </div>
      )}
    </header>
  );
}
