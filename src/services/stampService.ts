import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, DocumentData
} from 'firebase/firestore';
import { db, isConfigured, USE_MOCK } from './firebase';
import { StampDocument } from '../types/stamp';
import { getSessionId } from '../utils/session';

const STAMP_LOCAL_KEY = 'kaist_gradshow_2026_stamps';
const TOTAL_STAMPS = 14;

function getLocalStamps(): StampDocument {
  const raw = localStorage.getItem(STAMP_LOCAL_KEY);
  if (raw) return JSON.parse(raw) as StampDocument;
  return {
    sessionId: getSessionId(),
    collectedCodes: [],
    firstVisit: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isCompleted: false,
  };
}

function saveLocalStamps(doc: StampDocument): void {
  localStorage.setItem(STAMP_LOCAL_KEY, JSON.stringify(doc));
}

export async function getStampDocument(): Promise<StampDocument> {
  const sessionId = getSessionId();

  if (USE_MOCK || !isConfigured || !db) {
    return getLocalStamps();
  }

  try {
    const snap = await getDoc(doc(db, 'stamps', sessionId));
    if (snap.exists()) {
      return snap.data() as StampDocument;
    }
    const newDoc: StampDocument = {
      sessionId,
      collectedCodes: [],
      firstVisit: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isCompleted: false,
    };
    await setDoc(doc(db, 'stamps', sessionId), newDoc);
    return newDoc;
  } catch {
    return getLocalStamps();
  }
}

export async function addStamp(code: string): Promise<{ isNew: boolean; isCompleted: boolean }> {
  const sessionId = getSessionId();

  if (USE_MOCK || !isConfigured || !db) {
    const stamps = getLocalStamps();
    if (stamps.collectedCodes.includes(code)) {
      return { isNew: false, isCompleted: stamps.isCompleted };
    }
    const updated: StampDocument = {
      ...stamps,
      collectedCodes: [...stamps.collectedCodes, code],
      lastUpdated: new Date().toISOString(),
      isCompleted: stamps.collectedCodes.length + 1 >= TOTAL_STAMPS,
      completedAt: stamps.collectedCodes.length + 1 >= TOTAL_STAMPS ? new Date().toISOString() : undefined,
    };
    saveLocalStamps(updated);
    return { isNew: true, isCompleted: updated.isCompleted };
  }

  try {
    const ref = doc(db, 'stamps', sessionId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as DocumentData;
      if ((data.collectedCodes as string[]).includes(code)) {
        return { isNew: false, isCompleted: data.isCompleted };
      }
      const newCount = (data.collectedCodes as string[]).length + 1;
      const isCompleted = newCount >= TOTAL_STAMPS;
      await updateDoc(ref, {
        collectedCodes: arrayUnion(code),
        lastUpdated: serverTimestamp(),
        isCompleted,
        ...(isCompleted ? { completedAt: serverTimestamp() } : {}),
      });
      return { isNew: true, isCompleted };
    } else {
      const newDoc: StampDocument = {
        sessionId,
        collectedCodes: [code],
        firstVisit: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isCompleted: 1 >= TOTAL_STAMPS,
      };
      await setDoc(ref, newDoc);
      return { isNew: true, isCompleted: newDoc.isCompleted };
    }
  } catch {
    const stamps = getLocalStamps();
    if (stamps.collectedCodes.includes(code)) {
      return { isNew: false, isCompleted: stamps.isCompleted };
    }
    const updated: StampDocument = {
      ...stamps,
      collectedCodes: [...stamps.collectedCodes, code],
      lastUpdated: new Date().toISOString(),
      isCompleted: stamps.collectedCodes.length + 1 >= TOTAL_STAMPS,
    };
    saveLocalStamps(updated);
    return { isNew: true, isCompleted: updated.isCompleted };
  }
}
