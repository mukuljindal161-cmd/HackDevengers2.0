import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Calendar, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import type { TimelineEvent } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const TimelinePage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = useCallback(() => {
    if (!workspaceId) return;
    setLoading(true);
    api.getTimeline(workspaceId)
      .then(data => setEvents(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [workspaceId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isDark ? 'bg-[#080B10]' : 'bg-[#F6F8FA]'}`}>
      {/* Header */}
      <div className={`h-14 border-b px-6 flex items-center justify-between transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <Clock className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>Timeline & Temporal Clashes</h1>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
            isDark ? 'bg-[#111722] border-[#202832] text-[#94A3B8]' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            {events.length} chronological markers
          </span>
        </div>
        <button
          onClick={fetchTimeline}
          title="Refresh Timeline"
          className={`p-1.5 rounded-md border transition cursor-pointer ${
            isDark ? 'bg-[#111722] hover:bg-[#1A2333] border-[#202832] text-[#94A3B8]' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        {events.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-3 ${
              isDark ? 'bg-[#111722] border-[#202832] text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <Clock className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>No Events Scheduled</h3>
            <p className={`text-xs max-w-sm mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
              Ingest notices or load the demo dataset to analyze schedule clashes.
            </p>
          </div>
        )}

        <div className={`relative border-l ml-4 pl-8 space-y-6 ${isDark ? 'border-[#202832]' : 'border-slate-300'}`}>
          {events.map(ev => {
            const isExam = ev.event_type.toLowerCase() === 'exam';
            const isClosure = ev.event_type.toLowerCase() === 'closure';
            const isWeather = ev.event_type.toLowerCase() === 'weather';

            return (
              <div key={ev.id} className="relative group">
                {/* Timeline node icon on vertical line */}
                <div className={`absolute -left-10.25 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border ${
                  isDark ? 'bg-[#111722] border-[#202832]' : 'bg-white border-slate-300'
                } ${
                  isExam ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                  isClosure ? (isDark ? 'text-rose-400' : 'text-rose-600') :
                  isWeather ? (isDark ? 'text-amber-400' : 'text-amber-600') :
                  (isDark ? 'text-[#94A3B8]' : 'text-slate-600')
                }`}>
                  <Calendar className="w-3 h-3" />
                </div>

                <div className={`rounded-xl border p-4 shadow-xs transition ${
                  isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isExam ? 'text-blue-500' :
                      isClosure ? 'text-rose-500' :
                      isWeather ? 'text-amber-500' :
                      (isDark ? 'text-[#94A3B8]' : 'text-slate-600')
                    }`}>
                      ● {ev.event_type}
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                      {ev.start_time ? new Date(ev.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date Pending'}
                    </span>
                  </div>

                  <h3 className={`text-sm font-semibold mt-2 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>{ev.title}</h3>

                  <div className={`mt-2 text-xs font-mono flex items-center space-x-3 ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
                    <span>
                      Window: {ev.start_time ? new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - {ev.end_time ? new Date(ev.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
