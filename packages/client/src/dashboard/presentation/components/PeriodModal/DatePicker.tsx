import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { useCallback, useMemo } from 'react';
// import ko from 'date-fns/locale/ko';

interface DatePickerProps {
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export default function DatePicker(props: DatePickerProps) {
  const { startDate, setStartDate, endDate, setEndDate } = props;
  const handleSelect = useCallback(
    ({ selection: { startDate, endDate } }: any) => {
      setStartDate(startDate);
      setEndDate(endDate);
    },
    [endDate, startDate],
  );
  console.log(
    `startDate.toISOString(): `,
    startDate?.toISOString().slice(0, 10),
  );
  console.log(`endDate.toISOString(): `, endDate?.toISOString().slice(0, 10));
  const ranges = useMemo(() => {
    return [
      {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
      },
    ];
  }, [startDate, endDate]);

  return (
    <div>
      <DateRange
        // locale={ko}
        dateDisplayFormat={'yyyy.MM.dd'}
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        // minDate={subMonths(now.current, 6)}
        // maxDate={now.current}
        ranges={ranges}
        onChange={handleSelect}
      />
    </div>
  );
}
