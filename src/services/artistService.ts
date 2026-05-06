import {
  collection, doc, getDoc, getDocs, updateDoc, query, orderBy,
  DocumentData
} from 'firebase/firestore';
import { db, isConfigured, USE_MOCK } from './firebase';
import { ArtistData } from '../types/artist';
import { MOCK_ARTISTS } from '../data/mockData';

function docToArtist(id: string, data: DocumentData): ArtistData {
  return { id, ...data } as ArtistData;
}

export async function fetchAllArtists(): Promise<ArtistData[]> {
  if (USE_MOCK || !isConfigured || !db) return MOCK_ARTISTS;

  try {
    const q = query(collection(db, 'artists'), orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => docToArtist(d.id, d.data()));
  } catch {
    return MOCK_ARTISTS;
  }
}

export async function fetchArtistById(id: string): Promise<ArtistData | null> {
  if (USE_MOCK || !isConfigured || !db) {
    return MOCK_ARTISTS.find(a => a.id === id) ?? null;
  }

  try {
    const snap = await getDoc(doc(db, 'artists', id));
    if (!snap.exists()) return null;
    return docToArtist(snap.id, snap.data());
  } catch {
    return MOCK_ARTISTS.find(a => a.id === id) ?? null;
  }
}

export async function updateArtist(id: string, data: Partial<ArtistData>): Promise<void> {
  if (USE_MOCK || !isConfigured || !db) {
    console.log('[Demo] updateArtist:', id, data);
    return;
  }
  await updateDoc(doc(db, 'artists', id), { ...data, 'meta.updatedAt': new Date().toISOString() });
}
