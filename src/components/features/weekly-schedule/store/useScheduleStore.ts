import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity, ActivityColorPreset, ActivityFormInput, DayOfWeek, ScheduleSettings } from '../types';

interface ScheduleState {
  activities: Activity[];
  settings: ScheduleSettings;
  history: Activity[][];
  historyIndex: number;
  upsertActivity: (input: ActivityFormInput, activityId?: string) => void;
  removeActivity: (activityId: string) => void;
  resizeActivity: (activityId: string, durationMinutes: number) => void;
  moveActivity: (activityId: string, day: DayOfWeek, startMinutes: number) => void;
  updateSettings: (settings: Partial<ScheduleSettings>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const defaultSettings: ScheduleSettings = {
  slotMinutes: 30,
  resizeStepMinutes: 15,
  dayStartHour: 6,
  dayEndHour: 22,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

const clampDuration = (minutes: number) => Math.max(15, Math.min(minutes, 24 * 60));
const dayOrder: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

const normalizeLegacyActivity = (activity: any): Activity => {
  const legacyDayIndex = typeof activity?.dayIndex === 'number' ? activity.dayIndex : 0;
  const fallbackDay = dayOrder[Math.min(Math.max(legacyDayIndex, 0), 6)];
  return {
    ...activity,
    days: Array.isArray(activity?.days) && activity.days.length > 0 ? activity.days : [fallbackDay],
    color:
      activity?.color && typeof activity.color === 'object' && typeof activity.color.value === 'string'
        ? activity.color
        : {
            preset: ActivityColorPreset.CUSTOM,
            value: typeof activity?.color === 'string' ? activity.color : '#6750A4',
          },
  };
};

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      activities: [],
      settings: defaultSettings,
      history: [[]],
      historyIndex: 0,
      upsertActivity: (input, activityId) =>
        set((state) => {
          const now = new Date().toISOString();
          let newActivities: Activity[];

          if (activityId) {
            newActivities = state.activities.map((activity) =>
              activity.id === activityId
                ? { ...activity, ...input, durationMinutes: clampDuration(input.durationMinutes), updatedAt: now }
                : activity,
            );
          } else {
            const newActivity: Activity = {
              ...input,
              id: crypto.randomUUID(),
              durationMinutes: clampDuration(input.durationMinutes),
              createdAt: now,
              updatedAt: now,
            };
            newActivities = [...state.activities, newActivity];
          }

          // Add to history (remove redo entries)
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newActivities);

          return {
            activities: newActivities,
            history: newHistory.slice(-50), // Keep last 50 entries
            historyIndex: newHistory.length - 1,
          };
        }),
      removeActivity: (activityId) =>
        set((state) => {
          const newActivities = state.activities.filter((activity) => activity.id !== activityId);

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newActivities);

          return {
            activities: newActivities,
            history: newHistory.slice(-50),
            historyIndex: newHistory.length - 1,
          };
        }),
      resizeActivity: (activityId, durationMinutes) =>
        set((state) => {
          const newActivities = state.activities.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  durationMinutes: clampDuration(durationMinutes),
                  updatedAt: new Date().toISOString(),
                }
              : activity,
          );

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newActivities);

          return {
            activities: newActivities,
            history: newHistory.slice(-50),
            historyIndex: newHistory.length - 1,
          };
        }),
      moveActivity: (activityId, day, startMinutes) =>
        set((state) => {
          const newActivities = state.activities.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  days: Array.isArray(activity.days)
                    ? activity.days.includes(day)
                      ? activity.days
                      : [day, ...activity.days].slice(0, 7)
                    : [day],
                  startMinutes,
                  updatedAt: new Date().toISOString(),
                }
              : activity,
          );

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newActivities);

          return {
            activities: newActivities,
            history: newHistory.slice(-50),
            historyIndex: newHistory.length - 1,
          };
        }),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          set({
            activities: state.history[newIndex],
            historyIndex: newIndex,
          });
        }
      },
      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          set({
            activities: state.history[newIndex],
            historyIndex: newIndex,
          });
        }
      },
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    }),
    {
      name: 'psymind-weekly-schedule',
      version: 3,
      migrate: (persistedState: any) => {
        const rawActivities = Array.isArray(persistedState?.activities) ? persistedState.activities : [];
        return {
          ...persistedState,
          activities: rawActivities.map(normalizeLegacyActivity),
          history: [rawActivities.map(normalizeLegacyActivity)],
          historyIndex: 0,
        };
      },
      merge: (persistedState: any, currentState) => {
        const rawActivities = Array.isArray(persistedState?.activities) ? persistedState.activities : [];
        return {
          ...currentState,
          ...persistedState,
          activities: rawActivities.map(normalizeLegacyActivity),
          history: persistedState?.history || [rawActivities.map(normalizeLegacyActivity)],
          historyIndex: persistedState?.historyIndex || 0,
        };
      },
      partialize: (state) => ({
        activities: state.activities,
        settings: state.settings,
        history: state.history,
        historyIndex: state.historyIndex,
      }),
    },
  ),
);
