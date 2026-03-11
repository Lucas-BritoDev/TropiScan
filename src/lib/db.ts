import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { UserData, QuestionAnswer, RiskResult, DiseaseType } from '@/types/tropiscan';

export interface DbSession {
  id?: number;
  date: string;
  userData: UserData;
  answers: QuestionAnswer[];
  result: RiskResult;
  hasImage: boolean;
  diseaseType?: DiseaseType;
}

interface ConsentLog {
  id?: number;
  date: string;
  given: boolean;
}

interface TropiScanDB extends DBSchema {
  sessions: {
    key: number;
    value: DbSession;
    indexes: { date: string };
  };
  consent_log: {
    key: number;
    value: ConsentLog;
    indexes: { date: string };
  };
}

let dbPromise: Promise<IDBPDatabase<TropiScanDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<TropiScanDB>('TropiScanDB', 1, {
      upgrade(db) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
        sessionStore.createIndex('date', 'date');
        const consentStore = db.createObjectStore('consent_log', { keyPath: 'id', autoIncrement: true });
        consentStore.createIndex('date', 'date');
      },
    });
  }
  return dbPromise;
}

export async function saveSession(session: Omit<DbSession, 'id'>) {
  const db = await getDb();
  return db.add('sessions', session as DbSession);
}

export async function getSessions(): Promise<DbSession[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex('sessions', 'date');
  return all.reverse();
}

export async function getSessionById(id: number): Promise<DbSession | undefined> {
  const db = await getDb();
  return db.get('sessions', id);
}

export async function logConsent(given: boolean) {
  const db = await getDb();
  return db.add('consent_log', { date: new Date().toISOString(), given } as ConsentLog);
}

export default { getDb };
