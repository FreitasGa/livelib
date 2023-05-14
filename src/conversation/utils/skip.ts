import { getWeek, getYear } from 'date-fns';

export function weekSkip(max: number): number {
  const week = getWeek(new Date());
  const year = getYear(new Date());

  return Math.floor((week * year) % max);
}
