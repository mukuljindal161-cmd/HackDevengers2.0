import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  CheckCircle2,
  File,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import type { Source } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const SourcesPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [submittingText, setSubmittingText] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const fetchSources = useCallback(() => {
    if (!workspaceId) return;
    setLoading(true);
    api.listSources(workspaceId)
      .then(data => setSources(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [workspaceId]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !workspaceId) return;

    setUploadingFile(true);
    try {
      await api.uploadSourceFile(workspaceId, file);
      fetchSources();
    } catch (err: any) {
      alert(`File upload failed: ${err.message}`);
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !textTitle || !textContent) return;

    setSubmittingText(true);
    try {
      await api.createTextSource(workspaceId, {
        name: textTitle,
        content: textContent,
      });
      setTextTitle('');
      setTextContent('');
      fetchSources();
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmittingText(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    try {
      await api.deleteSource(id);
      setSources(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isDark ? 'bg-[#080B10]' : 'bg-[#F6F8FA]'}`}>
      {/* Header */}
      <div className={`h-14 border-b px-6 flex items-center justify-between transition-colors ${
        isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <FileText className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
            Source Documents & Ingestion
          </h1>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
            isDark ? 'bg-[#111722] border-[#202832] text-[#94A3B8]' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            {sources.length} sources
          </span>
        </div>
        <button
          onClick={fetchSources}
          title="Refresh Sources"
          className={`p-1.5 rounded-md border transition cursor-pointer ${
            isDark ? 'bg-[#111722] hover:bg-[#1A2333] border-[#202832] text-[#94A3B8]' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Grid: Upload & Paste on Left, Sources List on Right */}
      <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Ingestion Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Box */}
          <div className={`rounded-xl border p-5 shadow-xs ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
              Upload Document
            </h3>
            <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition group ${
              isDark ? 'border-[#202832] hover:border-slate-500 bg-[#111722]' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            }`}>
              <UploadCloud className={`w-8 h-8 mb-2 transition ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-xs font-semibold ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>
                {uploadingFile ? 'Uploading & Processing...' : 'Select PDF, TXT, or DOCX'}
              </span>
              <span className={`text-[10px] mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>Files are parsed into semantic chunks & entities</span>
              <input
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploadingFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Direct Text Input */}
          <div className={`rounded-xl border p-5 shadow-xs ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
              Direct Notice Entry
            </h3>
            <form onSubmit={handleTextSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Notice Title (e.g. Campus Road Closure Advisory)"
                  value={textTitle}
                  onChange={e => setTextTitle(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-xs focus:outline-none transition ${
                    isDark ? 'bg-[#080B10] border-[#202832] text-[#F1F5F9] placeholder-[#64748B] focus:border-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  }`}
                />
              </div>
              <div>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste notice announcement text, exam timings, or route changes..."
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  className={`w-full border rounded-md p-3 text-xs leading-relaxed font-mono focus:outline-none transition ${
                    isDark ? 'bg-[#080B10] border-[#202832] text-[#F1F5F9] placeholder-[#64748B] focus:border-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={submittingText}
                className={`w-full py-2.5 px-4 rounded-md text-xs font-medium shadow-xs transition flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer border ${
                  isDark
                    ? 'bg-[#111722] hover:bg-[#1A2333] text-[#F1F5F9] border-[#202832]'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                <Plus className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span>{submittingText ? 'Ingesting...' : 'Ingest & Analyze Notice'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Sources List (7 cols) */}
        <div className="lg:col-span-7">
          <div className={`rounded-xl border p-5 shadow-xs flex flex-col h-full ${
            isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-[#F1F5F9]' : 'text-slate-700'}`}>
              Ingested Information Sources
            </h3>

            {sources.length === 0 && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <File className="w-10 h-10 text-slate-600 mb-2" />
                <span className={`text-xs ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>No documents ingested in this workspace</span>
              </div>
            )}

            <div className="space-y-2.5 overflow-y-auto flex-1">
              {sources.map(source => (
                <div
                  key={source.id}
                  className={`p-3.5 rounded-lg border flex items-center justify-between transition ${
                    isDark ? 'bg-[#111722] border-[#202832] hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border ${
                      isDark ? 'bg-[#0D1219] border-[#202832] text-blue-400' : 'bg-white border-slate-200 text-blue-600'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className={`text-xs font-semibold truncate ${isDark ? 'text-[#F1F5F9]' : 'text-slate-800'}`}>{source.name}</h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                          isDark ? 'bg-[#0D1219] border-[#202832] text-[#94A3B8]' : 'bg-white border-slate-200 text-slate-600'
                        }`}>
                          {source.type}
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-slate-500'}`}>
                          {new Date(source.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`flex items-center text-[10px] font-medium px-2 py-0.5 rounded border ${
                      isDark ? 'text-[#94A3B8] border-[#202832] bg-[#0D1219]' : 'text-slate-600 border-slate-200 bg-white'
                    }`}>
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                      Completed
                    </span>
                    <button
                      onClick={() => handleDelete(source.id)}
                      title="Delete Source"
                      className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
