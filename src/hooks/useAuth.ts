import { useState, useEffect } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  signOut as firebaseSignOut, User
} from 'firebase/auth';
import { auth, isConfigured } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured || !auth) {
      setUser({ uid: 'mock-admin', email: 'admin@kaist.ac.kr' } as User);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured || !auth) {
      throw new Error('Firebase가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!isConfigured || !auth) return;
    await firebaseSignOut(auth);
  };

  const superAdminUid = import.meta.env.VITE_SUPER_ADMIN_UID;
  const isSuperAdmin = !isConfigured || (!!user && user.uid === superAdminUid);

  return { user, loading, isLoading: loading, signIn, signOut, isSuperAdmin };
}
