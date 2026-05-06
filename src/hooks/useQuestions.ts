import { useEffect, useState } from 'react';
import { Question } from '../types/question';
import { subscribeToQuestions } from '../services/questionService';

export function useQuestions(artistId?: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToQuestions((qs) => {
      setQuestions(qs);
      setLoading(false);
    }, artistId);
    return unsub;
  }, [artistId]);

  return { questions, loading };
}
