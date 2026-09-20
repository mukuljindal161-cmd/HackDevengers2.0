import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  FileText,
  Compass,
  Clock,
  MessageSquare,
  Cpu,
  LogOut,
  ChevronDown,
  Database,
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Info,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { ThemeToggle } from '../components/ThemeToggle';
import { api } from '../services/api';
import type { Workspace, Notification } from '../services/api';
import { LiveExecutionTracker } from '../components/LiveExecutionTracker';
import { RealityGraphLogo } from '../components/RealityGraphLogo';
import { SecurityTrustModal } from '../components/SecurityTrustModal';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trustModalOpen, setTrustModalOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    api.getWorkspaces()
      .then(data => {
        setWorkspaces(data);
        if (!workspaceId && data.length > 0) {
          navigate(`/workspace/${data[0].id}/command-center`);
        }
      })
      .catch(err => console.error(err));
  }, [workspaceId, navigate]);

  const activeWorkspace = workspaces.find(w => w.id === workspaceId) || workspaces[0];

  const handleLoadDemo = async () => {
    if (!activeWorkspace) return;
    setLoadingDemo(true);
    setDemoMessage(null);
    try {
      await api.loadDemoDataset(activeWorkspace.id);
      setDemoMessage('Demo dataset loaded! Re-analyzing graph...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      alert(`Failed to load demo: ${err.message}`);
    } finally {
      setLoadingDemo(false);
    }
  };

  const currentWsId = activeWorkspace?.id || '';

  const navItems = [
    { to: `/workspace/${currentWsId}/command-center`, icon: LayoutDashboard, label: t('nav.command_center') },
    { to: `/workspace/${currentWsId}/graph`, icon: Network, label: t('nav.graph') },
    { to: `/workspace/${currentWsId}/discoveries`, icon: Compass, label: t('nav.discoveries') },
    { to: `/workspace/${currentWsId}/sources`, icon: FileText, label: t('nav.sources') },
    { to: `/workspace/${currentWsId}/timeline`, icon: Clock, label: t('nav.timeline') },
    { to: `/workspace/${currentWsId}/query`, icon: MessageSquare, label: t('nav.query') },
    { to: `/workspace/${currentWsId}/simulate`, icon: Cpu, label: t('nav.simulate') },
  ];

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-colors ${isDark ? 'bg-[#060B10] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r flex flex-col shrink-0 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDark ? 'border-[#202832] bg-[#0D1219]' : 'border-[#E2E8F0] bg-white'}`}
      >
        {/* Brand */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-[#202832]' : 'border-[#E2E8F0]'}`}>
          <RealityGraphLogo size="md" onClick={() => navigate(`/workspace/${workspaceId}/command-center`)} />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className={`md:hidden p-1 cursor-pointer ${isDark ? 'text-[#94A3B8] hover:text-[#F1F5F9]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace selector */}
        <div className={`p-3 border-b ${isDark ? 'border-[#202832]' : 'border-[#E2E8F0]'}`}>
          <label className={`text-[10px] uppercase font-semibold tracking-wider mb-1.5 block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            {t('common.active_workspace') || 'Active Workspace'}
          </label>
          <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium ${isDark ? 'bg-[#080B10] border-[#202832] text-[#F1F5F9]' : 'bg-slate-50 border-[#E2E8F0] text-[#0F172A]'}`}>
            <span className="truncate">{activeWorkspace?.name || 'Loading...'}</span>
            <ChevronDown className={`w-3.5 h-3.5 ml-1 shrink-0 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-[#11161D] text-white border-l-2 border-slate-400 pl-2.5'
                        : 'bg-slate-100 text-slate-900 border-l-2 border-slate-800 pl-2.5 font-semibold'
                      : isDark
                        ? 'text-[#64748B] hover:text-slate-200 hover:bg-[#11161D]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* 1-Click Load Demo Dataset Button */}
        <div className={`p-3 border-t ${isDark ? 'border-[#202832]' : 'border-slate-200'}`}>
          <button
            onClick={handleLoadDemo}
            disabled={loadingDemo}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-md border text-xs font-medium shadow-xs transition disabled:opacity-50 cursor-pointer ${
              isDark
                ? 'bg-[#11161D] text-slate-100 border-[#202832] hover:bg-[#1A2230]'
                : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>{loadingDemo ? t('storybar.step1_btn_loading') : (t('storybar.step1_btn_ready') || 'Load Campus Demo')}</span>
          </button>
          {demoMessage && (
            <p className={`text-[11px] text-center mt-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-medium'}`}>
              {demoMessage}
            </p>
          )}
        </div>

        {/* User profile & logout */}
        <div className={`p-3 border-t flex items-center justify-between ${isDark ? 'border-[#202832]' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${isDark ? 'bg-[#11161D] text-slate-300 border-[#202832]' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <span className={`text-xs font-medium block truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{user?.name || 'User'}</span>
              <span className={`text-[10px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className={`p-1.5 rounded-md transition cursor-pointer ${isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/50' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-200'}`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area with Sticky Header */}
      <main className={`flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-colors ${isDark ? 'bg-[#080B10]' : 'bg-[#F6F8FA]'}`}>
        
        {/* Sticky Fixed-Top Header Navbar */}
        <header className={`sticky top-0 z-40 h-14 border-b px-4 sm:px-6 flex items-center justify-between shrink-0 transition-colors ${
          isDark ? 'border-[#202832] bg-[#0D1219]/95 backdrop-blur-md shadow-xs' : 'border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-xs'
        }`}>
          {/* Left: Mobile hamburger toggle & Status */}
          <div className="flex items-center space-x-3 overflow-hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-1.5 rounded-md border cursor-pointer ${
                isDark ? 'bg-[#111722] border-[#202832] text-[#F1F5F9] hover:bg-[#161F2E]' : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-xs truncate">
              <span className="truncate">
                <span className={`hidden sm:inline ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Active: </span>
                <strong className={isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}>{activeWorkspace?.name || 'Workspace'}</strong>
              </span>
            </div>
          </div>

          {/* Right: Language, Theme & Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Global Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            <div className="relative" ref={notifDropdownRef}>
              {/* Notification Bell Button */}
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className={`relative p-2 rounded-md transition-colors cursor-pointer border ${
                  showNotifMenu
                    ? isDark ? 'bg-[#161F2E] text-[#F1F5F9] border-slate-500' : 'bg-slate-100 text-[#0F172A] border-slate-400'
                    : isDark ? 'bg-[#111722] text-[#94A3B8] hover:text-[#F1F5F9] border-[#202832] hover:bg-[#161F2E]' : 'bg-white text-[#64748B] hover:text-[#0F172A] border-[#E2E8F0] hover:bg-slate-50'
                }`}
                title="Intelligence Alerts & Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Popover */}
              {showNotifMenu && (
                <div className={`absolute right-0 mt-2 w-80 sm:w-96 max-w-[92vw] rounded-xl border shadow-xl z-50 overflow-hidden flex flex-col animate-fadeIn ${
                  isDark ? 'bg-[#0D1219] border-[#202832] shadow-black/80' : 'bg-white border-[#E2E8F0] shadow-slate-300/40'
                }`}>
                  {/* Dropdown Header */}
                  <div className={`p-3.5 border-b flex items-center justify-between ${isDark ? 'border-[#202832]' : 'border-[#E2E8F0]'}`}>
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                        Intelligence Alerts
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-mono text-rose-500 font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className={`text-[11px] flex items-center space-x-1 font-medium transition cursor-pointer ${
                          isDark ? 'text-[#94A3B8] hover:text-white' : 'text-[#64748B] hover:text-slate-900'
                        }`}
                      >
                        <CheckCheck className="w-3.5 h-3.5 mr-0.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                        <p className={`font-medium ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>All Clear</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          No pending intelligence warnings.
                        </p>
                      </div>
                    ) : (
                      notifications.map(n => {
                        const isAlert = n.type === 'alert';
                        const isWarning = n.type === 'warning';
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              setShowNotifMenu(false);
                              navigate(`/workspace/${currentWsId}/command-center`);
                            }}
                            className={`p-3.5 transition flex items-start space-x-3 cursor-pointer ${
                              n.read
                                ? isDark ? 'bg-[#0D1219] hover:bg-[#111722] text-[#94A3B8]' : 'bg-white hover:bg-slate-50 text-[#64748B]'
                                : isDark ? 'bg-[#111722] hover:bg-[#161F2E] text-[#F1F5F9]' : 'bg-slate-50 hover:bg-slate-100 text-[#0F172A]'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                              isDark ? 'bg-[#0D1219] border-[#202832]' : 'bg-white border-[#E2E8F0]'
                            } ${
                              isAlert
                                ? 'text-amber-500'
                                : isWarning
                                ? 'text-rose-500'
                                : 'text-slate-400'
                            }`}>
                              {isAlert ? (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              ) : isWarning ? (
                                <Zap className="w-3.5 h-3.5" />
                              ) : (
                                <Info className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold truncate ${
                                  n.read ? 'text-slate-400' : isDark ? 'text-slate-100' : 'text-slate-900'
                                }`}>
                                  {n.title}
                                </span>
                                {!n.read && (
                                  <button
                                    onClick={(e) => handleMarkRead(n.id, e)}
                                    title="Mark as read"
                                    className="text-slate-500 hover:text-emerald-400 p-0.5 rounded transition shrink-0 ml-1 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-500 block mt-1.5 font-mono">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Scroll Area — keyed by route so each page animates in */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div key={location.pathname} className="animate-pageEnter h-full">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Live SSE progress tracker */}
      {currentWsId && <LiveExecutionTracker workspaceId={currentWsId} />}

      {/* Security, Trust & Governance Modal */}
      <SecurityTrustModal
        isOpen={trustModalOpen}
        onClose={() => setTrustModalOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
