import { DoctorSchedule, ScheduleGroup } from "@/types/doctorRegistration";

type ScheduleSource = {
  schedules?: DoctorSchedule[];
  schedule_groups?: ScheduleGroup[];
};

export function getDayIndex(dayOfWeek: number | number[] | undefined): number | null {
  if (Array.isArray(dayOfWeek)) return dayOfWeek[0] ?? null;
  return typeof dayOfWeek === "number" ? dayOfWeek : null;
}

/** Flattens the API's grouped response while preserving dated schedules. */
export function normalizeSchedules(source?: ScheduleSource | null): DoctorSchedule[] {
  if (!source) return [];

  const groupedSchedules = (source.schedule_groups || []).flatMap((group) => {
    if (group.schedules?.length) return group.schedules;

    if (!group.start_time || !group.end_time) return [];
    return [{
      id: group.item_ids?.[0],
      day_of_week: group.day_of_week || [],
      schedule_date: group.schedule_date,
      start_time: group.start_time,
      end_time: group.end_time,
      timezone: group.timezone,
      booking_mode: group.booking_mode,
      slot_duration_minutes: group.slot_duration_minutes,
      capacity: group.capacity,
      status: group.status,
    } satisfies DoctorSchedule];
  });

  if (groupedSchedules.length) return groupedSchedules;
  return source.schedules || [];
}
