import { UserRole } from '../types';
import { translations } from '../translations';
import { Shield, User, GraduationCap, Briefcase, HeartHandshake } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: 'en' | 'sw';
}

export default function RoleSwitcher({ currentRole, onRoleChange, language }: RoleSwitcherProps) {
  const t = translations[language];

  const roles: { role: UserRole; icon: any; color: string; bg: string }[] = [
    { role: 'mother', icon: User, color: 'text-purple-700 border-purple-200', bg: 'bg-purple-50' },
    { role: 'trainer', icon: GraduationCap, color: 'text-indigo-700 border-indigo-200', bg: 'bg-indigo-50' },
    { role: 'mentor', icon: HeartHandshake, color: 'text-rose-700 border-rose-200', bg: 'bg-rose-50' },
    { role: 'employer', icon: Briefcase, color: 'text-teal-700 border-teal-200', bg: 'bg-teal-50' },
    { role: 'admin', icon: Shield, color: 'text-amber-700 border-amber-200', bg: 'bg-amber-50' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {t.currentRole}
          </h3>
          <p className="text-lg font-bold text-gray-800 flex items-center gap-2 mt-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            {t.roles[currentRole]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-gray-500 mr-1">{t.changeRole}:</span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = currentRole === r.role;
            return (
              <button
                key={r.role}
                id={`role-btn-${r.role}`}
                onClick={() => onRoleChange(r.role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? `${r.bg} ${r.color} ring-2 ring-teal-600/20 shadow-xs scale-105`
                    : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.roles[r.role].split(' /')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
