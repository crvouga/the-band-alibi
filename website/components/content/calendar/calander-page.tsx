import { PageWrapper } from "@components/shared";
import { ISettings } from "@data-access";
import Container from "@material-ui/core/Container";
import Badge from "@material-ui/core/Badge";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CalendarPickerSkeleton from "@material-ui/lab/CalendarPickerSkeleton";
import PickersDay from "@material-ui/lab/PickersDay";
import StaticDatePicker from "@material-ui/lab/StaticDatePicker";
import getDaysInMonth from "date-fns/getDaysInMonth";
import * as React from "react";
import { LocalizationProvider } from "./localization-provider";
import { useEventsQuery } from "../events";
import {
  toMonthDateRange,
  DateISO,
  IDateRange,
  isSameYearMonthDay,
} from "@utility";

function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fakeFetch(date: Date, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = getDaysInMonth(date);
      const daysToHighlight = [1, 2, 3].map(() =>
        getRandomNumber(1, daysInMonth)
      );

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new Error("aborted"));
    };
  });
}

const initialValue = new Date();

export type ICalanderPageProps = {
  settings: ISettings;
};

export const CalanderPage = ({ settings }: ICalanderPageProps) => {
  const [value, setValue] = React.useState<Date | null>(initialValue);
  const [dateRange, setDateRange] = React.useState<IDateRange>(
    toMonthDateRange(new Date())
  );

  const eventsQuery = useEventsQuery({
    sort: "date-descend",
    inclusiveDateRange: {
      start: DateISO(dateRange.start),
      end: DateISO(dateRange.end),
    },
  });

  const handleMonthChange = (date: Date) => {
    setDateRange(toMonthDateRange(date));
  };

  const handleYearChange = (date: Date) => {
    setDateRange(toMonthDateRange(date));
  };

  const isDateSelected = (date: Date) => {
    const events = eventsQuery.data ?? [];

    return events.some((event) =>
      isSameYearMonthDay(new Date(event.date), date)
    );
  };

  return (
    <PageWrapper settings={settings} pageTitle={["Calender"]}>
      <Container sx={{ paddingTop: 2 }}>
        <Typography variant="h1" align="center">
          Calender
        </Typography>
      </Container>

      <LocalizationProvider>
        <Container maxWidth="xs" disableGutters>
          <StaticDatePicker
            value={value}
            loading={eventsQuery.status === "loading"}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            renderInput={(params) => <TextField {...params} />}
            renderLoading={() => <CalendarPickerSkeleton />}
            renderDay={(date, _value, DayComponentProps) => {
              const isSelected =
                !DayComponentProps.outsideCurrentMonth && isDateSelected(date);

              return (
                <Badge
                  key={date.toString()}
                  overlap="circular"
                  badgeContent={isSelected ? "" : undefined}
                  color="primary"
                >
                  <PickersDay {...DayComponentProps} />
                </Badge>
              );
            }}
          />
        </Container>
      </LocalizationProvider>
    </PageWrapper>
  );
};
