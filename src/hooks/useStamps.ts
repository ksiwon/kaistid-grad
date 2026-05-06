import { useEffect, useState } from 'react';
import { StampDocument } from '../types/stamp';
import { getStampDocument, addStamp as addStampService } from '../services/stampService';

export function useStamps() {
  const [stamps, setStamps] = useState<StampDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const doc = await getStampDocument();
      setStamps(doc);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addStamp = async (code: string): Promise<{ isNew: boolean; isCompleted: boolean }> => {
    const result = await addStampService(code);
    await refresh();
    return result;
  };

  return { stamps, isLoading, loading: isLoading, refresh, addStamp };
}
