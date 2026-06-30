import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ReportCategory } from '../types';
import { Send, Sparkles, BrainCircuit, User, ArrowRight, CornerDownRight, Loader2, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIChatProps {
  userProfile: UserProfile;
  onPreFillReport: (draft: { title: string; category: ReportCategory; description: string }) => void;
}

export default function AIChat({ userProfile, onPreFillReport }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Habari, **${userProfile.name}**! I am your **CivicLink Kenya AI Assistant** 🇰🇪.\n\nI can help you:
- **Draft a challenge report** (like water leakage, electricity failure, or dangerous potholes) and assign the right county department or parastatal.
- **Answer questions** about devolution, county functions, KeNHA, KURA, and Kenya Power (KPLC).
- **Find appropriate contacts** for civic matters.\n\nWhat challenge is your community facing today? Tell me, and I will help you formulate a clean report!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'How do I report a burst water main in Nairobi?',
    'Who is responsible for neighborhood roads?',
    'Explain the role of KPLC vs REA'
  ]);

  // Track if AI has extracted a potential draft report from conversation
  const [extractedDraft, setExtractedDraft] = useState<{ title: string; category: ReportCategory; description: string } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Attempt to scan the chat messages to see if we can extract a report draft
  useEffect(() => {
    const userMsgs = messages.filter(m => m.role === 'user');
    if (userMsgs.length > 0) {
      const lastUserMsg = userMsgs[userMsgs.length - 1].text.toLowerCase();
      
      let category: ReportCategory | null = null;
      let title = "";
      let description = lastUserMsg;

      if (lastUserMsg.includes('water') || lastUserMsg.includes('pipe') || lastUserMsg.includes('sewer') || lastUserMsg.includes('leak')) {
        category = 'water';
        title = 'Community Water / Sewerage Infrastructure Issue';
      } else if (lastUserMsg.includes('power') || lastUserMsg.includes('electricity') || lastUserMsg.includes('kplc') || lastUserMsg.includes('transformer') || lastUserMsg.includes('blackout')) {
        category = 'electricity';
        title = 'Power Grid or Electrical Grid Failure';
      } else if (lastUserMsg.includes('road') || lastUserMsg.includes('pothole') || lastUserMsg.includes('highway') || lastUserMsg.includes('street')) {
        category = 'roads';
        title = 'Damaged Road Surface / Pothole Hazard';
      } else if (lastUserMsg.includes('drain') || lastUserMsg.includes('flood') || lastUserMsg.includes('bridge') || lastUserMsg.includes('clinic')) {
        category = 'infrastructure';
        title = 'Public Facility Drainage & Flooding';
      }

      if (category && lastUserMsg.length > 25) {
        // Capitalize first letters of description for title
        const cleanDesc = lastUserMsg.charAt(0).toUpperCase() + lastUserMsg.slice(1);
        setExtractedDraft({
          title: title,
          category: category,
          description: cleanDesc
        });
      }
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, text: m.text })),
          userProfile,
          currentReportDraft: extractedDraft
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reply from Express API');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Error talking to CivicLink Assistant API:', err);
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **System Error**: I had trouble connecting to the Gemini server. Let's try again in a moment! Make sure your internet connection and API keys are functioning.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: `Habari, **${userProfile.name}**! Chat history cleared. What county challenge or civic query can I support you with now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setExtractedDraft(null);
    setSuggestions([
      'How do I report a burst water main in Nairobi?',
      'Who is responsible for neighborhood roads?',
      'Explain the role of KPLC vs REA'
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              CivicLink AI Assistant
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-sans font-medium">Gemini 3.5</span>
            </div>
            <p className="text-[11px] text-emerald-700/80">County Agencies & Parastatal Guiding Agent</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          title="Clear Conversation"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-4 h-4" />
              </div>
            )}
            
            <div className="max-w-[85%] flex flex-col">
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-brand-blue text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none whitespace-pre-wrap'
              }`}>
                {/* Parse very basic markdown for presentation */}
                {msg.text.split('\n').map((line, i) => {
                  let renderedLine: React.ReactNode = line;
                  
                  // Check for headers
                  if (line.startsWith('### ')) {
                    renderedLine = <h4 className="font-bold text-slate-800 mt-2 mb-1">{line.replace('### ', '')}</h4>;
                  } else if (line.startsWith('## ')) {
                    renderedLine = <h3 className="font-bold text-slate-800 mt-3 mb-1">{line.replace('## ', '')}</h3>;
                  }
                  // Check for bold matches **text**
                  else if (line.includes('**')) {
                    const parts = line.split('**');
                    renderedLine = (
                      <span>
                        {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className={msg.role === 'user' ? 'text-white font-bold' : 'text-slate-900 font-semibold'}>{p}</strong> : p)}
                      </span>
                    );
                  }
                  // Check for bullet list
                  if (line.trim().startsWith('- ')) {
                    return (
                      <div key={i} className="flex gap-1.5 ml-2 mt-1">
                        <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{renderedLine}</span>
                      </div>
                    );
                  }

                  return <p key={i} className="min-h-[1.2em]">{renderedLine}</p>;
                })}
              </div>
              <span className={`text-[9px] text-slate-400 mt-1 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 animate-spin">
              <Loader2 className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-500 rounded-tl-none flex items-center gap-1.5">
              <span>Assistant is analyzing devolution policies and contacts...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Draft Generator Overlay */}
      {extractedDraft && (
        <div className="mx-4 mb-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex-1">
            <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              CivicLink AI Report Draft Prepared!
            </div>
            <p className="text-[10px] text-emerald-700 font-medium line-clamp-1">
              {extractedDraft.title}: "{extractedDraft.description}"
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              onPreFillReport(extractedDraft);
              setExtractedDraft(null); // Clear draft after loading
            }}
            className="bg-brand-green hover:bg-emerald-700 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
          >
            Submit Report
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Suggestion Quick Clicks */}
      <div className="px-4 py-2 border-t border-slate-100 flex gap-1.5 overflow-x-auto whitespace-nowrap bg-slate-50/50">
        {suggestions.map((sug, idx) => (
          <button 
            key={idx}
            type="button"
            onClick={() => handleSendMessage(sug)}
            className="bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-2xs transition-all shrink-0 cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 border-t border-slate-100 flex gap-2"
      >
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about parastatals, water systems, roads..."
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-brand-green focus:bg-white text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-400"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-brand-green disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-emerald-700 text-white rounded-xl p-2.5 shadow-sm transition-all cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
