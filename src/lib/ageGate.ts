const STORAGE_KEY = "bookstore_age_verified";
const EXPIRY_DAYS = 30;

export type AgeVerificationRecord = {
  confirmed: boolean;
  confirmedAt: string;
  expiresAt: string;
};

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const createAgeVerificationRecord = (): AgeVerificationRecord => {
  const confirmedAt = new Date();
  const expiresAt = addDays(confirmedAt, EXPIRY_DAYS);
  return {
    confirmed: true,
    confirmedAt: confirmedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
};

export const readAgeVerification = (): AgeVerificationRecord | null => {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AgeVerificationRecord;
    if (!parsed.confirmed || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt) <= new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const isAgeVerified = (): boolean => readAgeVerification() !== null;

export const confirmAge = (): AgeVerificationRecord => {
  const record = createAgeVerificationRecord();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  return record;
};

export const clearAgeVerification = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
