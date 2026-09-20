import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, Activity } from 'lucide-react';

interface AgentStep {
  step: string;
  status: 'running' | 'completed' | 'failed';
  message: string;
  execution_id?: string;
}

export const LiveExecutionTracker: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;

    const eventSource = new EventSource(`/api/v1/workspaces/${workspaceId}/events`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event === 'agent_step') {
          const stepData: AgentStep = payload.data;
          setCurrentStep(stepData);
          setVisible(true);

          if (stepData.status === 'completed' && stepData.step === 'Complete') {
            setTimeout(() => {
              setVisible(false);
            }, 6000);
          }
        }
      } catch {
        // Ignored keepalives
      }
    };

    return () => {
      eventSource.close();
    };
  }, [workspaceId]);

  if (!visible || !currentStep) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-[#0D1117] border border-[#202832] rounded-xl p-4 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-[#202832]">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-200">AI Reasoning Pipeline</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#202832] text-slate-400">
          Live
        </span>
      </div>

      <div className="mt-3 flex items-start space-x-3">
        {currentStep.status === 'running' && (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0 mt-0.5" />
        )}
        {currentStep.status === 'completed' && (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        )}
        {currentStep.status === 'failed' && (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        )}

        <div className="flex-1">
          <div className="text-sm font-medium text-slate-100 flex items-center justify-between">
            <span>{currentStep.step}</span>
            <span className="text-xs text-slate-400 capitalize">{currentStep.status}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {currentStep.message}
          </p>
        </div>
      </div>
    </div>
  );
};
