import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  AlertTriangle,
  HelpCircle,
  Play,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Search,
  Sliders,
  FileCheck2,
  Clock,
  Compass,
  Zap,
  Info,
  Edit3
} from 'lucide-react';
import type { Discovery } from '../services/api';
import { useDemoJourney } from '../services/demoJourney';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface PresenterStoryBarProps {
  workspaceId: string;
  hasData: boolean;
  loadingDemo: boolean;
  onLoadDemo: () => Promise<void>;
  discoveries: Discovery[];
  onOpenWhyModal: (discovery: Discovery) => void;
}

export const PresenterStoryBar: React.FC<PresenterStoryBarProps> = ({
  workspaceId,
  hasData,
  loadingDemo,
  onLoadDemo,
  discoveries,
  onOpenWhyModal,
}) => {
  const navigate = useNavigate();
  const { journey, update, reset } = useDemoJourney(workspaceId);
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Localized Suggested Demo Question
  const localizedQuestion = t('storybar.step3_query') || 'Will I miss my exam because of the current gate closure and Route 4 disruption?';
  const [editableQuery, setEditableQuery] = useState(localizedQuestion);
  const [showQueryEdit, setShowQueryEdit] = useState(false);

  useEffect(() => {
    setEditableQuery(localizedQuestion);
  }, [localizedQuestion, language]);

  // Find the primary high-severity collision discovery
  const primaryConflict =
    discoveries.find(
      d =>
        d.title.toLowerCase().includes('commute') ||
        d.title.toLowerCase().includes('contradiction') ||
        d.title.toLowerCase().includes('exam') ||
        d.severity === 'high'
    ) || discoveries[0];

  // Auto-mark step 1 if data is already loaded in workspace
  const isStep1Done = journey.step1_loaded || hasData;
  const isStep2Done = journey.step2_inspected;
  const isStep3Done = journey.step3_queried;
  const isStep4Done = journey.step4_simulated;

  const completedCount = [isStep1Done, isStep2Done, isStep3Done, isStep4Done].filter(Boolean).length;

  const handleStep1Click = async () => {
    await onLoadDemo();
    update({ step1_loaded: true });
  };

  const handleStep2Click = () => {
    if (primaryConflict) {
      onOpenWhyModal(primaryConflict);
      update({ step2_inspected: true });
    } else {
      update({ step2_inspected: true });
      navigate(`/workspace/${workspaceId}/discoveries`);
    }
  };

  const handleStep3Click = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    update({ step3_queried: true });
    navigate(`/workspace/${workspaceId}/query?q=${encodeURIComponent(editableQuery.trim())}`);
  };

  const handleStep4Click = () => {
    update({ step4_simulated: true });
    navigate(`/workspace/${workspaceId}/simulate?preset=reschedule_exam&autoRun=true`);
  };

  return (
    <div className={`w-full border rounded-xl p-5 relative overflow-hidden transition-colors ${
      isDark ? 'bg-[#0D1219] border-[#202832] shadow-xs' : 'bg-white border-[#E2E8F0] shadow-xs'
    }`}>
      {/* Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b ${
        isDark ? 'border-[#202832]' : 'border-[#E2E8F0]'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center border ${
            isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
          }`}>
            <Compass className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                {t('storybar.badge') || 'Investigation Storyline'}
              </span>
              <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
              <span className={`text-xs font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{t('storybar.title') || 'RealityGraph Demo Journey'}</span>
            </div>
            <p className={`text-[11px] font-mono flex items-center space-x-1.5 mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              <span className={isStep1Done ? 'text-emerald-500 font-bold' : isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>LOAD</span>
              <span>→</span>
              <span className={isStep2Done ? 'text-emerald-500 font-bold' : isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>DISCOVER</span>
              <span>→</span>
              <span className={isStep3Done ? 'text-emerald-500 font-bold' : isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>ASK</span>
              <span>→</span>
              <span className={isStep4Done ? 'text-emerald-500 font-bold' : isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>SIMULATE</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Progress Pill */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-md text-[11px] font-mono border ${
            isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
          }`}>
            <span className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>{t('storybar.progress') || 'Progress'}:</span>
            <span className={completedCount === 4 ? 'text-emerald-500 font-bold' : isDark ? 'text-[#F1F5F9] font-bold' : 'text-[#0F172A] font-bold'}>
              {completedCount} / 4 {t('storybar.steps_completed') || 'Steps'}
            </span>
            {completedCount === 4 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          </div>

          {/* Reset button */}
          <button
            onClick={() => reset()}
            title="Reset Demo Journey state"
            className={`text-[10px] font-mono px-2 py-1 rounded transition cursor-pointer ${
              isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#161F2E]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
            }`}
          >
            {t('storybar.reset') || 'Reset'}
          </button>
        </div>
      </div>

      {/* 4 Investigation Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* STEP 1: LOAD SCENARIO */}
        <div
          className={`flex flex-col justify-between p-4 rounded-lg border transition-all duration-200 ${
            isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Step 01
              </span>
              {isStep1Done ? (
                <span className="inline-flex items-center text-[10px] font-mono text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t('storybar.step1_badge_done') || 'Loaded'}
                </span>
              ) : (
                <span className={`inline-flex items-center text-[10px] font-mono font-medium ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  {t('storybar.step1_badge_ready') || 'Ready'}
                </span>
              )}
            </div>

            <h3 className={`text-xs font-bold mb-1 flex items-center space-x-1.5 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              <span>{t('storybar.step1_title') || 'LOAD SCENARIO'}</span>
            </h3>
            <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {t('storybar.step1_desc') || 'Ingest 5 fragmented notices (Exam, Main Gate, Shuttle Detour, Weather Alert).'}
            </p>
          </div>

          <div>
            <button
              onClick={handleStep1Click}
              disabled={loadingDemo}
              className={`w-full py-2 px-3 rounded-md text-xs font-medium shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50 border ${
                isDark
                  ? 'bg-[#0D1219] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              {loadingDemo ? (
                <>
                  <RefreshCw className={`w-3.5 h-3.5 animate-spin ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
                  <span>{t('storybar.step1_btn_loading') || 'Processing...'}</span>
                </>
              ) : isStep1Done ? (
                <>
                  <RefreshCw className={`w-3 h-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
                  <span>{t('storybar.step1_btn_done') || 'Re-load Scenario'}</span>
                </>
              ) : (
                <>
                  <Database className={`w-3.5 h-3.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
                  <span>{t('storybar.step1_btn_ready') || 'Load College Demo'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STEP 2: INSPECT CONFLICTS */}
        <div
          className={`flex flex-col justify-between p-4 rounded-lg border transition-all duration-200 ${
            isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Step 02
              </span>
              {isStep2Done ? (
                <span className="inline-flex items-center text-[10px] font-mono text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t('storybar.step2_badge_done') || 'Inspected'}
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-mono text-amber-500 font-semibold">
                  {t('storybar.step2_badge_ready') || 'Critical Clash'}
                </span>
              )}
            </div>

            <h3 className={`text-xs font-bold mb-1 flex items-center space-x-1.5 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              <span>{t('storybar.step2_title') || 'INSPECT CONFLICTS'}</span>
            </h3>
            <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {t('storybar.step2_desc') || 'Context engine detects Main Gate closure colliding with Route 4 exam commute.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={handleStep2Click}
              disabled={!isStep1Done}
              className={`w-full py-2 px-3 rounded-md text-xs font-medium shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50 border ${
                isDark
                  ? 'bg-[#0D1219] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('storybar.step2_btn') || 'Inspect "Why?" Evidence'}</span>
            </button>
            <button
              onClick={() => {
                update({ step2_inspected: true });
                navigate(`/workspace/${workspaceId}/discoveries`);
              }}
              className={`w-full text-[10px] font-mono py-1 text-center transition cursor-pointer ${isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              {t('storybar.step2_link') || 'Open Discoveries Feed →'}
            </button>
          </div>
        </div>

        {/* STEP 3: ASK REALITYGRAPH */}
        <div
          className={`flex flex-col justify-between p-4 rounded-lg border transition-all duration-200 ${
            isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Step 03
              </span>
              {isStep3Done ? (
                <span className="inline-flex items-center text-[10px] font-mono text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t('storybar.step3_badge_done') || 'Answered'}
                </span>
              ) : (
                <span className={`inline-flex items-center text-[10px] font-mono font-medium ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  {t('storybar.step3_badge_ready') || 'Ready'}
                </span>
              )}
            </div>

            <h3 className={`text-xs font-bold mb-1 flex items-center space-x-1.5 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              <span>{t('storybar.step3_title') || 'ASK REALITYGRAPH'}</span>
            </h3>

            {showQueryEdit ? (
              <form onSubmit={handleStep3Click} className="my-2">
                <input
                  type="text"
                  value={editableQuery}
                  onChange={e => setEditableQuery(e.target.value)}
                  className={`w-full rounded-md p-1.5 text-[11px] focus:outline-none border ${
                    isDark ? 'bg-[#0D1219] border-[#202832] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />
              </form>
            ) : (
              <p
                onClick={() => setShowQueryEdit(true)}
                title="Click to edit suggested question"
                className={`text-[11px] italic line-clamp-2 cursor-pointer transition my-1.5 p-1.5 rounded border ${
                  isDark
                    ? 'text-[#F1F5F9] hover:text-white bg-[#0D1219] border-[#202832]'
                    : 'text-[#0F172A] hover:text-slate-950 bg-white border-[#E2E8F0]'
                }`}
              >
                "{editableQuery}"
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => handleStep3Click()}
              disabled={!isStep1Done}
              className={`w-full py-2 px-3 rounded-md text-xs font-medium shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50 border ${
                isDark
                  ? 'bg-[#0D1219] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
              <span>{t('storybar.step3_btn') || 'Query Intelligence →'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQueryEdit(!showQueryEdit)}
              className={`w-full text-[10px] font-mono py-1 flex items-center justify-center space-x-1 transition cursor-pointer ${isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              <Edit3 className="w-3 h-3" />
              <span>{showQueryEdit ? (t('storybar.step3_lock') || 'Lock Question') : (t('storybar.step3_edit') || 'Edit Question')}</span>
            </button>
          </div>
        </div>

        {/* STEP 4: SIMULATE RESOLUTION */}
        <div
          className={`flex flex-col justify-between p-4 rounded-lg border transition-all duration-200 ${
            isDark ? 'bg-[#111722] border-[#202832]' : 'bg-slate-50 border-[#E2E8F0]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                Step 04
              </span>
              {isStep4Done ? (
                <span className="inline-flex items-center text-[10px] font-mono text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t('storybar.step4_badge_done') || 'Resolved'}
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-mono text-emerald-500 font-semibold">
                  {t('storybar.step4_badge_ready') || 'Resolution Fix'}
                </span>
              )}
            </div>

            <h3 className={`text-xs font-bold mb-1 flex items-center space-x-1.5 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
              <span>{t('storybar.step4_title') || 'SIMULATE RESOLUTION'}</span>
            </h3>
            <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              {t('storybar.step4_desc') || 'Counterfactual what-if: Move exam to Sept 24 to completely resolve clashes.'}
            </p>
          </div>

          <div>
            <button
              onClick={handleStep4Click}
              disabled={!isStep1Done}
              className={`w-full py-2 px-3 rounded-md text-xs font-medium shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50 border ${
                isDark
                  ? 'bg-[#0D1219] hover:bg-[#161F2E] text-[#F1F5F9] border-[#202832]'
                  : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
              }`}
            >
              <Sliders className={`w-3.5 h-3.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
              <span>{isStep4Done ? (t('storybar.step4_btn_done') || 'Re-run Simulation') : (t('storybar.step4_btn_ready') || 'Simulate Resolution →')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
