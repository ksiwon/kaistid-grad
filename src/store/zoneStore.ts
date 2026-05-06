import { create } from 'zustand';
import { ZoneId, ZONE_ORDER } from '../types/zone';

// ── localStorage keys ─────────────────────────────────────────
const LS_VISITED  = 'kaistid_visited_zones';
const LS_UNLOCKED = 'kaistid_invitation_unlocked';
const LS_DISMISSED = 'kaistid_invitation_dismissed';

function loadVisited(): Set<ZoneId> {
  try {
    const raw = localStorage.getItem(LS_VISITED);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as ZoneId[];
    return new Set(arr.filter((id): id is ZoneId => ZONE_ORDER.includes(id)));
  } catch {
    return new Set();
  }
}

function saveVisited(set: Set<ZoneId>): void {
  localStorage.setItem(LS_VISITED, JSON.stringify(Array.from(set)));
}

function loadBool(key: string): boolean {
  return localStorage.getItem(key) === 'true';
}

// ── Store interface ───────────────────────────────────────────
interface ZoneState {
  /** Zones the current user has entered at least once */
  visitedZones: Set<ZoneId>;
  /** Set to true once all 4 zones are visited */
  invitationUnlocked: boolean;
  /** Set to true once the user taps "나중에" or downloads the invite */
  invitationDismissed: boolean;
  /** Which zone the 3-D camera is currently inside (null = lobby) */
  activeZone: ZoneId | null;

  visitZone: (zoneId: ZoneId) => void;
  setActiveZone: (zoneId: ZoneId | null) => void;
  dismissInvitation: () => void;
  resetVisits: () => void;
}

export const useZoneStore = create<ZoneState>((set, get) => ({
  // ── Initial state loaded from localStorage ────────────────
  visitedZones:         loadVisited(),
  invitationUnlocked:   loadBool(LS_UNLOCKED),
  invitationDismissed:  loadBool(LS_DISMISSED),
  activeZone:           null,

  // ── Actions ───────────────────────────────────────────────
  visitZone: (zoneId) => {
    const current = get().visitedZones;
    if (current.has(zoneId)) return;              // already counted

    const next = new Set(current);
    next.add(zoneId);
    const allDone = ZONE_ORDER.every((id) => next.has(id));

    saveVisited(next);
    if (allDone) localStorage.setItem(LS_UNLOCKED, 'true');

    set({ visitedZones: next, invitationUnlocked: allDone });
  },

  setActiveZone: (zoneId) => set({ activeZone: zoneId }),

  dismissInvitation: () => {
    localStorage.setItem(LS_DISMISSED, 'true');
    set({ invitationDismissed: true });
  },

  resetVisits: () => {
    [LS_VISITED, LS_UNLOCKED, LS_DISMISSED].forEach((k) => localStorage.removeItem(k));
    set({
      visitedZones:        new Set(),
      invitationUnlocked:  false,
      invitationDismissed: false,
    });
  },
}));