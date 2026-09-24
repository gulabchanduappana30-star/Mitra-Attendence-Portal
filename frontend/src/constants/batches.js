// Batch Metadata definitions for Vibe Coding, AI, Marketing, Industry Connect

export const BATCHES = [
  {
    id: 'vibe-coding',
    name: 'Vibe Coding',
    code: 'VC',
    description: 'Rapid AI-assisted app creation & vibe-driven developer workflows',
    color: '#8b5cf6', // Violet
    bgLight: 'bg-violet-950/40',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    gradient: 'from-violet-600 to-indigo-600',
    icon: 'Code2',
    schedule: 'Mon & Wed • 4:00 PM'
  },
  {
    id: 'ai',
    name: 'AI',
    code: 'AI',
    description: 'Generative Models, Prompt Engineering & LLM Architecture',
    color: '#06b6d4', // Cyan
    bgLight: 'bg-cyan-950/40',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    gradient: 'from-cyan-600 to-blue-600',
    icon: 'Cpu',
    schedule: 'Tue & Thu • 5:00 PM'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    code: 'MKT',
    description: 'Growth Strategy, Brand Building & Digital Campaign Operations',
    color: '#f59e0b', // Amber
    bgLight: 'bg-amber-950/40',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    gradient: 'from-amber-600 to-orange-600',
    icon: 'TrendingUp',
    schedule: 'Wed & Fri • 3:30 PM'
  },
  {
    id: 'industry-connect',
    name: 'Industry Connect',
    code: 'IC',
    description: 'Corporate Mentorship, Executive Networking & Career Placement',
    color: '#10b981', // Emerald
    bgLight: 'bg-emerald-950/40',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-600',
    icon: 'Briefcase',
    schedule: 'Saturday • 10:00 AM'
  }
];

export const getBatchById = (id) => BATCHES.find(b => b.id === id) || BATCHES[0];
