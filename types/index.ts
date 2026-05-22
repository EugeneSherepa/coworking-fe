export type Role = 'GUEST' | 'RESIDENT' | 'ADMIN';
export type WorkspaceType = 'OPEN_SPACE' | 'FIXED_DESK' | 'MEETING_ROOM';
export type Location = 'PODIL' | 'PECHERSK' | 'OSOKORKY';
export type WorkspaceStatus = 'AVAILABLE' | 'UNAVAILABLE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type BookingPlan = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
}

export interface Workspace {
  id: string;
  number: string;
  name?: string;
  type: WorkspaceType;
  location: Location;
  status: WorkspaceStatus;
  mapX: number;
  mapY: number;
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  description?: string;
  isBooked?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  workspaceId: string;
  startDate: string;
  endDate: string;
  plan: BookingPlan;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  workspace?: {
    number: string;
    name?: string;
    type: WorkspaceType;
    location: Location;
    dailyRate?: number;
  };
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export const LOCATION_LABELS: Record<Location, string> = {
  PODIL: 'Spark Podil',
  PECHERSK: 'Spark Pechersk',
  OSOKORKY: 'Spark Osokorky',
};

export const LOCATION_ADDRESSES: Record<Location, string> = {
  PODIL: 'Naberezhno-Khreshchatytska St, 15, Kyiv',
  PECHERSK: 'Lesi Ukrainky Blvd, 26, Kyiv',
  OSOKORKY: 'Dniprovska Embankment, 20, Kyiv',
};

export const WORKSPACE_TYPE_LABELS: Record<WorkspaceType, string> = {
  OPEN_SPACE: 'Open Space',
  FIXED_DESK: 'Fixed Desk',
  MEETING_ROOM: 'Meeting Room',
};

export const PLAN_LABELS: Record<BookingPlan, string> = {
  HOUR: 'Hourly',
  DAY: 'Day Pass',
  WEEK: 'Week Pass',
  MONTH: 'Monthly',
};
