"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import {
  LOCATION_LABELS,
  LOCATION_ADDRESSES,
  WORKSPACE_TYPE_LABELS,
  PLAN_LABELS,
  BookingPlan,
  Location,
  WorkspaceType,
} from "@/types";
import styles from "./page.module.scss";


interface AdminStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeBookings: number;
  totalBookings: number;
  totalMembers: number;
  bookingsByType: Record<string, number>;
  bookingsByLocation: Record<string, number>;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  totalBookings: number;
  totalSpent: number;
}

interface AdminBooking {
  id: string;
  startDate: string;
  endDate: string;
  plan: BookingPlan;
  status: string;
  totalAmount: number;
  workspace?: {
    number: string;
    name?: string;
    type: WorkspaceType;
    location: Location;
  };
}

interface WorkspaceActiveBooking {
  id: string;
  startDate: string;
  endDate: string;
  plan: BookingPlan;
  status: string;
  totalAmount: number;
  user: { id: string; name: string; email: string; phone?: string };
}

interface LocationWorkspace {
  id: string;
  number: string;
  name?: string;
  type: WorkspaceType;
  status: string;
  bookings: WorkspaceActiveBooking[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(d: string) {
  const dt = new Date(d);
  return `${dt.getHours()}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userBookings, setUserBookings] = useState<AdminBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationWorkspaces, setLocationWorkspaces] = useState<LocationWorkspace[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [expandedTypes, setExpandedTypes] = useState<Set<WorkspaceType>>(new Set());

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("spark_token") : null;
    if (!token) { router.push("/login"); return; }

    api.get("/admin/stats")
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoadingStats(false));

    api.get("/admin/users")
      .then((r) => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [router]);

  useEffect(() => {
    if (user && user.role !== "ADMIN") router.push("/");
  }, [user, router]);

  const openUserBookings = async (u: AdminUser) => {
    setSelectedUser(u);
    setUserBookings([]);
    setLoadingBookings(true);
    try {
      const r = await api.get(`/admin/users/${u.id}/bookings`);
      setUserBookings(r.data);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setUserBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: "CANCELLED" } : b)
      );
    } catch {
      alert("Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const openLocation = async (loc: Location) => {
    setSelectedLocation(loc);
    setLocationWorkspaces([]);
    setExpandedTypes(new Set());
    setLoadingLocation(true);
    try {
      const r = await api.get(`/admin/locations/${loc}`);
      setLocationWorkspaces(r.data);
    } finally {
      setLoadingLocation(false);
    }
  };

  const toggleType = (type: WorkspaceType) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleCancelLocationBooking = async (bookingId: string) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      setLocationWorkspaces((prev) =>
        prev.map((ws) => ({
          ...ws,
          bookings: ws.bookings.filter((b) => b.id !== bookingId),
        }))
      );
    } catch {
      alert("Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>

        {/* Header */}
        <div className={styles.headerWrapper}>
          <div className={styles.header}>
            <div>
              <span className={styles.adminBadge}>ADMIN PANEL</span>
              <h1 className={styles.headerTitle}>DASHBOARD</h1>
            </div>
            <Link href="/dashboard" className={styles.backBtn}>← MY ACCOUNT</Link>
          </div>
        </div>

        <div className={styles.content}>

          {/* Stats cards */}
          {loadingStats ? (
            <div className={styles.loading}>Loading stats...</div>
          ) : stats && (
            <>
              <div className={styles.statsGrid}>
                <StatCard label="Total Revenue" value={fmtMoney(stats.totalRevenue)} sub="all confirmed bookings" accent />
                <StatCard label="This Month" value={fmtMoney(stats.monthlyRevenue)} sub="revenue in current month" />
                <StatCard label="Active Bookings" value={String(stats.activeBookings)} sub="confirmed & upcoming" />
                <StatCard label="Members" value={String(stats.totalMembers)} sub={`${stats.totalBookings} total bookings`} />
              </div>

              {/* Office locations */}
              <div className={styles.locationGrid}>
                {(["PODIL", "PECHERSK", "OSOKORKY"] as Location[]).map((loc) => (
                  <button key={loc} className={styles.locationCard} onClick={() => openLocation(loc)}>
                    <div className={styles.locationCardTop}>
                      <span className={styles.locationCardName}>{LOCATION_LABELS[loc]}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className={styles.locationCardAddress}>{LOCATION_ADDRESSES[loc]}</p>
                    <p className={styles.locationCardStat}>
                      {stats.bookingsByLocation[loc] ?? 0} active booking{(stats.bookingsByLocation[loc] ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Users table */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>MEMBERS</h2>
              <div className={styles.searchWrap}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  className={styles.searchInput}
                  placeholder="Search by name, email, role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className={styles.loading}>Loading members...</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Bookings</th>
                      <th>Total Spent</th>
                      <th>Joined</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className={styles.memberCell}>
                            <div className={styles.memberAvatar}>{u.name[0].toUpperCase()}</div>
                            <div>
                              <p className={styles.memberName}>{u.name}</p>
                              <p className={styles.memberEmail}>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.roleBadge} ${u.role === "ADMIN" ? styles.roleAdmin : u.role === "RESIDENT" ? styles.roleResident : styles.roleGuest}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className={styles.numCell}>{u.totalBookings}</td>
                        <td className={styles.numCell}>{fmtMoney(u.totalSpent)}</td>
                        <td className={styles.dimCell}>{fmt(u.createdAt)}</td>
                        <td>
                          <button className={styles.viewBtn} onClick={() => openUserBookings(u)}>
                            BOOKINGS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Location occupancy modal */}
      {selectedLocation && (
        <div className={styles.modalOverlay} onClick={() => setSelectedLocation(null)}>
          <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalSub}>Workspace occupancy</p>
                <h3 className={styles.modalTitle}>{LOCATION_LABELS[selectedLocation]}</h3>
              </div>
              <button className={styles.modalClose} onClick={() => setSelectedLocation(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBookings}>
              {loadingLocation ? (
                <p className={styles.loading}>Loading workspaces...</p>
              ) : (
                (["FIXED_DESK", "OPEN_SPACE", "MEETING_ROOM"] as WorkspaceType[]).map((type) => {
                  const group = locationWorkspaces.filter((ws) => ws.type === type);
                  if (group.length === 0) return null;
                  const activeCount = group.reduce((s, ws) => s + ws.bookings.length, 0);
                  const isExpanded = expandedTypes.has(type);
                  return (
                    <div key={type} className={styles.wsTypeSection}>
                      <button className={styles.wsTypeSectionHeader} onClick={() => toggleType(type)}>
                        <div className={styles.wsTypeSectionLeft}>
                          <span className={`${styles.wsOccupancyDot} ${activeCount > 0 ? styles.wsOccupied : styles.wsFree}`} />
                          <span className={styles.wsTypeSectionName}>{WORKSPACE_TYPE_LABELS[type]}s</span>
                        </div>
                        <div className={styles.wsTypeSectionRight}>
                          <span className={styles.wsTypeSectionStat}>{activeCount} active · {group.length} total</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className={styles.wsTypeSectionBody}>
                          {group.map((ws) => {
                            const label = ws.type === "MEETING_ROOM"
                              ? (ws.name ?? `Room ${ws.number}`)
                              : ws.type === "FIXED_DESK"
                              ? `Desk ${ws.number}`
                              : `Open Space ${ws.number}`;
                            return (
                              <div key={ws.id} className={styles.wsItem}>
                                <div className={styles.wsItemHead}>
                                  <div className={styles.wsItemName}>
                                    <span className={`${styles.wsOccupancyDot} ${ws.bookings.length > 0 ? styles.wsOccupied : styles.wsFree}`} />
                                    {label}
                                  </div>
                                  {ws.bookings.length === 0 && (
                                    <span className={styles.wsAvailableBadge}>Available</span>
                                  )}
                                </div>
                                {ws.bookings.map((b) => (
                                  <div key={b.id} className={styles.wsBookingRow}>
                                    <div className={styles.wsBookingUser}>
                                      <span className={styles.wsBookingName}>{b.user.name}</span>
                                      <span className={styles.wsBookingEmail}>{b.user.email}</span>
                                    </div>
                                    <div className={styles.wsBookingMeta}>
                                      <span className={styles.wsBookingDate}>
                                        {fmt(b.startDate)}
                                        {b.plan === "HOUR" && ` · ${fmtTime(b.startDate)}–${fmtTime(b.endDate)}`}
                                      </span>
                                      <span className={styles.wsBookingAmount}>{fmtMoney(b.totalAmount)}</span>
                                      <button
                                        className={styles.cancelBtn}
                                        onClick={() => handleCancelLocationBooking(b.id)}
                                        disabled={cancelling === b.id}
                                      >
                                        {cancelling === b.id ? "..." : "CANCEL"}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.modalFooter}>
              <span className={styles.modalFooterStat}>
                {locationWorkspaces.reduce((s, ws) => s + ws.bookings.length, 0)} active &middot; {locationWorkspaces.length} workspaces total
              </span>
              <button className={styles.modalCloseBtn} onClick={() => setSelectedLocation(null)}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalSub}>Member bookings</p>
                <h3 className={styles.modalTitle}>{selectedUser.name.toUpperCase()}</h3>
              </div>
              <button className={styles.modalClose} onClick={() => setSelectedUser(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBookings}>
              {loadingBookings ? (
                <p className={styles.loading}>Loading...</p>
              ) : userBookings.length === 0 ? (
                <p className={styles.emptyMsg}>No bookings found for this member.</p>
              ) : userBookings.map((b) => (
                <div key={b.id} className={`${styles.bookingRow} ${b.status === "CANCELLED" ? styles.bookingRowCancelled : ""}`}>
                  <div className={styles.bookingRowLeft}>
                    <span className={`${styles.statusDot} ${b.status === "CONFIRMED" ? styles.dotConfirmed : b.status === "CANCELLED" ? styles.dotCancelled : styles.dotPending}`} />
                    <div>
                      <p className={styles.bookingRowTitle}>
                        {PLAN_LABELS[b.plan]}
                        {b.workspace && ` · ${WORKSPACE_TYPE_LABELS[b.workspace.type]}`}
                      </p>
                      <p className={styles.bookingRowSub}>
                        {b.workspace && `${LOCATION_LABELS[b.workspace.location]} · `}
                        {fmt(b.startDate)}
                        {b.plan === "HOUR" && ` · ${fmtTime(b.startDate)}–${fmtTime(b.endDate)}`}
                      </p>
                    </div>
                  </div>
                  <div className={styles.bookingRowRight}>
                    <span className={styles.bookingAmount}>{fmtMoney(b.totalAmount)}</span>
                    {b.status === "CONFIRMED" && new Date(b.startDate) > new Date() && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={cancelling === b.id}
                      >
                        {cancelling === b.id ? "..." : "CANCEL"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <span className={styles.modalFooterStat}>{userBookings.filter(b => b.status !== "CANCELLED").length} active · {fmtMoney(selectedUser.totalSpent)} total</span>
              <button className={styles.modalCloseBtn} onClick={() => setSelectedUser(null)}>CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.statCardAccent : ""}`}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statSub}>{sub}</p>
    </div>
  );
}

