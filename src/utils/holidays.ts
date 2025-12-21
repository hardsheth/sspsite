// holidays.ts
import moment from "moment";

export interface Holiday {
  date: moment.Moment;
  label: string;
}

export const holidays: Holiday[] = [
  {
    date: moment("2025-12-25", "YYYY-MM-DD"),
    label: "Christmas"
  },
  // Add more holidays here...
];
