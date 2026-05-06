export type CalendarMode = "daily" | "weekly" | "monthly";

export interface CalendarDay {
  date: Date;
  primary: number;
  secondary: number;
  tertiary: number;
  jalaali: number;
  gregorian: number;
  ghamari: number;
  isToday: boolean;
  isWeekend: boolean;
  name: string;
  shortName: string;
  dayOfWeek: number;
}
