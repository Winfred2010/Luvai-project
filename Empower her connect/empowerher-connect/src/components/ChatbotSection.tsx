import { useState, useRef, useEffect } from 'react';
import { translations } from '../translations';
import { Send, Sparkles, MessageSquare, AlertCircle, Bot, User } from 'lucide-react';

interface ChatbotSectionProps {
  language: 'en' | 'sw';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotSection({ language }: ChatbotSectionProps) {
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        language === 'sw'
          ? "Habari, mimi ni Msaidizi wa EmpowerHer wa AI. Unaweza kuniuliza kuhusu haki zako za kisheria, kuandaa CV, mawazo ya biashara ndogo, au kozi zinazofaa kwa uzoefu wako. Nitakusaidia kwa furaha!"
          : "Hello, I am your EmpowerHer AI Companion. Feel free to ask me about your legal rights, draft a professional resume/CV, suggest micro-business ideas, or find vocational courses that match your interests. I am here for you!",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);
    setInputText('');
    
    const userMsg: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          language: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error communicating with Gemini');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please confirm your API key is in the secrets panel.');
    } finally {
      setLoading(false);
    }
  };

  const starterChips = language === 'sw'
    ? [
        "Niandikie muhtasari wa CV ya kulelea watoto (Caregiving CV)",
        "Haki zangu ni zipi ikiwa mume alinitupa na mtoto?",
        "Ninahitaji mawazo ya biashara ndogo ya kuoka nyumbani",
        "Eleza jinsi ya kuanza kikundi cha Chama cha akiba"
      ]
    : [
        "Draft a caregiver CV outline for me",
        "What are my child custody rights if abandoned?",
        "Give me 5 micro-business ideas for home baking",
        "Explain how to start a safe table-banking Chama"
      ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4 max-w-4xl mx-auto flex flex-col h-[600px] justify-between">
      {/* Console Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-xs">
          <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
        </div>
        <div>
          <h3 className="font-extrabold text-gray-800 text-base flex items-center gap-1.5">
            <span>{t.aiTitle}</span>
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[8px] font-black uppercase rounded-sm">
              SERVER-SIDE ADVANCED
            </span>
          </h3>
          <p className="text-[11px] text-gray-500 leading-normal">{t.aiDesc}</p>
        </div>
      </div>

      {/* Bubble messages container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
        {messages.map((m, idx) => {
          const isAI = m.role === 'assistant';
          return (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${isAI ? '' : 'ml-auto flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                isAI ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
              }`}>
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
              <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                isAI 
                  ? 'bg-purple-50 text-purple-950 border border-purple-100/30' 
                  : 'bg-teal-600 text-white rounded-tr-none'
              }`}>
                {/* Preformatted blocks for code/outlines if any */}
                <p className="whitespace-pre-line font-medium">{m.content}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-500" />
            </div>
            <div className="p-4 bg-purple-50 text-purple-950 rounded-2xl text-xs border border-purple-100/30">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                {t.aiThinking}
              </span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-950 rounded-xl text-xs flex items-start gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Starter Chips */}
      {messages.length === 1 && (
        <div className="space-y-1.5 shrink-0 pt-2 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Suggested Queries</p>
          <div className="flex flex-wrap gap-1.5">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-100 hover:bg-purple-50 hover:border-purple-200 text-left text-[10px] font-bold text-gray-700 hover:text-purple-900 rounded-lg transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input console */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="flex gap-2 pt-2 border-t border-gray-50 shrink-0"
      >
        <input
          type="text"
          required
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.aiPlaceholder}
          className="flex-1 text-xs px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
        />
        <button
          id="btn-send-ai-message"
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>{t.send}</span>
        </button>
      </form>
    </div>
  );
}
