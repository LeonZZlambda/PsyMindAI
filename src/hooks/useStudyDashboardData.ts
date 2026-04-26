import { useEffect, useMemo, useState } from 'react';
import type { StudyDashboardState } from '../components/study-dashboard/types';
import { createStudyLog, createStudyDashboardViewModel, readStudyLogs, readTelemetryMetrics, saveStudyLogs } from '../components/study-dashboard/data';
import type { StudyTranslation } from '../components/study-dashboard/types';

const createInitialState = (t: StudyTranslation): StudyDashboardState => ({
  logs: [],
  status: 'idle',
  telemetry: null,
  viewModel: createStudyDashboardViewModel([], null, t),
});

export const useStudyDashboardData = (isOpen: boolean, t: StudyTranslation) => {
  const [state, setState] = useState<StudyDashboardState>(() => createInitialState(t));

  useEffect(() => {
    if (!isOpen) return;

    setState((previousState) => ({
      ...previousState,
      status: 'loading',
    }));

    const timeoutId = window.setTimeout(() => {
      const logs = readStudyLogs();
      const telemetry = readTelemetryMetrics();

      setState({
        logs,
        status: 'ready',
        telemetry,
        viewModel: createStudyDashboardViewModel(logs, telemetry, t),
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, t]);

  const actions = useMemo(
    () => ({
      addLog(topic: string, minutes: number) {
        setState((currentState) => {
          const newLog = createStudyLog(topic, minutes);
          const logs = [...currentState.logs, newLog];
          saveStudyLogs(logs);

          return {
            logs,
            status: 'ready',
            telemetry: currentState.telemetry,
            viewModel: createStudyDashboardViewModel(logs, currentState.telemetry, t),
          };
        });
      },
    }),
    [t],
  );

  return {
    ...state,
    ...actions,
  };
};

export default useStudyDashboardData;
