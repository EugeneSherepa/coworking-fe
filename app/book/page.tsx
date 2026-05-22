"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import {
  Workspace,
  Location,
  WorkspaceType,
  BookingPlan,
  LOCATION_LABELS,
  LOCATION_ADDRESSES,
  WORKSPACE_TYPE_LABELS,
  PLAN_LABELS,
} from "@/types";
import styles from "./page.module.scss";
import iconClock from "../../public/icon-clock.svg";
import iconlocation from "../../public/icon-location.svg";
import firstOffice from "../../public/firstOffice.webp";
import secondOffice from "../../public/officeSecond.webp";
import thirdOffice from "../../public/thirdOffice.webp";
import fixedDesk from "../../public/fixed-desk.webp";
import openSpace from "../../public/open-space-second.webp";
import meetingRoom from "../../public/meeting-room.webp";
import focusRoom from "../../public/focus-room.webp";
import studio from "../../public/meeting-rooms.webp";
import boardRoom from "../../public/boardroom.webp";
import checkmark from "../../public/icon-checkmark.svg";

type Step = "location" | "type" | "plan" | "details" | "confirmed";

const STEPS: Step[] = ["location", "type", "plan", "details", "confirmed"];

const STEP_LABELS: Record<Step, string> = {
  location: "Location",
  type: "Workspace type",
  plan: "Booking plan",
  details: "Details",
  confirmed: "Payment",
};

interface LocationDetail {
  key: Location;
  desc: string;
  image: string;
  images: string[];
  includes: string[];
}

const LOCATION_DETAILS: LocationDetail[] = [
  {
    key: "PODIL",
    desc: "Cozy space in the historic Podil district with a creative atmosphere and riverside views. Designed for both focused work and collaboration.",
    image: firstOffice.src,
    images: [firstOffice.src, openSpace.src, meetingRoom.src],
    includes: [
      "High-speed Wi-Fi",
      "Meeting rooms",
      "Kitchen access",
      "Lounge areas",
      "Pet-friendly",
      "Free coffee & tea",
      "Community events",
      "Free underground parking",
    ],
  },
  {
    key: "PECHERSK",
    desc: "Modern coworking in the city center, close to business hubs and metro. Ideal for professionals and entrepreneurs.",
    image: secondOffice.src,
    images: [secondOffice.src, fixedDesk.src, meetingRoom.src],
    includes: [
      "High-speed Wi-Fi",
      "Meeting rooms",
      "Kitchen access",
      "Lounge areas",
      "Pet-friendly",
      "Free coffee & tea",
      "Community events",
    ],
  },
  {
    key: "OSOKORKY",
    desc: "Bright workspace near the lake, perfect for focus and relaxation. Enjoy natural surroundings while staying productive.",
    image: thirdOffice.src,
    images: [thirdOffice.src, openSpace.src, fixedDesk.src],
    includes: [
      "High-speed Wi-Fi",
      "Meeting rooms",
      "Kitchen access",
      "Lounge areas",
      "Pet-friendly",
      "Free coffee & tea",
      "Community events",
    ],
  },
];

const PLAN_RATES: Record<Exclude<BookingPlan, "HOUR">, { days: number }> = {
  DAY: { days: 1 },
  WEEK: { days: 7 },
  MONTH: { days: 30 },
};

const MEETING_ROOMS = [
  {
    name: "The Focus Room",
    hourlyRate: 15,
    image: focusRoom.src,
    desc: "Ideal for calls, interviews & focused work",
    features: [
      "Seats up to 4 people",
      "High-speed Wi-Fi",
      "Whiteboard & marker kit",
      "43″ display & video conferencing",
    ],
  },
  {
    name: "The Studio",
    hourlyRate: 28,
    image: studio.src,
    desc: "Great for workshops & team presentations",
    features: [
      "Seats up to 12 people",
      "High-speed Wi-Fi",
      "Whiteboard & marker kit",
      "65″ display & video conferencing",
    ],
  },
  {
    name: "The Boardroom",
    hourlyRate: 45,
    image: boardRoom.src,
    desc: "Fully equipped for large meetings & events",
    features: [
      "Seats up to 16 people",
      "High-speed Wi-Fi",
      "Whiteboard & marker kit",
      "75″ display & studio-grade audio",
    ],
  },
];

const PLANS_BY_TYPE = {
  OPEN_SPACE: [
    {
      plan: "DAY" as BookingPlan,
      price: "$10",
      badge: "Office Test Drive",
      desc: "Perfect for trying out Spark for a day",
    },
    {
      plan: "WEEK" as BookingPlan,
      price: "$63",
      badge: null,
      desc: "Flexible pass for a productive week",
    },
    {
      plan: "MONTH" as BookingPlan,
      price: "$210",
      badge: "save $30",
      desc: "Best value for regular members",
    },
  ],
  FIXED_DESK: [
    {
      plan: "DAY" as BookingPlan,
      price: "$15",
      badge: null,
      desc: "Try a dedicated desk for a day",
    },
    {
      plan: "WEEK" as BookingPlan,
      price: "$95",
      badge: null,
      desc: "Flexible access for a productive week",
    },
    {
      plan: "MONTH" as BookingPlan,
      price: "$350",
      badge: "best value",
      desc: "Best value for regular members",
    },
  ],
};

function getPlanPrice(
  workspace: Workspace | null,
  plan: BookingPlan,
  hours = 1,
): number {
  if (!workspace) return 0;
  if (plan === "HOUR") return (workspace.hourlyRate ?? 0) * hours;
  if (plan === "DAY") return workspace.dailyRate ?? 0;
  if (plan === "WEEK") return workspace.weeklyRate ?? 0;
  return workspace.monthlyRate ?? 0;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookPage() {
  const { user, loadFromStorage } = useAuthStore();
  const router = useRouter();

  const [step, setStep] = useState<Step>("location");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [detailLocation, setDetailLocation] = useState<Location | null>(null);
  const [selectedType, setSelectedType] = useState<WorkspaceType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<BookingPlan | null>(null);
  const [selectedStartHour, setSelectedStartHour] = useState<number | null>(
    null,
  );
  const [selectedEndHour, setSelectedEndHour] = useState<number | null>(null);
  const [selectedMeetingRoom, setSelectedMeetingRoom] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [booking, setBooking] = useState<{ id: string; status: string } | null>(
    null,
  );
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalSlide, setModalSlide] = useState(0);

  useEffect(() => {
    setModalSlide(0);
  }, [detailLocation]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const fetchWorkspaces = useCallback(async () => {
    if (!selectedLocation || !selectedType) return;
    setLoadingWorkspaces(true);
    try {
      const res = await api.get("/workspaces", {
        params: {
          location: selectedLocation,
          type: selectedType,
          date: selectedDate.toISOString(),
        },
      });
      setWorkspaces(res.data);
    } catch {
      setWorkspaces([]);
    } finally {
      setLoadingWorkspaces(false);
    }
  }, [selectedLocation, selectedType, selectedDate]);

  useEffect(() => {
    if (step === "details") fetchWorkspaces();
  }, [step, fetchWorkspaces]);

  useEffect(() => {
    if (
      selectedType &&
      selectedType !== "FIXED_DESK" &&
      workspaces.length > 0
    ) {
      if (selectedType === "MEETING_ROOM" && selectedMeetingRoom) {
        const room =
          workspaces.find((w) => w.name === selectedMeetingRoom) ?? null;
        setSelectedWorkspace(room);
      } else if (selectedType === "OPEN_SPACE") {
        const first = workspaces.find((w) => !w.isBooked) ?? null;
        setSelectedWorkspace(first);
      }
    }
  }, [workspaces, selectedType, selectedMeetingRoom]);

  const stepIndex = STEPS.indexOf(step);

  const goToStep = (s: Step) => {
    if (STEPS.indexOf(s) <= stepIndex) setStep(s);
  };

  const handleBook = async () => {
    if (!selectedWorkspace || !selectedPlan) return;
    if (!user) {
      router.push("/login");
      return;
    }

    setSubmitting(true);
    setBookingError("");
    try {
      const start = new Date(selectedDate);
      let end: Date;
      if (selectedPlan === "HOUR") {
        start.setHours(selectedStartHour!, 0, 0, 0);
        end = new Date(
          start.getTime() +
            (selectedEndHour! - selectedStartHour!) * 60 * 60 * 1000,
        );
      } else {
        start.setHours(8, 0, 0, 0);
        end = addDays(start, PLAN_RATES[selectedPlan].days);
        end.setHours(20, 0, 0, 0);
      }

      const res = await api.post("/bookings", {
        workspaceId: selectedWorkspace.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        plan: selectedPlan,
      });
      setBooking(res.data);
      setStep("confirmed");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : null;
      setBookingError(msg || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const endDate =
    selectedPlan && selectedPlan !== "HOUR" && selectedPlan !== "DAY"
      ? addDays(selectedDate, PLAN_RATES[selectedPlan].days)
      : null;

  const locationDetail =
    LOCATION_DETAILS.find((l) => l.key === selectedLocation) ?? null;

  const planListForSummary =
    selectedType && selectedType !== "MEETING_ROOM"
      ? selectedType === "FIXED_DESK"
        ? PLANS_BY_TYPE.FIXED_DESK
        : PLANS_BY_TYPE.OPEN_SPACE
      : [];
  const currentPlanInfo =
    planListForSummary.find((p) => p.plan === selectedPlan) ?? null;
  const hourDuration =
    selectedStartHour !== null && selectedEndHour !== null
      ? selectedEndHour - selectedStartHour
      : 1;
  const nominalPriceNum = currentPlanInfo
    ? parseInt(currentPlanInfo.price.replace(/\D/g, ""))
    : getPlanPrice(selectedWorkspace, selectedPlan ?? "DAY", hourDuration);
  const actualPriceNum = getPlanPrice(
    selectedWorkspace,
    selectedPlan ?? "DAY",
    hourDuration,
  );
  const discountAmount = nominalPriceNum - actualPriceNum;

  const Breadcrumb = () => (
    <nav className={styles.breadcrumb}>
      {(STEPS.slice(0, -1) as Step[]).map((s, i) => (
        <span key={s} className={styles.breadcrumbItem}>
          {i > 0 && (
            <span className={styles.sep}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
          <button
            onClick={() => goToStep(s)}
            className={`${styles.breadcrumbBtn} ${STEPS.indexOf(s) <= stepIndex ? styles.breadcrumbDone : ""} ${s === step ? styles.breadcrumbCurrent : ""}`}
          >
            {STEP_LABELS[s]}
          </button>
        </span>
      ))}
    </nav>
  );

  return (
    <div className={styles.page}>
      <Navbar color="black" />
      <main className={styles.main}>
        {step !== "confirmed" && <Breadcrumb />}

        {/* STEP 1: Location */}
        {step === "location" && (
          <div>
            <h1 className={styles.stepTitle}>Choose a Location</h1>
            <div className={styles.locationGrid}>
              {LOCATION_DETAILS.map((loc) => (
                <div
                  key={loc.key}
                  className={`${styles.locationCard} ${selectedLocation === loc.key ? styles.locationCardSelected : ""}`}
                  onClick={() => setSelectedLocation(loc.key)}
                >
                  <div className={styles.locImg}>
                    <img src={loc.image} alt="" />
                  </div>
                  <div className={styles.locBody}>
                    <div>
                      <p className={styles.locName}>
                        {LOCATION_LABELS[loc.key]}
                      </p>
                      <p className={styles.locDesc}>{loc.desc}</p>
                    </div>
                    <div className={styles.locBottom}>
                      <p className={styles.locMeta}>
                        <img src={iconlocation.src} alt="" />
                        {LOCATION_ADDRESSES[loc.key]}
                      </p>
                      <p className={styles.locMeta}>
                        <img src={iconClock.src} alt="" />
                        Open daily, 9:00–20:00
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailLocation(loc.key);
                        }}
                        className={`${styles.viewMoreBtn} button-secondary-outline`}
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              disabled={!selectedLocation}
              onClick={() => setStep("type")}
              className={`${styles.continueBtn} button-secondary`}
            >
              CONTINUE
            </button>
          </div>
        )}

        {detailLocation && (
          <div
            className={styles.modalOverlay}
            onClick={() => setDetailLocation(null)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              {(() => {
                const imgs =
                  LOCATION_DETAILS.find((l) => l.key === detailLocation)
                    ?.images ?? [];
                return (
                  <div className={styles.modalImageWrap}>
                    <img
                      src={imgs[modalSlide]}
                      alt=""
                      className={styles.modalImg}
                    />
                    <button
                      className={`${styles.modalImageNav} ${styles.modalImageNavPrev}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalSlide(
                          (s) => (s - 1 + imgs.length) % imgs.length,
                        );
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M10 3L5 8L10 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className={`${styles.modalImageNav} ${styles.modalImageNavNext}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalSlide((s) => (s + 1) % imgs.length);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M6 3L11 8L6 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className={styles.modalDots}>
                      {imgs.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.modalDot} ${i === modalSlide ? styles.modalDotActive : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalSlide(i);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className={styles.modalBody}>
                <h2 className={styles.modalTitle}>
                  {LOCATION_LABELS[detailLocation]}
                </h2>
                <p className={styles.modalDesc}>
                  {LOCATION_DETAILS.find((l) => l.key === detailLocation)?.desc}
                </p>
                <p className={styles.modalMeta}>
                  <img src={iconlocation.src} alt="" />
                  {LOCATION_ADDRESSES[detailLocation]}
                </p>
                <p className={styles.modalMeta}>
                  <img src={iconClock.src} alt="" />
                  Open daily, 9:00–20:00
                </p>
                <p className={styles.modalIncludes}>What&apos;s included:</p>
                <div className={styles.modalTags}>
                  {LOCATION_DETAILS.find(
                    (l) => l.key === detailLocation,
                  )?.includes.map((inc) => (
                    <span key={inc} className={styles.modalTag}>
                      {inc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Workspace Type */}
        {step === "type" && (
          <div>
            <h1 className={styles.stepTitle}>Choose your Workspace Type</h1>
            <div className={styles.typeGrid}>
              {(
                [
                  {
                    type: "OPEN_SPACE",
                    icon: openSpace.src,
                    desc: "Bright, collaborative area perfect for networking and team projects. Flexible seating for all-day comfort",
                  },
                  {
                    type: "FIXED_DESK",
                    icon: fixedDesk.src,
                    desc: "Your own dedicated workspace with all the essentials. Ideal for focused work and personal setup",
                  },
                  {
                    type: "MEETING_ROOM",
                    icon: meetingRoom.src,
                    desc: "Private, fully-equipped meeting rooms for presentations, team discussions, and client calls",
                  },
                ] as { type: WorkspaceType; icon: string; desc: string }[]
              ).map((wt) => (
                <div
                  key={wt.type}
                  onClick={() => setSelectedType(wt.type)}
                  className={`${styles.typeCard} ${selectedType === wt.type ? styles.typeCardSelected : ""}`}
                >
                  <div className={styles.typeImg}>
                    <img src={wt.icon} alt="" />
                  </div>
                  <div className={styles.typeBody}>
                    <p className={styles.typeName}>
                      {WORKSPACE_TYPE_LABELS[wt.type]}
                    </p>
                    <p className={styles.typeDesc}>{wt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              disabled={!selectedType}
              onClick={() => setStep("plan")}
              className={`${styles.continueBtn} button-secondary`}
            >
              CONTINUE
            </button>
          </div>
        )}

        {/* STEP 3: Plan */}
        {step === "plan" && (
          <div>
            <h1 className={styles.stepTitle}>
              {selectedType === "MEETING_ROOM"
                ? "Choose Your Room"
                : "Choose Booking Plan"}
            </h1>

            {selectedType === "MEETING_ROOM" ? (
              <div className={styles.mrGrid}>
                {MEETING_ROOMS.map((room) => (
                  <div
                    key={room.name}
                    onClick={() => {
                      setSelectedMeetingRoom(room.name);
                      setSelectedPlan("HOUR");
                    }}
                    className={`${styles.mrCard} ${selectedMeetingRoom === room.name ? styles.mrCardSelected : ""}`}
                  >
                    <div className={styles.mrCardImageWrap}>
                      <img
                        src={room.image}
                        alt=""
                        className={styles.mrCardImg}
                      />
                      <div className={styles.mrCardImgOverlay} />
                      <span className={styles.mrCardImgTitle}>{room.name}</span>
                    </div>
                    <p className={styles.mrCardPrice}>
                      ${room.hourlyRate}
                      <span className={styles.mrCardUnit}>/hr</span>
                    </p>
                    <p className={styles.mrCardDesc}>{room.desc}</p>
                    <ul className={styles.mrCardFeatures}>
                      {room.features.map((f) => (
                        <li key={f} className={styles.mrCardFeature}>
                          <span className={styles.mrCheckmark}>
                            <img src={checkmark.src} alt="" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.planList}>
                {(selectedType === "FIXED_DESK"
                  ? PLANS_BY_TYPE.FIXED_DESK
                  : PLANS_BY_TYPE.OPEN_SPACE
                ).map((p) => (
                  <div
                    key={p.plan}
                    onClick={() => setSelectedPlan(p.plan)}
                    className={`${styles.planCard} ${selectedPlan === p.plan ? styles.planCardSelected : ""}`}
                  >
                    <div className={styles.planInfo}>
                      <div className={styles.planHeader}>
                        <p className={styles.planName}>{PLAN_LABELS[p.plan]}</p>
                        {p.badge && (
                          <span className={styles.planBadge}>{p.badge}</span>
                        )}
                      </div>
                      <p className={styles.planDesc}>{p.desc}</p>
                    </div>
                    <p className={styles.planPrice}>{p.price}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              disabled={
                selectedType === "MEETING_ROOM"
                  ? !selectedMeetingRoom
                  : !selectedPlan
              }
              onClick={() => setStep("details")}
              className={`${styles.continueBtn} button-secondary`}
            >
              CONTINUE
            </button>
          </div>
        )}

        {/* STEP 4: Details */}
        {step === "details" && selectedPlan && (
          <div className={styles.detailsGrid}>
            <div>
              <h1 className={styles.stepTitle2}>
                {selectedPlan === "HOUR"
                  ? "Choose date & time"
                  : selectedPlan === "DAY"
                    ? "Choose a date"
                    : "Select your booking period"}
              </h1>

              <div className={styles.calendarSection}>
                <CalendarPicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  plan={selectedPlan!}
                />
              </div>

              {selectedPlan === "HOUR" && (
                <div className={styles.timePicker}>
                  <p className={styles.timePickerLabel}>Choose your hours</p>
                  <div className={styles.timeOptions}>
                    {Array.from({ length: 12 }, (_, i) => 9 + i).map((h) => {
                      const isStart = selectedStartHour === h;
                      const isEnd = selectedEndHour === h;
                      const inRange =
                        selectedStartHour !== null && selectedEndHour !== null
                          ? h > selectedStartHour && h < selectedEndHour
                          : false;
                      return (
                        <button
                          key={h}
                          onClick={() => {
                            if (
                              selectedStartHour === null ||
                              selectedEndHour !== null ||
                              h <= selectedStartHour
                            ) {
                              setSelectedStartHour(h);
                              setSelectedEndHour(null);
                            } else {
                              setSelectedEndHour(h);
                            }
                          }}
                          className={`${styles.timeBtn} ${isStart || isEnd ? styles.timeBtnActive : ""} ${inRange ? styles.timeBtnInRange : ""}`}
                        >
                          {h}:00
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {loadingWorkspaces ? (
                <div className={styles.mapLoading}>Loading workspaces...</div>
              ) : selectedType === "FIXED_DESK" ? (
                <FixedDeskMap
                  workspaces={workspaces}
                  selected={selectedWorkspace}
                  onSelect={setSelectedWorkspace}
                />
              ) : null}

              {bookingError && (
                <div className={styles.bookingError}>{bookingError}</div>
              )}
            </div>

            <div className={styles.summaryWrapper}>
              <div className={styles.summary}>
                <div className={styles.summaryHeader}>
                  <div className={styles.summaryIcon}>
                    {locationDetail?.image ? (
                      <img src={locationDetail.image} alt="" />
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="8.5"
                          cy="10.5"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M3 16l4-4 3 3 3-4 5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={styles.summaryName}>
                      {selectedLocation && LOCATION_LABELS[selectedLocation]}
                    </p>
                    <p className={styles.summaryAddr}>
                      {selectedLocation && LOCATION_ADDRESSES[selectedLocation]}
                    </p>
                  </div>
                </div>

                <p className={styles.summaryMeta}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 9h18M8 2v4M16 2v4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {selectedPlan === "HOUR"
                    ? selectedStartHour && selectedEndHour
                      ? `${formatDate(selectedDate)}, ${selectedStartHour}:00 – ${selectedEndHour}:00`
                      : formatDate(selectedDate)
                    : selectedPlan === "DAY"
                      ? formatDate(selectedDate)
                      : `${formatDate(selectedDate)} – ${endDate ? formatDate(endDate) : "..."}`}
                </p>
                {selectedType && (
                  <p className={styles.summaryMeta}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.60059 14.7996V17.1994M4.40052 8.40013V4.40044C4.40052 3.97613 4.56908 3.5692 4.86912 3.26916C5.16915 2.96913 5.57609 2.80057 6.0004 2.80057H13.9998C14.4241 2.80057 14.831 2.96913 15.1311 3.26916C15.4311 3.5692 15.5997 3.97613 15.5997 4.40044V8.40013"
                        stroke="#8E8F96"
                        strokeWidth="1.19991"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.3989 14.7997H3.59988V12.3599C3.22914 12.2842 2.88748 12.1049 2.61457 11.8428C2.34167 11.5807 2.14872 11.2465 2.05815 10.8792C1.96757 10.5118 1.98307 10.1262 2.10286 9.76732C2.22265 9.4084 2.4418 9.09083 2.73487 8.85149C3.02794 8.61215 3.3829 8.46086 3.75852 8.4152C4.13414 8.36954 4.515 8.43138 4.85688 8.59353C5.19875 8.75569 5.48761 9.01151 5.6899 9.33127C5.89219 9.65104 5.99961 10.0216 5.99969 10.4V11.5999H13.9991V10.4C13.9991 9.86963 14.2098 9.36096 14.5848 8.98592C14.9599 8.61088 15.4685 8.40018 15.9989 8.40018C16.4949 8.39968 16.9733 8.58348 17.3413 8.91589C17.7094 9.2483 17.9408 9.70561 17.9906 10.199C18.0405 10.6925 17.9052 11.1868 17.6111 11.5861C17.3169 11.9854 16.8849 12.2612 16.3989 12.3599V14.7997ZM16.3989 14.7997V17.1995"
                        stroke="#8E8F96"
                        strokeWidth="1.19991"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {WORKSPACE_TYPE_LABELS[selectedType]}
                    {selectedWorkspace &&
                      selectedType === "MEETING_ROOM" &&
                      ` · ${selectedWorkspace.name ?? selectedWorkspace.number}`}
                    {selectedWorkspace &&
                      selectedType === "FIXED_DESK" &&
                      ` · Desk ${selectedWorkspace.number}`}
                  </p>
                )}

                <div className={styles.summaryRow}>
                  <span>
                    {selectedPlan === "HOUR"
                      ? `${hourDuration}h × $${selectedWorkspace?.hourlyRate ?? "?"}/hr`
                      : PLAN_LABELS[selectedPlan!]}
                  </span>
                  <span>
                    {selectedPlan === "HOUR"
                      ? `$${actualPriceNum}`
                      : (currentPlanInfo?.price ?? `$${actualPriceNum}`)}
                  </span>
                </div>
                {!user && selectedPlan === "DAY" && discountAmount > 0 && (
                  <div className={styles.summaryRowStrike}>
                    <div className={styles.summaryRowStrikeLeft}>
                      <div className={styles.summaryRowStrikeLeftTop}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0003 18.3333C14.6028 18.3333 18.3337 14.6025 18.3337 9.99999C18.3337 5.39749 14.6028 1.66666 10.0003 1.66666C5.39783 1.66666 1.66699 5.39749 1.66699 9.99999C1.66699 14.6025 5.39783 18.3333 10.0003 18.3333Z"
                            stroke="#323236"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.917 13.3333C13.0275 13.3333 13.1335 13.2894 13.2116 13.2113C13.2898 13.1331 13.3337 13.0272 13.3337 12.9167C13.3337 12.8061 13.2898 12.7002 13.2116 12.622C13.1335 12.5439 13.0275 12.5 12.917 12.5C12.8065 12.5 12.7005 12.5439 12.6224 12.622C12.5442 12.7002 12.5003 12.8061 12.5003 12.9167C12.5003 13.0272 12.5442 13.1331 12.6224 13.2113C12.7005 13.2894 12.8065 13.3333 12.917 13.3333ZM7.08366 7.49999C7.19417 7.49999 7.30015 7.45609 7.37829 7.37795C7.45643 7.29981 7.50033 7.19383 7.50033 7.08332C7.50033 6.97282 7.45643 6.86684 7.37829 6.7887C7.30015 6.71055 7.19417 6.66666 7.08366 6.66666C6.97315 6.66666 6.86717 6.71055 6.78903 6.7887C6.71089 6.86684 6.66699 6.97282 6.66699 7.08332C6.66699 7.19383 6.71089 7.29981 6.78903 7.37795C6.86717 7.45609 6.97315 7.49999 7.08366 7.49999Z"
                            fill="#323236"
                            stroke="#323236"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13.3337 6.66666L6.66699 13.3333"
                            stroke="#323236"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{currentPlanInfo?.badge ?? "Discount"}</span>
                      </div>
                      One free day for first-time guests
                    </div>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${actualPriceNum}</span>
                </div>

                <div className={styles.summaryTotalBottom}>
                  <button
                    disabled={
                      (selectedType === "FIXED_DESK"
                        ? !selectedWorkspace
                        : selectedType === "MEETING_ROOM"
                          ? !selectedWorkspace ||
                            !selectedStartHour ||
                            !selectedEndHour
                          : false) || submitting
                    }
                    onClick={user ? handleBook : () => router.push("/login")}
                    className={`button-secondary`}
                  >
                    {submitting
                      ? "BOOKING..."
                      : user
                        ? `CONFIRM & PAY · $${actualPriceNum}`
                        : "LOG IN TO BOOK"}
                  </button>

                  {user && (
                    <button
                      disabled={
                        (selectedType === "FIXED_DESK"
                          ? !selectedWorkspace
                          : selectedType === "MEETING_ROOM"
                            ? !selectedWorkspace ||
                              !selectedStartHour ||
                              !selectedEndHour
                            : false) || submitting
                      }
                      onClick={user ? handleBook : () => router.push("/login")}
                      className={`button-secondary-outline`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.0502 20.28C16.0702 21.23 15.0002 21.08 13.9702 20.63C12.8802 20.17 11.8802 20.15 10.7302 20.63C9.29016 21.25 8.53016 21.07 7.67016 20.28C2.79016 15.25 3.51016 7.59 9.05016 7.31C10.4002 7.38 11.3402 8.05 12.1302 8.11C13.3102 7.87 14.4402 7.18 15.7002 7.27C17.2102 7.39 18.3502 7.99 19.1002 9.07C15.9802 10.94 16.7202 15.05 19.5802 16.2C19.0102 17.7 18.2702 19.19 17.0402 20.29L17.0502 20.28ZM12.0302 7.25C11.8802 5.02 13.6902 3.18 15.7702 3C16.0602 5.58 13.4302 7.5 12.0302 7.25Z"
                          fill="black"
                        />
                      </svg>
                      APPLE PAY
                    </button>
                  )}

                  {user && (
                    <button
                      disabled={
                        (selectedType === "FIXED_DESK"
                          ? !selectedWorkspace
                          : selectedType === "MEETING_ROOM"
                            ? !selectedWorkspace ||
                              !selectedStartHour ||
                              !selectedEndHour
                            : false) || submitting
                      }
                      onClick={user ? handleBook : () => router.push("/login")}
                      className={`button-secondary-outline`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.3767 11.28H12.841V13.464H18.1908C17.9196 16.512 15.3146 17.816 12.8493 17.816C9.70185 17.816 6.94068 15.4 6.94068 12C6.94068 8.72 9.57036 6.184 12.8575 6.184C15.3968 6.184 16.8842 7.76 16.8842 7.76L18.4456 6.176C18.4456 6.176 16.4404 4 12.7753 4C8.1076 4 4.5 7.84 4.5 12C4.5 16.04 7.89394 20 12.8986 20C17.2951 20 20.5 17.064 20.5 12.728C20.5 11.808 20.3767 11.28 20.3767 11.28Z"
                          fill="black"
                        />
                      </svg>
                      GOOGLE PAY
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Confirmed */}
        {step === "confirmed" && booking && selectedWorkspace && (
          <div className={styles.confirmedPage}>
            <div className={styles.confirmedCheckCircle}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7998 25.6L19.1998 32L35.1998 16"
                  stroke="#323236"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className={styles.confirmedHeading}>
              Booking confirmed.
              <br />
              See you at Spark.
            </h1>
            <p className={styles.confirmedSubtitle}>
              We sent a confirmation to your email with a QR code for the front
              desk. You can find this booking any time in your account.
            </p>

            <div className={styles.confirmedReceipt}>
              <div className={styles.confirmedReceiptRow}>
                <span className={styles.confirmedReceiptLabel}>Location</span>
                <span className={styles.confirmedReceiptValue}>
                  {selectedLocation && LOCATION_LABELS[selectedLocation]}
                </span>
              </div>
              <div className={styles.confirmedReceiptRow}>
                <span className={styles.confirmedReceiptLabel}>Workspace</span>
                <span className={styles.confirmedReceiptValue}>
                  {selectedType === "MEETING_ROOM"
                    ? (selectedWorkspace.name ??
                      WORKSPACE_TYPE_LABELS[selectedWorkspace.type])
                    : WORKSPACE_TYPE_LABELS[selectedWorkspace.type]}
                </span>
              </div>
              <div className={styles.confirmedReceiptRow}>
                <span className={styles.confirmedReceiptLabel}>Plan</span>
                <span className={styles.confirmedReceiptValue}>
                  {selectedPlan && PLAN_LABELS[selectedPlan]}
                </span>
              </div>
              <div className={styles.confirmedReceiptRow}>
                <span className={styles.confirmedReceiptLabel}>Date</span>
                <span className={styles.confirmedReceiptValue}>
                  {selectedPlan === "HOUR" &&
                  selectedStartHour &&
                  selectedEndHour
                    ? `${formatDate(selectedDate)}, ${selectedStartHour}:00–${selectedEndHour}:00`
                    : selectedPlan === "DAY"
                      ? formatDate(selectedDate)
                      : `${formatDate(selectedDate)} – ${endDate ? formatDate(endDate) : ""}`}
                </span>
              </div>
              {selectedType === "FIXED_DESK" && (
                <div className={styles.confirmedReceiptRow}>
                  <span className={styles.confirmedReceiptLabel}>Desk</span>
                  <span className={styles.confirmedReceiptValue}>
                    {selectedWorkspace.number}
                  </span>
                </div>
              )}
              <div
                className={`${styles.confirmedReceiptRow} ${styles.confirmedReceiptRowTotal}`}
              >
                <span className={styles.confirmedReceiptLabel}>Total paid</span>
                <span className={styles.confirmedReceiptRowTotalconfirmedReceiptValue}>
                  ${actualPriceNum}
                </span>
              </div>
            </div>

            <div className={styles.confirmedActions}>
              <button
                onClick={() => router.push("/dashboard")}
                className={`button-secondary`}
              >
                GO TO MY BOOKINGS
              </button>
              <button className={`button-secondary-outline`}>
                DOWNLOAD INVOICE
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ─── Calendar Picker ──────────────────────────────────────────────────────────

function CalendarPicker({
  selected,
  onChange,
  plan,
}: {
  selected: Date;
  onChange: (d: Date) => void;
  plan: BookingPlan;
}) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleString("en-US", { month: "long" });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selNorm = new Date(
    selected.getFullYear(),
    selected.getMonth(),
    selected.getDate(),
  );
  const endSelected =
    plan === "HOUR" || plan === "DAY"
      ? selNorm
      : addDays(
          selNorm,
          PLAN_RATES[plan as Exclude<BookingPlan, "HOUR">].days - 1,
        );

  const isInRange = (d: Date) => {
    if (plan === "DAY" || plan === "HOUR") return false;
    return d > selNorm && d < endSelected;
  };

  const cells: (number | null)[] = [];
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  return (
    <div className={styles.calendar}>
      <div className={styles.calHeader}>
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className={styles.calNavBtn}
        >
          ‹
        </button>
        <p className={styles.calMonth}>
          {monthName} {year}
        </p>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className={styles.calNavBtn}
        >
          ›
        </button>
      </div>
      <div className={styles.calDays}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);
          const isPast = date < today;
          const isSelected = date.getTime() === selNorm.getTime();
          const isEnd =
            plan !== "DAY" &&
            plan !== "HOUR" &&
            date.getTime() === endSelected.getTime();
          const inRange = isInRange(date);
          const dayLabel = date.toLocaleString("en-US", { weekday: "short" });

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onChange(date)}
              className={`${styles.calDay} ${isSelected || isEnd ? styles.calDaySelected : ""} ${inRange ? styles.calDayInRange : ""}`}
            >
              <span className={styles.calDayNum}>{day}</span>
              <span className={styles.calDayLabel}>{dayLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Fixed Desk Map ───────────────────────────────────────────────────────────

const DESK_RECTS: Record<
  string,
  { x: number; y: number; w: number; h: number }
> = {
  A1: { x: 20.77, y: 46.15, w: 43.08, h: 29.23 },
  A2: { x: 78, y: 46.77, w: 43.08, h: 29.23 },
  A3: { x: 152, y: 46.77, w: 43.08, h: 29.23 },
  A4: { x: 209, y: 46.77, w: 43.08, h: 29.23 },
  A5: { x: 21, y: 110.77, w: 43.08, h: 29.23 },
  A6: { x: 78.23, y: 111.38, w: 43.08, h: 29.24 },
  A7: { x: 152, y: 111.77, w: 43.08, h: 29.23 },
  A8: { x: 209.23, y: 111.38, w: 43.08, h: 29.24 },
  B1: { x: 347, y: 46.77, w: 43.08, h: 29.23 },
  B2: { x: 404.23, y: 47.38, w: 43.08, h: 29.24 },
  B3: { x: 478.23, y: 47.38, w: 43.08, h: 29.24 },
  B4: { x: 535.23, y: 47.38, w: 43.08, h: 29.24 },
  B5: { x: 347.23, y: 111.38, w: 43.08, h: 29.24 },
  B6: { x: 404.46, y: 112, w: 43.08, h: 29.23 },
  B7: { x: 478.23, y: 112.38, w: 43.08, h: 29.24 },
  B8: { x: 535.46, y: 112, w: 43.08, h: 29.23 },
  O1: { x: 185, y: 211.77, w: 43.08, h: 29.23 },
  O2: { x: 242.23, y: 212.38, w: 43.08, h: 29.24 },
  O3: { x: 316.23, y: 212.38, w: 43.08, h: 29.24 },
  O4: { x: 373.23, y: 212.38, w: 43.08, h: 29.24 },
  O5: { x: 185.23, y: 257.38, w: 43.08, h: 29.24 },
  O6: { x: 242.46, y: 258, w: 43.08, h: 29.23 },
  O7: { x: 316.23, y: 258.38, w: 43.08, h: 29.24 },
  O8: { x: 373.46, y: 258, w: 43.08, h: 29.23 },
};

function FixedDeskMap({
  workspaces,
  selected,
  onSelect,
}: {
  workspaces: Workspace[];
  selected: Workspace | null;
  onSelect: (w: Workspace) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredWs = hoveredId
    ? (workspaces.find((w) => w.id === hoveredId) ?? null)
    : null;

  if (workspaces.length === 0) {
    return (
      <div className={styles.floorMapEmpty}>
        No fixed desks available for this selection
      </div>
    );
  }

  return (
    <div className={styles.deskMapWrap}>
      <div className={styles.deskMapWrapTitle}>Pick your desk</div>
      <div className={styles.deskMapInner}>
        <img
          src="/fixed-desk-plan.svg"
          alt="Floor plan"
          className={styles.deskMapImg}
        />
        <svg
          viewBox="0 0 600 308"
          className={styles.deskMapOverlay}
          xmlns="http://www.w3.org/2000/svg"
        >
          {workspaces.map((w) => {
            const r = DESK_RECTS[w.number];
            if (!r) return null;
            const isBooked = !!w.isBooked;
            const isSelected = selected?.id === w.id;
            const isHov = hoveredId === w.id;
            return (
              <rect
                key={w.id}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx={1.3}
                fill={
                  isSelected
                    ? "#F0FAB8"
                    : isBooked
                      ? "#DBDBE2"
                      : isHov
                        ? "rgba(0,0,0,0.07)"
                        : "transparent"
                }
                stroke={
                  isSelected
                    ? "#DAFA3E"
                    : isHov && !isBooked
                      ? "#D2D2D8"
                      : "none"
                }
                strokeWidth={isSelected || (isHov && !isBooked) ? 1.5 : 0}
                style={{ cursor: isBooked ? "not-allowed" : "pointer" }}
                onClick={() => !isBooked && onSelect(w)}
                onMouseEnter={() => !isBooked && setHoveredId(w.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </svg>
        {hoveredWs &&
          (() => {
            const r = DESK_RECTS[hoveredWs.number];
            if (!r) return null;
            return (
              <div
                className={styles.deskTooltip}
                style={{
                  left: `${((r.x + r.w / 2) / 600) * 100}%`,
                  top: `${(r.y / 308) * 100}%`,
                }}
              >
                Desk {hoveredWs.number}
              </div>
            );
          })()}
      </div>
      <div className={styles.deskMapLegend}>
        <span className={styles.legendItem}>
          <div className={styles.legendItemDot}></div>
          <span
            className={`${styles.legendDot} ${styles.legendAvailable}`}
          />{" "}
          Available
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendBooked}`} />{" "}
          Booked
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendSelected}`} />{" "}
          Selected
        </span>
      </div>
    </div>
  );
}
