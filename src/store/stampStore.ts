import { create } from 'zustand';
import { StampDocument } from '../types/stamp';

interface StampState {
  stamps: StampDocument | null;
  setStamps: (stamps: StampDocument) => void;
  lastCollectedCode: string | null;
  setLastCollectedCode: (code: string | null) => void;
}

export const useStampStore = create<StampState>((set) => ({
  stamps: null,
  setStamps: (stamps) => set({ stamps }),
  lastCollectedCode: null,
  setLastCollectedCode: (code) => set({ lastCollectedCode: code }),
}));
