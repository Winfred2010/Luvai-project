import React from 'react';
import { 
  Boxes, 
  LayoutDashboard, 
  Tag, 
  Users, 
  ArrowUpDown, 
  ShoppingBag, 
  BarChart3, 
  Bell, 
  MapPin, 
  UserCheck,
  ChevronRight,
  Sparkles,
  Globe
} from 'lucide-react';
import { User, UserRole } from '../types';
import { useSettings } from '../context/SettingsContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  usersList: User[];
  currentBranch: string;
  setCurrentBranch: (branch: string) => void;
  branches: string[];
  lowStockCount: number;
  expiringCount: number;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  usersList,
  currentBranch,
  setCurrentBranch,
  branches,
  lowStockCount,
  expiringCount
}: SidebarProps) {
  const { t, language, setLanguage } = useSettings();

  const menuItems = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER, UserRole.STAFF] },
    { id: 'products', name: t('nav.products'), icon: Boxes, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER, UserRole.STAFF] },
    { id: 'suppliers', name: t('nav.suppliers'), icon: Users, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER] },
    { id: 'stock-adjust', name: t('nav.stock'), icon: ArrowUpDown, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER, UserRole.STAFF] },
    { id: 'sales', name: t('nav.sales'), icon: ShoppingBag, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER, UserRole.STAFF] },
    { id: 'reports', name: t('nav.reports'), icon: BarChart3, roles: [UserRole.ADMIN, UserRole.STORE_MANAGER] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case UserRole.STORE_MANAGER: return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case UserRole.STAFF: return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <aside id="sidebar-container" className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-[#1e2040] bg-[#0c0d21] text-slate-300 lg:static lg:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-[#1e2040] gap-2.5 bg-[#080918]">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/25">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-sans font-bold tracking-tight text-white text-base leading-none">StockMaster</h1>
          <span className="text-[9px] font-mono font-semibold tracking-widest text-[#6366f1] block mt-0.5">INVENTORY CORE</span>
        </div>
      </div>

      {/* Language Toggle Dropdown with Country Flags */}
      <div className="px-5 py-4 border-b border-[#1e2040] bg-[#080918]/30">
        <label className="block text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase mb-1.5 flex items-center gap-1.5">
          <Globe className="h-3 w-3 text-indigo-400" /> {t('gen.lang')}
        </label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full text-xs font-sans font-medium text-slate-100 bg-[#161835] border border-[#27284d] rounded-md py-1.5 px-2 bg-no-repeat cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-505"
          >
            <option value="en" className="bg-[#0c0d21] text-slate-100">🇬🇧 English</option>
            <option value="sw" className="bg-[#0c0d21] text-slate-100">🇰🇪 Swahili (Kiswahili)</option>
            <option value="fr" className="bg-[#0c0d21] text-slate-100">🇫🇷 French (Français)</option>
            <option value="es" className="bg-[#0c0d21] text-slate-100">🇪🇸 Spanish (Español)</option>
            <option value="hi" className="bg-[#0c0d21] text-slate-100">🇮🇳 Hindi (हिन्दी)</option>
            <option value="zh" className="bg-[#0c0d21] text-slate-100">🇨🇳 Chinese (中文)</option>
            <option value="pt" className="bg-[#0c0d21] text-slate-100">🇵🇹 Portuguese (Português)</option>
          </select>
        </div>
      </div>

      {/* Controller Controls Segment: Branch Selector */}
      <div className="px-5 py-4 border-b border-[#1e2040] bg-[#080918]/60">
        <label className="block text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase mb-1.5 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {t('nav.selectedBranch')}
        </label>
        <select
          value={currentBranch}
          onChange={(e) => setCurrentBranch(e.target.value)}
          className="w-full text-xs font-sans font-medium text-slate-100 bg-[#161835] border border-[#27284d] rounded-md py-1.5 px-2 bg-no-repeat cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-505"
        >
          {branches.map(branch => (
            <option key={branch} value={branch} className="bg-[#0c0d21] text-slate-100">
              {branch === 'ALL' ? t('gen.all') : branch}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 space-y-1.5 px-4 py-4 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-xs font-sans font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-650/15 border-l-4 border-indigo-400'
                  : 'text-slate-400 hover:bg-[#161835]/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.id === 'dashboard' && (lowStockCount > 0 || expiringCount > 0) && (
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-indigo-950 animate-pulse" />
                )}
                {item.id === 'products' && lowStockCount > 0 && (
                  <span className="rounded bg-rose-500/25 px-1.5 py-0.5 text-[9px] font-mono font-bold text-rose-450 border border-rose-500/30">{lowStockCount}</span>
                )}
                <ChevronRight className={`h-3 w-3 opacity-60 ${isActive ? 'text-white/70' : 'text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Simulator Portal: Active User Persona Switcher */}
      <div className="mt-auto border-t border-[#1e2040] bg-[#080918]/60 p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-1">
            <UserCheck className="h-3 w-3" /> {t('nav.testingPersona')}
          </label>
          <span className="flex items-center gap-0.5 text-[9px] font-sans font-semibold text-[#818cf8]">
            <Sparkles className="h-2.5 w-2.5" /> {t('nav.simulator')}
          </span>
        </div>
        
        {/* Dropdown with active user role display */}
        <select
          value={currentUser.id}
          onChange={(e) => {
            const index = usersList.findIndex(u => u.id === e.target.value);
            if (index > -1) {
              setCurrentUser(usersList[index]);
            }
          }}
          className="w-full text-xs font-sans font-medium text-slate-100 bg-[#161835] border border-[#27284d] rounded-md py-1.5 px-2 bg-no-repeat cursor-pointer focus:outline-none mb-3"
        >
          {usersList.map((usr) => (
            <option key={usr.id} value={usr.id} className="bg-[#0c0d21] text-slate-100">{usr.name} ({usr.role.replace('_', ' ').toUpperCase()})</option>
          ))}
        </select>

        {/* Identity Signature Card */}
        <div className="border border-[#1e2040] rounded-md bg-[#12142d] p-3 flex flex-col gap-1 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-semibold text-slate-100 leading-tight block truncate max-w-[130px]">{currentUser.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border uppercase ${getRoleBadgeColor(currentUser.role)}`}>
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#a5b4fc] block truncate leading-tight">{currentUser.email}</span>
        </div>
      </div>
    </aside>
  );
}
