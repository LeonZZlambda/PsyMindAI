import { useMemo } from 'react';
import { TimeSlot } from '../types';

interface UseScheduleCalculationsArgs {
  dayStartHour: number;
  dayEndHour: number;
  slotMinutes: 30 | 60;
  rowHeightPx?: number;
}

export const useScheduleCalculations = ({
  dayStartHour,
  dayEndHour,
  slotMinutes,
  rowHeightPx = 44,
}: UseScheduleCalculationsArgs) => {
  const minutesPerPixel = useMemo(() => slotMinutes / rowHeightPx, [slotMinutes, rowHeightPx]);
  const pixelsPerMinute = useMemo(() => rowHeightPx / slotMinutes, [rowHeightPx, slotMinutes]);

  const totalMinutes = (dayEndHour - dayStartHour) * 60;

  const slots = useMemo<TimeSlot[]>(() => {
    const firstMinute = dayStartHour * 60;
    const count = Math.ceil(totalMinutes / slotMinutes);

    return Array.from({ length: count }).map((_, index) => {
      const startMinutes = firstMinute + index * slotMinutes;
      const endMinutes = startMinutes + slotMinutes;
      const hour = Math.floor(startMinutes / 60);
      const minute = startMinutes % 60;
      const label = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      return {
        id: `slot-${index}`,
        dayIndex: -1,
        startMinutes,
        endMinutes,
        label,
      };
    });
  }, [dayStartHour, slotMinutes, totalMinutes]);

  const timeToPixels = (minutesFromMidnight: number) => {
    const dayStartMinutes = dayStartHour * 60;
    return Math.max(0, (minutesFromMidnight - dayStartMinutes) * pixelsPerMinute);
  };

  const durationToPixels = (durationMinutes: number) => Math.max(rowHeightPx / 2, durationMinutes * pixelsPerMinute);

  const pixelsToMinutes = (pixels: number) => {
    const dayStartMinutes = dayStartHour * 60;
    return Math.max(dayStartMinutes, Math.round(pixels * minutesPerPixel + dayStartMinutes));
  };

  const snapMinutes = (minutes: number, stepMinutes: number) => Math.round(minutes / stepMinutes) * stepMinutes;

  return {
    minutesPerPixel,
    pixelsPerMinute,
    totalMinutes,
    slots,
    rowHeightPx,
    timeToPixels,
    durationToPixels,
    pixelsToMinutes,
    snapMinutes,
  };
};
