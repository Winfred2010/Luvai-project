import React, { useState } from 'react';
import { SuccessStory } from '../types';
import { INITIAL_SUCCESS_STORIES } from '../data';
import { translations } from '../translations';
import { Award, Heart, MessageSquare, Plus, Sparkles, CheckCircle } from 'lucide-react';

interface SuccessSectionProps {
  language: 'en' | 'sw';
}

export default function SuccessSection({ language }: SuccessSectionProps) {
  const t = translations[language];
  const [stories] = useState<SuccessStory[]>(INITIAL_SUCCESS_STORIES);
  
  // Hope Board messages
  const [hopeNotes, setHopeNotes] = useState<{ id: string; author: string; content: string; date: string }[]>([
    { id: 'hn1', author: 'Winifred Luvai', content: 'You are so strong, Mama! Keep pushing, the universe is matching your courage.', date: '2026-06-29' },
    { id: 'hn2', author: 'Joyce Achieng', content: 'The soap-making course literally changed my household. I can now buy milk every single day!', date: '2026-06-30' },
  ]);
  const [newNoteAuthor, setNewNoteAuthor] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handlePostHopeNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteContent.trim()) {
      const note = {
        id: `hn_${Date.now()}`,
        author: newNoteAuthor || 'Anonymous Sister',
        content: newNoteContent,
        date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'sw-KE', {
          month: 'short',
          day: 'numeric',
        }),
      };

      setHopeNotes((prev) => [note, ...prev]);
      setNewNoteAuthor('');
      setNewNoteContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro header */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-purple-950 flex items-center gap-2">
          <Award className="w-5.5 h-5.5 text-purple-600 animate-bounce" />
          {t.successTitle}
        </h2>
        <p className="text-sm text-purple-900 mt-1 leading-relaxed">
          {t.successDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stories list */}
        <div className="lg:col-span-2 space-y-5">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
              <div className="w-full md:w-44 h-44 overflow-hidden rounded-xl bg-gray-50 shrink-0">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2 flex-1">
                <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold text-teal-700 bg-teal-50 rounded-full uppercase tracking-wider">
                  Independent Mother Graduate
                </span>
                <h3 className="font-extrabold text-gray-800 text-base leading-tight">
                  {story.name} — {language === 'en' ? story.titleEn : story.titleSw}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed pt-1">
                  {language === 'en' ? story.contentEn : story.contentSw}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 pt-2">
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span>Program outcome: Flourishing micro-enterprise!</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Board of Hope / Solidarity Messages */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Heart className="w-5 h-5 text-purple-600 fill-purple-600/10" />
              <span>Solidarity Hope Board</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">
              {t.inspirePrompt}
            </p>
          </div>

          {/* List of notes */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {hopeNotes.map((note) => (
              <div key={note.id} className="p-3 bg-gradient-to-tr from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100/30 text-xs space-y-1">
                <p className="text-purple-950 italic">"{note.content}"</p>
                <div className="flex justify-between text-[9px] font-bold text-purple-700 pt-1">
                  <span>- {note.author}</span>
                  <span className="text-gray-400 font-semibold">{note.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form to post Note */}
          <form onSubmit={handlePostHopeNote} className="space-y-3 pt-3 border-t border-gray-50">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Your Name / Alias
              </label>
              <input
                type="text"
                value={newNoteAuthor}
                onChange={(e) => setNewNoteAuthor(e.target.value)}
                placeholder="e.g. Anonymous Sister"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-5"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Message of Encouragement
              </label>
              <textarea
                required
                rows={3}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write a message of hope..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-5 resize-none"
              ></textarea>
            </div>
            <button
              id="btn-post-hope-note"
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Post on Hope Board</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
