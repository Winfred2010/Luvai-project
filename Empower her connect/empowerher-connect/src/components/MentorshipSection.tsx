import React, { useState } from 'react';
import { Mentor, UserRole } from '../types';
import { INITIAL_MENTORS } from '../data';
import { translations } from '../translations';
import { HeartHandshake, User, CheckCircle, Save, BookOpen, MessageSquare } from 'lucide-react';

interface MentorshipSectionProps {
  language: 'en' | 'sw';
}

export default function MentorshipSection({ language }: MentorshipSectionProps) {
  const t = translations[language];
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [activeMentorId, setActiveMentorId] = useState<string | null>(null);
  
  // Note notebook state
  const [notebooks, setNotebooks] = useState<Record<string, string[]>>({
    m1: ['Agreed to set a daily savings target of KES 100.', 'Set boundaries with ex-spouse.'],
  });
  const [newNote, setNewNote] = useState('');
  const [successMatch, setSuccessMatch] = useState<string | null>(null);

  const handleRequestMatch = (mentorId: string, mentorName: string) => {
    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          const alreadyMatched = m.matchingMothers.includes('mother_user_self');
          return {
            ...m,
            matchingMothers: alreadyMatched
              ? m.matchingMothers
              : [...m.matchingMothers, 'mother_user_self'],
          };
        }
        return m;
      })
    );

    setSuccessMatch(mentorName);
    setTimeout(() => {
      setSuccessMatch(null);
    }, 4500);
  };

  const handleAddNote = (e: React.FormEvent, mentorId: string) => {
    e.preventDefault();
    if (newNote.trim()) {
      setNotebooks((prev) => ({
        ...prev,
        [mentorId]: [...(prev[mentorId] || []), newNote],
      }));
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro box */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-rose-950 flex items-center gap-2">
          <HeartHandshake className="w-5.5 h-5.5 text-rose-600" />
          {t.mentorshipTitle}
        </h2>
        <p className="text-sm text-rose-900 mt-1 leading-relaxed">
          {t.mentorshipDesc}
        </p>
      </div>

      {successMatch && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-950 rounded-xl flex items-center gap-2.5 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <p className="text-xs font-semibold">
            {t.mentorSuccess} <strong>{successMatch}</strong>!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentors Directory list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-rose-600 pl-3">
            Available Professional Mentors
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((mentor) => {
              const isMatched = mentor.matchingMothers.includes('mother_user_self');
              const isNotebookOpen = activeMentorId === mentor.id;

              return (
                <div
                  key={mentor.id}
                  className={`bg-white rounded-2xl border p-5 flex flex-col justify-between hover:border-rose-200 transition-all duration-250 ${
                    isNotebookOpen ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-gray-100'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-full object-cover border border-rose-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm leading-tight">{mentor.name}</h4>
                        <p className="text-[10px] text-rose-600 font-semibold uppercase mt-0.5 leading-tight">
                          {language === 'en' ? mentor.specialtyEn : mentor.specialtySw}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {language === 'en' ? mentor.bioEn : mentor.bioSw}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-50 flex gap-2">
                    {isMatched ? (
                      <>
                        <div className="flex-1 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100 flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Matched ✓</span>
                        </div>
                        <button
                          onClick={() => setActiveMentorId(isNotebookOpen ? null : mentor.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Notes</span>
                        </button>
                      </>
                    ) : (
                      <button
                        id={`btn-match-${mentor.id}`}
                        onClick={() => handleRequestMatch(mentor.id, mentor.name)}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                      >
                        {t.requestMentor}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notebook / Chat with Paired Mentor */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 h-fit">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
              <MessageSquare className="w-5 h-5 text-rose-600" />
              <span>{t.startChat}</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              Private counseling journals
            </p>
          </div>

          {activeMentorId ? (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-950">
                Mentor: {mentors.find((m) => m.id === activeMentorId)?.name}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(notebooks[activeMentorId] || []).map((note, idx) => (
                  <div key={idx} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-[11px] leading-relaxed text-gray-700">
                    {note}
                  </div>
                ))}
                {(notebooks[activeMentorId] || []).length === 0 && (
                  <p className="text-[10px] text-gray-400 italic py-2">No notes saved in this session.</p>
                )}
              </div>

              <form onSubmit={(e) => handleAddNote(e, activeMentorId)} className="space-y-2">
                <textarea
                  required
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record goals, task lists, or advices..."
                  className="w-full text-xs p-2 border border-gray-200 rounded-lg resize-none"
                ></textarea>
                <button
                  id="btn-save-mentor-note"
                  type="submit"
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.submitNote}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-50 text-gray-400 text-xs rounded-xl italic">
              Click the "Notes" button on any matched mentor in your directory to open your counseling journal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
