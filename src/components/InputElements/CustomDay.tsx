// CustomDay.tsx
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { holidays } from "../../utils/holidays";


export function CustomDay(props: any) {
  const { day, outsideCurrentMonth, ...other } = props;

  const holiday = holidays.find((h) => h.date.isSame(day, "day"));

  return (
    <div style={{ textAlign: "center" }}>
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        sx={{
          backgroundColor: holiday ? "#ffebee" : undefined,
          color: holiday ? "#d32f2f" : undefined,
          borderRadius: "8px",
        }}
      />
      {holiday && (
        <div style={{ fontSize: "0.55rem", color: "#d32f2f" }}>
          {holiday.label}
        </div>
      )}
    </div>
  );
}
