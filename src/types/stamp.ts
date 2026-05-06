export interface StampDocument {
  sessionId: string;
  collectedCodes: string[];
  firstVisit: string;
  lastUpdated: string;
  isCompleted: boolean;
  completedAt?: string;
}
