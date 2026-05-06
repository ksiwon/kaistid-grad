import {
  collection, addDoc, getDocs, updateDoc, doc, query,
  orderBy, where, serverTimestamp, DocumentData, onSnapshot, QueryConstraint
} from 'firebase/firestore';
import { db, isConfigured, USE_MOCK } from './firebase';
import { Question, QuestionType } from '../types/question';
import { MOCK_QUESTIONS } from '../data/mockData';

// In-memory store for demo mode
let demoQuestions: Question[] = [...MOCK_QUESTIONS];

function docToQuestion(id: string, data: DocumentData): Question {
  return { id, ...data } as Question;
}

export async function fetchQuestions(artistId?: string): Promise<Question[]> {
  if (USE_MOCK || !isConfigured || !db) {
    const visible = demoQuestions.filter(q => q.isVisible);
    return artistId ? visible.filter(q => q.artistId === artistId) : visible;
  }

  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    if (artistId) constraints.unshift(where('artistId', '==', artistId));
    const q = query(collection(db, 'questions'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => docToQuestion(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function submitQuestion(data: {
  artistId: string;
  workTitle: string;
  type: QuestionType;
  content: string;
}): Promise<void> {
  if (USE_MOCK || !isConfigured || !db) {
    const newQ: Question = {
      id: `q${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      isVisible: true,
    };
    demoQuestions = [newQ, ...demoQuestions];
    return;
  }

  await addDoc(collection(db, 'questions'), {
    ...data,
    createdAt: serverTimestamp(),
    isVisible: true,
  });
}

export async function answerQuestion(questionId: string, content: string, artistId: string): Promise<void> {
  if (USE_MOCK || !isConfigured || !db) {
    demoQuestions = demoQuestions.map(q =>
      q.id === questionId
        ? { ...q, answer: { content, answeredAt: new Date().toISOString(), answeredBy: artistId } }
        : q
    );
    return;
  }

  await updateDoc(doc(db, 'questions', questionId), {
    answer: { content, answeredAt: serverTimestamp(), answeredBy: artistId },
  });
}

export function subscribeToQuestions(
  callback: (questions: Question[]) => void,
  artistId?: string
): () => void {
  if (USE_MOCK || !isConfigured || !db) {
    callback(demoQuestions.filter(q => q.isVisible && (!artistId || q.artistId === artistId)));
    return () => {};
  }

  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (artistId) constraints.unshift(where('artistId', '==', artistId));
  const q = query(collection(db, 'questions'), ...constraints);

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => docToQuestion(d.id, d.data())));
  });
}
