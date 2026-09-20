import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User as UserIcon, Zap, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { RealityGraphLogo } from '../components/RealityGraphLogo';

// Animated canvas background with floating network nodes
const AnimatedBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const NUM_NODES = 28;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < NUM_NODES; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const alpha = (1 - dist / 160) * (isDark ? 0.12 : 0.07);
            ctx.strokeStyle = isDark ? `rgba(59,130,246,${alpha})` : `rgba(99,102,241,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(59,130,246,0.22)' : 'rgba(99,102,241,0.15)';
        ctx.fill();
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
};

export const AuthPage: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading, login, register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/workspace', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/workspace');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = 'alex.morgan@campus.edu';
      const demoPassword = 'Password123!';
      try {
        await login(demoEmail, demoPassword);
      } catch {
        // If demo user not yet created, register it automatically
        await register(demoEmail, demoPassword, 'Alex Morgan');
      }
      navigate('/workspace');
    } catch (err: any) {
      setError(err.message || 'Demo sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors ${
      isDark ? 'bg-[#060B10] text-slate-100' : 'bg-[#F0F4FA] text-slate-900'
    }`}>
      {/* Animated network background */}
      <AnimatedBackground isDark={isDark} />

      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-3xl opacity-20" style={{
          width: 600, height: 600,
          background: isDark ? 'radial-gradient(circle, #1d4ed8, transparent)' : 'radial-gradient(circle, #6366f1, transparent)',
          top: '-150px', left: '-150px',
        }} />
        <div className="absolute rounded-full blur-3xl opacity-15" style={{
          width: 400, height: 400,
          background: isDark ? 'radial-gradient(circle, #0ea5e9, transparent)' : 'radial-gradient(circle, #3b82f6, transparent)',
          bottom: '-100px', right: '-100px',
        }} />
      </div>

      {/* Card */}
      <div className={`relative w-full max-w-md border rounded-2xl p-7 sm:p-9 z-10 ${
        isDark
          ? 'bg-[#0D1117]/90 border-[#1E2A3A] shadow-2xl shadow-black/50 backdrop-blur-xl'
          : 'bg-white/90 border-slate-200 shadow-2xl shadow-slate-300/40 backdrop-blur-xl'
      }`}>

        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <RealityGraphLogo size="lg" showText={false} />
          </div>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {isRegister ? 'Create RealityGraph Account' : 'Welcome to RealityGraph'}
          </h2>
          <p className={`text-xs mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isRegister
              ? 'Start discovering hidden connections in your documents'
              : 'Enter your credentials to access your intelligence workspace'}
          </p>
        </div>

        {/* 1-Click Demo — Primary CTA highlighted at top */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold shadow-lg transition-all flex items-center justify-center space-x-2.5 cursor-pointer mb-6 ${
            isDark
              ? 'bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/40 hover:shadow-blue-800/50 hover:scale-[1.01]'
              : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-200/60 hover:scale-[1.01]'
          } disabled:opacity-60 disabled:scale-100`}
          style={{ transition: 'all 0.15s ease' }}
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>1-Click Hackathon Demo Access</span>
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDark ? 'border-[#1E2A3A]' : 'border-slate-200'}`} />
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className={`px-3 font-medium tracking-wider ${
              isDark ? 'bg-[#0D1117] text-slate-500' : 'bg-white text-slate-400'
            }`}>
              OR SIGN IN WITH CREDENTIALS
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 transition ${
                    isDark
                      ? 'bg-[#11161D] border-[#1E2A3A] text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 transition ${
                  isDark
                    ? 'bg-[#11161D] border-[#1E2A3A] text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 transition ${
                  isDark
                    ? 'bg-[#11161D] border-[#1E2A3A] text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2 cursor-pointer border ${
              isDark
                ? 'bg-[#11161D] hover:bg-[#1A2230] text-slate-100 border-[#1E2A3A]'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
            }`}
          >
            <span>{isRegister ? 'Register & Launch' : 'Sign In'}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
            <Link
              to={isRegister ? '/login' : '/register'}
              className={`underline font-medium ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
            >
              {isRegister ? 'Sign in' : 'Create one now'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};