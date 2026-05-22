"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./PricingTabs.module.scss";
import checkmark from "../public/icon-checkmark.svg";
import focusRoom from "../public/focus-room.webp";
import studio from "../public/meeting-rooms.webp";
import boardRoom from "../public/boardroom.webp";

type Tab = "openSpace" | "fixedDesk" | "meetingRoom";

const tabs: { id: Tab; label: string }[] = [
  { id: "openSpace", label: "Open Space" },
  { id: "fixedDesk", label: "Fixed Desk" },
  { id: "meetingRoom", label: "Meeting Room" },
];

const plans: Record<
  Tab,
  {
    image?: string;
    name: string;
    badge: string | null;
    price: string;
    unit?: string;
    desc: string;
    features: string[];
    cta: string;
    filled: boolean;
  }[]
> = {
  openSpace: [
    {
      name: "Day Pass",
      badge: "First day free!",
      price: "$10",
      desc: "Perfect for trying out Spark for a day",
      features: [
        "Access to all open space zones",
        "High-speed Wi-Fi",
        "Coffee, tea & kitchen access",
      ],
      cta: "TRY FOR FREE",
      filled: false,
    },
    {
      name: "Week Pass",
      badge: null,
      price: "$63",
      desc: "Flexible pass for a productive week",
      features: [
        "Access to all open space zones",
        "High-speed Wi-Fi",
        "Coffee, tea & kitchen access",
      ],
      cta: "BOOK A SEAT",
      filled: false,
    },
    {
      name: "Monthly",
      badge: "save $30",
      price: "$210",
      desc: "Best value for regular members",
      features: [
        "Access to all open space zones",
        "High-speed Wi-Fi",
        "Coffee, tea & kitchen access",
      ],
      cta: "BOOK A SEAT",
      filled: true,
    },
  ],
  fixedDesk: [
    {
      name: "Day Pass",
      badge: null,
      price: "$15",
      desc: "Try a dedicated desk for a day",
      features: [
        "Your own dedicated desk",
        "High-speed Wi-Fi",
        "Coffee, tea & kitchen access",
      ],
      cta: "BOOK A SEAT",
      filled: false,
    },
    {
      name: "Week Pass",
      badge: null,
      price: "$95",
      desc: "Flexible access for a productive week",
      features: [
        "Your own dedicated desk",
        "Personal storage locker",
        "High-speed Wi-Fi",
        "Coffee, tea & kitchen access",
      ],
      cta: "BOOK A SEAT",
      filled: false,
    },
    {
      name: "Monthly",
      badge: "best value",
      price: "$350",
      desc: "Best value for regular members",
      features: [
        "Your own dedicated desk",
        "Personal storage locker",
        "High-speed Wi-Fi",
        "Coffee, tea & kitchen access",
      ],
      cta: "BOOK A SEAT",
      filled: true,
    },
  ],
  meetingRoom: [
    {
      image: focusRoom.src,
      name: "The Focus Room",
      badge: null,
      price: "$15",
      unit: "/hour",
      desc: "Ideal for calls, interviews & focused work",
      features: [
        "Seats up to 4 people",
        "High-speed Wi-Fi",
        "Whiteboard & marker kit",
        "43″ display & video conferencing",
      ],
      cta: "BOOK A ROOM",
      filled: false,
    },
    {
      image: studio.src,
      name: "The Studio",
      badge: null,
      price: "$28",
      unit: "/hour",
      desc: "Great for workshops & team presentations",
      features: [
        "Seats up to 12 people",
        "High-speed Wi-Fi",
        "Whiteboard & marker kit",
        "65″ display & video conferencing",
      ],
      cta: "BOOK A ROOM",
      filled: false,
    },
    {
      image: boardRoom.src,
      name: "The Boardroom",
      badge: null,
      price: "$45",
      unit: "/hour",
      desc: "Fully equipped for large meetings & events",
      features: [
        "Seats up to 16 people",
        "High-speed Wi-Fi",
        "Whiteboard & marker kit",
        "75″ display & studio-grade audio",
      ],
      cta: "BOOK A ROOM",
      filled: true,
    },
  ],
};

export default function PricingTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("openSpace");
  const activePlans = plans[activeTab];

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabsRow}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.planGrid}>
        {activePlans.map((plan) => (
          <div key={plan.name} className={styles.planCard}>
            {plan.image ? (
              <div className={styles.planHeaderImage}>
                <img src={plan.image} alt="" className={styles.planHeaderImageImage} />
                <div className={styles.planHeaderImageOverlay}></div>
                <span className={styles.planHeaderImageTitle}>
                  {plan.name}
                </span>
              </div>
            ) : (
              <div className={styles.planHeader}>
                <span className={styles.planName}>{plan.name}</span>
                {plan.badge && (
                  <span className={styles.planBadge}>{plan.badge}</span>
                )}
              </div>
            )}
            <p className={styles.planPrice}>
              {plan.price}
              {plan.unit && (
                <span className={styles.planUnit}>{plan.unit}</span>
              )}
            </p>
            <p className={styles.planDesc}>{plan.desc}</p>
            <ul className={styles.planFeatures}>
              {plan.features.map((f) => (
                <li key={f} className={styles.planFeature}>
                  <span className={styles.checkmark}>
                    <img src={checkmark.src} alt={f} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/book"
              className={`button-secondary-outline ${styles.planCta}`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
