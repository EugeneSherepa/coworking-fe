"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import {
  Booking,
  User,
  LOCATION_LABELS,
  LOCATION_ADDRESSES,
  WORKSPACE_TYPE_LABELS,
  PLAN_LABELS,
  WorkspaceType,
} from "@/types";
import styles from "./page.module.scss";
import iconLocation from "../../public/icon-location.svg";

type FilterTab = "upcoming" | "past" | "cancelled" | "all";

const TYPE_BADGE_CLASS: Record<WorkspaceType, string> = {
  FIXED_DESK: styles.badgeFixedDesk,
  MEETING_ROOM: styles.badgeMeetingRoom,
  OPEN_SPACE: styles.badgeOpenSpace,
};

function formatDay(d: string) {
  return new Date(d).getDate().toString();
}
function formatMonth(d: string) {
  return new Date(d)
    .toLocaleDateString("en-GB", { month: "short" })
    .toUpperCase();
}
function formatDateFull(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function formatTime(d: string) {
  const dt = new Date(d);
  return `${dt.getHours()}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const { user, logout, loadFromStorage, updateUser } = useAuthStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [detailTarget, setDetailTarget] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">(
    "bookings",
  );
  const [filter, setFilter] = useState<FilterTab>("upcoming");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("spark_token")
        : null;
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [router]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    const id = cancelTarget.id;
    setCancelling(id);
    setCancelTarget(null);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b)),
      );
    } catch {
      alert("Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const upcoming = useMemo(() => {
    const now = new Date();
    return bookings.filter(
      (b) => b.status !== "CANCELLED" && new Date(b.startDate) >= now,
    );
  }, [bookings]);

  const past = useMemo(() => {
    const now = new Date();
    return bookings.filter(
      (b) => b.status !== "CANCELLED" && new Date(b.endDate) < now,
    );
  }, [bookings]);

  const cancelled = useMemo(
    () => bookings.filter((b) => b.status === "CANCELLED"),
    [bookings],
  );

  const filterCounts: Record<FilterTab, number> = {
    upcoming: upcoming.length,
    past: past.length,
    cancelled: cancelled.length,
    all: bookings.length,
  };

  const filtered = useMemo(() => {
    let list: Booking[];
    if (filter === "upcoming") list = upcoming;
    else if (filter === "past") list = past;
    else if (filter === "cancelled") list = cancelled;
    else list = bookings;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) => {
        const loc = b.workspace
          ? LOCATION_LABELS[b.workspace.location].toLowerCase()
          : "";
        const type = b.workspace
          ? WORKSPACE_TYPE_LABELS[b.workspace.type].toLowerCase()
          : "";
        const plan = PLAN_LABELS[b.plan].toLowerCase();
        return loc.includes(q) || type.includes(q) || plan.includes(q);
      });
    }
    return list;
  }, [filter, upcoming, past, cancelled, bookings, search]);

  const FILTER_LABELS: Record<FilterTab, string> = {
    upcoming: "Upcoming",
    past: "Past",
    cancelled: "Cancelled",
    all: "All",
  };

  return (
    <div className={styles.page}>
      <Navbar color="black" />
      <main className={styles.main}>
        <div className={styles.headerWrapper}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatar}>
                {user ? user.name[0].toUpperCase() : "?"}
              </div>
              <div className={styles.headerInfo}>
                <span className={styles.headerLabel}>MY ACCOUNT</span>
                <h1 className={styles.headerName}>{user?.name}</h1>
              </div>
            </div>
            <div className={styles.headerActions}>
              <Link
                href="/book"
                className={`${styles.newBookingBtn} button-secondary-outline`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z"
                    fill="currentColor"
                  />
                </svg>
                NEW BOOKING
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className={styles.logoutBtn}
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          <div className={styles.tabsWrapper}>
            <button
              className={`${styles.tab} ${activeTab === "bookings" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              My Bookings
            </button>
            <button
              className={`${styles.tab} ${activeTab === "profile" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </div>
        </div>

        {activeTab === "bookings" && (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>YOUR BOOKINGS</h2>
              <p className={styles.sectionSubtitle}>
                Everything you've booked, past and future. You can cancel any
                upcoming booking up to 24 hours before it starts — full refund,
                no questions
              </p>
            </div>

            <div className={styles.filterBar}>
              <div className={styles.filterPills}>
                {(["upcoming", "past", "cancelled", "all"] as FilterTab[]).map(
                  (f) => (
                    <button
                      key={f}
                      className={`${styles.filterPill} ${filter === f ? styles.filterPillActive : ""}`}
                      onClick={() => setFilter(f)}
                    >
                      {FILTER_LABELS[f]}
                      <span className={styles.filterPillsCounts}>
                        {filterCounts[f]}
                      </span>
                    </button>
                  ),
                )}
              </div>
              <div className={styles.searchWrap}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 17L21 21M3 11C3 13.1217 3.84285 15.1566 5.34315 16.6569C6.84344 18.1571 8.87827 19 11 19C13.1217 19 15.1566 18.1571 16.6569 16.6569C18.1571 15.1566 19 13.1217 19 11C19 8.87827 18.1571 6.84344 16.6569 5.34315C15.1566 3.84285 13.1217 3 11 3C8.87827 3 6.84344 3.84285 5.34315 5.34315C3.84285 6.84344 3 8.87827 3 11Z"
                    stroke="#686970"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by location, room..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>Loading bookings...</div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <p>No bookings found</p>
                <Link href="/book">Book your first desk →</Link>
              </div>
            ) : (
              <div className={styles.bookingList}>
                {filtered.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCancelClick={setCancelTarget}
                    onDetailsClick={setDetailTarget}
                    cancelling={cancelling}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "profile" && user && (
          <ProfileTab user={user} updateUser={updateUser} />
        )}
      </main>
      <Footer />

      {detailTarget && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDetailTarget(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailCheckCircle}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className={styles.detailTitle}>
              {detailTarget.status === "CONFIRMED"
                ? "BOOKING CONFIRMED."
                : detailTarget.status === "CANCELLED"
                  ? "BOOKING CANCELLED."
                  : "BOOKING DETAILS."}
            </h3>
            <p className={styles.detailSubtitle}>
              {detailTarget.status === "CONFIRMED"
                ? "We sent a confirmation to your email with a QR code for the front desk. You can find this booking any time in your account."
                : "This booking is no longer active. See your other bookings below."}
            </p>
            <div className={styles.detailReceipt}>
              {detailTarget.workspace && (
                <>
                  <div className={styles.detailReceiptRow}>
                    <span className={styles.detailReceiptLabel}>Location</span>
                    <span className={styles.detailReceiptValue}>
                      {LOCATION_LABELS[detailTarget.workspace.location]}
                    </span>
                  </div>
                  <div className={styles.detailReceiptRow}>
                    <span className={styles.detailReceiptLabel}>Workspace</span>
                    <span className={styles.detailReceiptValue}>
                      {WORKSPACE_TYPE_LABELS[detailTarget.workspace.type]}
                    </span>
                  </div>
                </>
              )}
              <div className={styles.detailReceiptRow}>
                <span className={styles.detailReceiptLabel}>Plan</span>
                <span className={styles.detailReceiptValue}>
                  {PLAN_LABELS[detailTarget.plan]}
                </span>
              </div>
              <div className={styles.detailReceiptRow}>
                <span className={styles.detailReceiptLabel}>Date</span>
                <span className={styles.detailReceiptValue}>
                  {formatDateFull(detailTarget.startDate)}
                  {detailTarget.startDate !== detailTarget.endDate &&
                    ` – ${formatDateFull(detailTarget.endDate)}`}
                </span>
              </div>
              {detailTarget.workspace?.type === "FIXED_DESK" && (
                <div className={styles.detailReceiptRow}>
                  <span className={styles.detailReceiptLabel}>Desk</span>
                  <span className={styles.detailReceiptValue}>
                    {detailTarget.workspace.number}
                  </span>
                </div>
              )}
              {detailTarget.workspace?.type === "MEETING_ROOM" &&
                detailTarget.workspace.name && (
                  <div className={styles.detailReceiptRow}>
                    <span className={styles.detailReceiptLabel}>Room</span>
                    <span className={styles.detailReceiptValue}>
                      {detailTarget.workspace.name}
                    </span>
                  </div>
                )}
              {detailTarget.plan === "HOUR" && (
                <div className={styles.detailReceiptRow}>
                  <span className={styles.detailReceiptLabel}>Time</span>
                  <span className={styles.detailReceiptValue}>
                    {formatTime(detailTarget.startDate)} –{" "}
                    {formatTime(detailTarget.endDate)}
                  </span>
                </div>
              )}
              <div
                className={`${styles.detailReceiptRow} ${styles.detailReceiptRowTotal}`}
              >
                <span className={styles.detailReceiptLabel}>Total paid</span>
                <span
                  className={`${styles.detailReceiptValue} ${styles.detailReceiptValueTotal}`}
                >
                  ${detailTarget.totalAmount}
                </span>
              </div>
            </div>
            <div className={styles.detailActions}>
              <button className={styles.detailDownloadBtn}>
                DOWNLOAD INVOICE
              </button>
              <button
                className={styles.detailCloseBtn}
                onClick={() => setDetailTarget(null)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelTarget && (
        <div
          className={styles.modalOverlay}
          onClick={() => setCancelTarget(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  stroke="#EF4446"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="9"
                  x2="12"
                  y2="13"
                  stroke="#EF4446"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="17"
                  x2="12.01"
                  y2="17"
                  stroke="#EF4446"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>CANCEL THIS BOOKING?</h3>
            <p className={styles.modalDesc}>
              You can cancel up to 24 hours before your booking starts. A full
              refund will be issued to your original payment method, usually
              within 3 business days.
            </p>
            <div className={styles.modalReceipt}>
              {cancelTarget.workspace && (
                <>
                  <div className={styles.modalReceiptRow}>
                    <span className={styles.modalReceiptLabel}>Location</span>
                    <span className={styles.modalReceiptValue}>
                      {LOCATION_LABELS[cancelTarget.workspace.location]}
                    </span>
                  </div>
                  <div className={styles.modalReceiptRow}>
                    <span className={styles.modalReceiptLabel}>Workspace</span>
                    <span className={styles.modalReceiptValue}>
                      {WORKSPACE_TYPE_LABELS[cancelTarget.workspace.type]}
                    </span>
                  </div>
                </>
              )}
              <div className={styles.modalReceiptRow}>
                <span className={styles.modalReceiptLabel}>Date</span>
                <span className={styles.modalReceiptValue}>
                  {formatDateFull(cancelTarget.startDate)}
                </span>
              </div>
              {cancelTarget.workspace?.type === "MEETING_ROOM" &&
                cancelTarget.workspace.name && (
                  <div className={styles.modalReceiptRow}>
                    <span className={styles.modalReceiptLabel}>Room</span>
                    <span className={styles.modalReceiptValue}>
                      {cancelTarget.workspace.name}
                    </span>
                  </div>
                )}
              {cancelTarget.plan === "HOUR" && (
                <div className={styles.modalReceiptRow}>
                  <span className={styles.modalReceiptLabel}>Time</span>
                  <span className={styles.modalReceiptValue}>
                    {formatTime(cancelTarget.startDate)} –{" "}
                    {formatTime(cancelTarget.endDate)}
                  </span>
                </div>
              )}
              <div
                className={`${styles.modalReceiptRow} ${styles.modalReceiptRowLast}`}
              >
                <span className={styles.modalReceiptLabel}>Refund amount</span>
                <span className={styles.modalReceiptValue}>
                  ${cancelTarget.totalAmount}
                </span>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelRefund}
                onClick={handleConfirmCancel}
              >
                CANCEL &amp; REFUND
              </button>
              <button
                className={styles.modalKeepBooking}
                onClick={() => setCancelTarget(null)}
              >
                KEEP BOOKING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  onCancelClick,
  onDetailsClick,
  cancelling,
}: {
  booking: Booking;
  onCancelClick: (b: Booking) => void;
  onDetailsClick: (b: Booking) => void;
  cancelling: string | null;
}) {
  const ws = booking.workspace;
  const canCancel =
    booking.status === "CONFIRMED" && new Date(booking.startDate) > new Date();

  return (
    <div
      className={`${styles.bookingCard} ${booking.status === "CANCELLED" ? styles.bookingCardCancelled : ""}`}
    >
      <div className={styles.dateCol}>
        <span className={styles.dateDay}>{formatDay(booking.startDate)}</span>
        <span className={styles.dateMon}>{formatMonth(booking.startDate)}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitleRow}>
          <span className={styles.cardPlan}>
            {ws?.type === "MEETING_ROOM"
              ? (ws.name ?? ws.number)
              : PLAN_LABELS[booking.plan]}
          </span>
          {ws && (
            <span
              className={`${styles.typeBadge} ${TYPE_BADGE_CLASS[ws.type]}`}
            >
              {WORKSPACE_TYPE_LABELS[ws.type].toUpperCase()}
            </span>
          )}
        </div>
        {ws && (
          <div className={styles.cardLocation}>
            <img src={iconLocation.src} alt="" />
            <div className={styles.cardLocationWrapper}>
              <span className={styles.cardLocationName}>
                {LOCATION_LABELS[ws.location]}
              </span>
              ·
              <span className={styles.cardAddress}>
                {LOCATION_ADDRESSES[ws.location]}
              </span>
              ·
              {ws.type === "MEETING_ROOM" ? (
                <>
                  <span className={styles.cardAddress}>
                    {formatDateFull(booking.startDate)}
                  </span>
                  ·
                  <span className={styles.cardAddress}>
                    {formatTime(booking.startDate)}–{formatTime(booking.endDate)}
                  </span>
                </>
              ) : ws.type === "FIXED_DESK" ? (
                <>
                  <span className={styles.cardAddress}>Desk {ws.number}</span>
                  ·
                  <span className={styles.cardAddress}>
                    {formatDateFull(booking.startDate)}
                    {booking.startDate !== booking.endDate &&
                      ` – ${formatDateFull(booking.endDate)}`}
                  </span>
                </>
              ) : (
                <span className={styles.cardAddress}>
                  {formatDateFull(booking.startDate)}
                  {booking.startDate !== booking.endDate &&
                    ` – ${formatDateFull(booking.endDate)}`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.cardActions}>
        <button
          className={styles.detailsBtn}
          onClick={() => onDetailsClick(booking)}
        >
          DETAILS
        </button>
        {canCancel && (
          <button
            onClick={() => onCancelClick(booking)}
            disabled={cancelling === booking.id}
            className={styles.cancelBtn}
          >
            {cancelling === booking.id ? "Cancelling..." : "CANCEL"}
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileTab({
  user,
  updateUser,
}: {
  user: User;
  updateUser: (u: User) => void;
}) {
  const nameParts = user.name.split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async () => {
    setStatus("saving");
    setErrorMsg("");
    try {
      const name = [firstName.trim(), lastName.trim()]
        .filter(Boolean)
        .join(" ");
      const res = await api.patch("/users/me", {
        name,
        phone: phone || undefined,
        email,
      });
      updateUser({ ...user, ...res.data });

      if (currentPassword && newPassword) {
        await api.patch("/users/me/password", { currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : ((err as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ?? "Failed to save changes");
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  return (
    <div className={styles.profileTab}>
      <div className={styles.profileTabInner}>
        <h2 className={styles.profileFormTitle}>YOUR PROFILE</h2>
        <p className={styles.profileFormSubtitle}>
          This is the information we use to identify you at reception and send
          you booking confirmations
        </p>

        <div className={styles.profileSection}>
          <h3 className={styles.profileSectionTitle}>PERSONAL INFORMATION</h3>
          <div className={styles.profileGrid}>
            <div className={styles.profileField}>
              <label className={styles.profileLabel}>First Name</label>
              <input
                className={styles.profileInput}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className={styles.profileField}>
              <label className={styles.profileLabel}>Last Name</label>
              <input
                className={styles.profileInput}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
            <div className={styles.profileField}>
              <label className={styles.profileLabel}>Phone Number</label>
              <input
                className={styles.profileInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380 000000000"
              />
            </div>
            <div className={styles.profileField}>
              <label className={styles.profileLabel}>Email</label>
              <input
                className={styles.profileInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h3 className={styles.profileSectionTitle}>PASSWORD</h3>
          <div className={styles.profileGrid}>
            <div className={styles.profileField}>
              <label className={styles.profileLabel}>Current Password</label>
              <div className={styles.profileInputWrap}>
                <input
                  className={styles.profileInput}
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  className={styles.profileEyeBtn}
                  onClick={() => setShowCurrentPw((v) => !v)}
                >
                  {showCurrentPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div className={styles.profileField}>
              <label className={styles.profileLabel}>New Password</label>
              <div className={styles.profileInputWrap}>
                <input
                  className={styles.profileInput}
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className={styles.profileEyeBtn}
                  onClick={() => setShowNewPw((v) => !v)}
                >
                  {showNewPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {status === "error" && (
          <p className={styles.profileError}>{errorMsg}</p>
        )}

        <div className={styles.profileActions}>
          <button
            className={styles.profileSaveBtn}
            onClick={handleSave}
            disabled={status === "saving"}
          >
            {status === "saving"
              ? "SAVING..."
              : status === "saved"
                ? "SAVED"
                : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
