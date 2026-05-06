import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db, USE_MOCK, isConfigured } from './firebase';
import { Comment, StickyColor, generateNickname, STICKY_COLOR_LIST } from '../types/comment';
import { MOCK_COMMENTS } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

// ── In-memory mock store ──────────────────────────────────────
// Shared across the whole session so comments persist while navigating
let mockStore: Comment[] = [...MOCK_COMMENTS];
const listeners: Map<string, Set<(c: Comment[]) => void>> = new Map();

function getForArtist(artistId: string): Comment[] {
  return [...mockStore]
    .filter((c) => c.artistId === artistId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function notifyAll(artistId: string): void {
  (listeners.get(artistId) ?? new Set()).forEach((cb) => cb(getForArtist(artistId)));
}

// ── Public API ────────────────────────────────────────────────

/**
 * Subscribe to comments for a specific artist.
 * Returns an unsubscribe function compatible with React useEffect cleanup.
 *
 * DEV  → in-memory mock with immediate emission + reactive updates
 * PROD → Firestore onSnapshot real-time listener
 */
export function subscribeComments(
  artistId: string,
  callback: (comments: Comment[]) => void,
): () => void {
  // ── Mock / Dev mode ──────────────────────────────────────
  if (USE_MOCK || !isConfigured || !db) {
    if (!listeners.has(artistId)) listeners.set(artistId, new Set());
    listeners.get(artistId)!.add(callback);

    // Emit initial state immediately (async to let React settle)
    const timer = setTimeout(() => callback(getForArtist(artistId)), 0);

    return () => {
      clearTimeout(timer);
      listeners.get(artistId)?.delete(callback);
    };
  }

  // ── Firebase / Prod mode ─────────────────────────────────
  const q = query(
    collection(db, 'comments'),
    where('artistId', '==', artistId),
    orderBy('createdAt', 'asc'),
  );

  return onSnapshot(
    q,
    (snap) => {
      const comments: Comment[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          artistId: d.artistId as string,
          text: d.text as string,
          nickname: d.nickname as string,
          color: (d.color ?? 'yellow') as StickyColor,
          createdAt:
            d.createdAt instanceof Timestamp
              ? d.createdAt.toDate().toISOString()
              : (d.createdAt as string),
          posX: typeof d.posX === 'number' ? d.posX : Math.random() * 60 + 5,
          posY: typeof d.posY === 'number' ? d.posY : Math.random() * 55 + 5,
        };
      });
      callback(comments);
    },
    (err) => {
      console.error('[Comments] Firestore error, falling back to mock:', err);
      callback(getForArtist(artistId));
    },
  );
}

/**
 * Add a new sticky-note comment.
 *
 * DEV  → appended to the in-memory mock store; all active listeners notified
 * PROD → written to Firestore; the onSnapshot listener picks it up automatically
 */
export async function addComment(
  artistId: string,
  text: string,
  color?: StickyColor,
): Promise<Comment> {
  const randomColor =
    color ?? STICKY_COLOR_LIST[Math.floor(Math.random() * STICKY_COLOR_LIST.length)];

  const base: Omit<Comment, 'id'> = {
    artistId,
    text: text.trim(),
    nickname: generateNickname(),
    color: randomColor,
    createdAt: new Date().toISOString(),
    posX: Math.random() * 60 + 5,
    posY: Math.random() * 55 + 5,
  };

  // ── Mock / Dev mode ──────────────────────────────────────
  if (USE_MOCK || !isConfigured || !db) {
    const comment: Comment = { ...base, id: uuidv4() };
    mockStore = [...mockStore, comment];
    notifyAll(artistId);
    return comment;
  }

  // ── Firebase / Prod mode ─────────────────────────────────
  const docRef = await addDoc(collection(db, 'comments'), {
    ...base,
    createdAt: Timestamp.fromDate(new Date(base.createdAt)),
  });
  // The real data will arrive via the onSnapshot listener
  return { ...base, id: docRef.id };
}