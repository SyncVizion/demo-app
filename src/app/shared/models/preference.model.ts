export interface Preference<T> {
  userId?: number;
  preferenceKey: string;
  preferences: T;
}
