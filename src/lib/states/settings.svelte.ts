import { PersistedState } from "runed";

export interface Settings {
  questions: number;
}

export const settings = new PersistedState<Settings>('settings', {
  questions: 20,
});
