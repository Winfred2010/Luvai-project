import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { translations } from '../translations';
import { Landmark, PiggyBank, PlusCircle, ArrowUpRight, CheckCircle, Info, Sparkles } from 'lucide-react';

interface FinancialSectionProps {
  language: 'en' | 'sw';
}

export default function FinancialSection({ language }: FinancialSectionProps) {
  const t = translations[language];
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: 'sg1', title: 'Manual Butterfly Sewing Machine', targetAmount: 12000, currentAmount: 4500, targetDate: '2026-09-30' },
    { id: 'sg2', title: "Children's School Term Fee", targetAmount: 25000, currentAmount: 18000, targetDate: '2026-08-30' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmt, setDepositAmt] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newTarget) {
      const newGoal: SavingsGoal = {
        id: `sg_${Date.now()}`,
        title: newTitle,
        targetAmount: Number(newTarget),
        currentAmount: 0,
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days
      };

      setGoals((prev) => [...prev, newGoal]);
      setNewTitle('');
      setNewTarget('');
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositGoalId && depositAmt) {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === depositGoalId) {
            const nextAmt = g.currentAmount + Number(depositAmt);
            return { ...g, currentAmount: nextAmt > g.targetAmount ? g.targetAmount : nextAmt };
          }
          return g;
        })
      );

      setSuccessMsg(true);
      setDepositAmt('');
      setDepositGoalId(null);
      setTimeout(() => {
        setSuccessMsg(false);
      }, 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro info box */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-teal-950 flex items-center gap-2">
          <Landmark className="w-5.5 h-5.5 text-teal-600" />
          {t.financialTitle}
        </h2>
        <p className="text-sm text-teal-900 mt-1 leading-relaxed">
          {t.financialDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Goal progress card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <PiggyBank className="w-5 h-5 text-teal-600" />
              {t.savingsCalculator}
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 bg-teal-50 border border-teal-200 text-teal-950 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>{t.savingSuccess}</span>
              </div>
            )}

            <div className="space-y-5">
              {goals.map((goal) => {
                const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);

                return (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-gray-800 text-xs leading-normal">{goal.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Target Date: {goal.targetDate}</p>
                      </div>
                      <span className="text-[11px] font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[10px] text-gray-500 font-medium">
                        KES {goal.currentAmount} / <span className="font-bold text-gray-700">KES {goal.targetAmount}</span>
                      </p>

                      <button
                        onClick={() => setDepositGoalId(goal.id)}
                        className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Deposit Cash</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Deposit form inline */}
                    {depositGoalId === goal.id && (
                      <form onSubmit={handleDeposit} className="mt-3 pt-3 border-t border-gray-100 flex gap-2 animate-fade-in">
                        <input
                          type="number"
                          required
                          value={depositAmt}
                          onChange={(e) => setDepositAmt(e.target.value)}
                          placeholder="Deposit amount (KES)"
                          className="flex-1 text-xs p-2 border border-gray-200 rounded-lg bg-white"
                        />
                        <button
                          id="btn-execute-deposit"
                          type="submit"
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Confirm
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chama Table banking detailed guidelines */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>{t.chamaInfoTitle}</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t.chamaInfoText}
            </p>
            <div className="p-3.5 bg-purple-50 text-purple-950 rounded-xl text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                {language === 'sw'
                  ? 'TAHADHARI: Jihadhari na mikopo ya mtandaoni yenye riba kubwa sana isiyo na leseni. Chagua Chama zilizoandikishwa katika kitengo cha kijamii (social services).'
                  : 'WARNING: Beware of unlicensed digital loan applications with predatory interest rates. Stick to family table-banking or registered community SACCO circles.'}
              </p>
            </div>
          </div>
        </div>

        {/* Set Savings goal form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 h-fit">
          <h3 className="font-bold text-gray-900 flex items-center gap-1.5 mb-4">
            <PlusCircle className="w-5 h-5 text-teal-600" />
            <span>Create Goal</span>
          </h3>

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.savingsGoalName}</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Baking Oven Kit"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.savingsTargetAmt}</label>
              <input
                type="number"
                required
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <button
              id="btn-create-savings-goal"
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition"
            >
              {t.createGoalButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
