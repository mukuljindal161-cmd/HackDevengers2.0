import { useState, useEffect, useCallback } from 'react';

export interface DemoJourneyState {
  step1_loaded: boolean;
  step2_inspected: boolean;
  step3_queried: boolean;
  step4_simulated: boolean;
}

const STORAGE_KEY_PREFIX = 'realitygraph_demo_journey_';
const EVENT_NAME = 'realitygraph_demo_journey_updated';

export const getDemoJourney = (workspaceId: string): DemoJourneyState => {
  if (typeof window === 'undefined' || !workspaceId) {
    return {
      step1_loaded: false,
      step2_inspected: false,
      step3_queried: false,
      step4_simulated: false,
    };
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${workspaceId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse demo journey state:', err);
  }
  return {
    step1_loaded: false,
    step2_inspected: false,
    step3_queried: false,
    step4_simulated: false,
  };
};

export const updateDemoJourney = (
  workspaceId: string,
  updates: Partial<DemoJourneyState>
): DemoJourneyState => {
  if (typeof window === 'undefined' || !workspaceId) {
    return {
      step1_loaded: false,
      step2_inspected: false,
      step3_queried: false,
      step4_simulated: false,
      ...updates,
    };
  }
  const current = getDemoJourney(workspaceId);
  const next = { ...current, ...updates };
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${workspaceId}`, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { workspaceId, state: next } }));
  } catch (err) {
    console.warn('Failed to store demo journey state:', err);
  }
  return next;
};

export const resetDemoJourney = (workspaceId: string): DemoJourneyState => {
  const initial: DemoJourneyState = {
    step1_loaded: false,
    step2_inspected: false,
    step3_queried: false,
    step4_simulated: false,
  };
  if (typeof window !== 'undefined' && workspaceId) {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${workspaceId}`, JSON.stringify(initial));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { workspaceId, state: initial } }));
    } catch (err) {
      console.warn('Failed to reset demo journey state:', err);
    }
  }
  return initial;
};

export const useDemoJourney = (workspaceId?: string) => {
  const [journey, setJourney] = useState<DemoJourneyState>(() =>
    workspaceId ? getDemoJourney(workspaceId) : {
      step1_loaded: false,
      step2_inspected: false,
      step3_queried: false,
      step4_simulated: false,
    }
  );

  useEffect(() => {
    if (!workspaceId) return;
    setJourney(getDemoJourney(workspaceId));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ workspaceId: string; state: DemoJourneyState }>;
      if (customEvent.detail && customEvent.detail.workspaceId === workspaceId) {
        setJourney(customEvent.detail.state);
      } else {
        setJourney(getDemoJourney(workspaceId));
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, [workspaceId]);

  const update = useCallback(
    (updates: Partial<DemoJourneyState>) => {
      if (!workspaceId) return;
      return updateDemoJourney(workspaceId, updates);
    },
    [workspaceId]
  );

  const reset = useCallback(() => {
    if (!workspaceId) return;
    return resetDemoJourney(workspaceId);
  }, [workspaceId]);

  return { journey, update, reset };
};
