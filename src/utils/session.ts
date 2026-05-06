import { v4 as uuidv4 } from 'uuid';

export const SESSION_KEY = 'kaist_gradshow_2026_session';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}
