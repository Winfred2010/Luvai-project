import React, { useState } from 'react';
import { CommunityReport, Comment, UserProfile, DevelopmentProject } from '../types';
import { 
  ThumbsUp, 
  MessageSquare, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Send, 
  ChevronRight, 
  Link2, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

interface ReportDetailsProps {
  report: CommunityReport;
  userProfile: UserProfile;
  projects: DevelopmentProject[];
  onAddComment: (reportId: string, commentText: string) => void;
  onLikeReport: (reportId: string) => void;
  onBackToList: () => void;
}

export default function ReportDetails({
  report,
  userProfile,
  projects,
  onAddComment,
  onLikeReport,
  onBackToList
}: ReportDetailsProps) {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(report.id, commentText);
    setCommentText('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'water': return '💧 Lack of Clean Water / Sewage Leak';
      case 'electricity': return '⚡ Lack of Electricity / Power Grid Grid';
      case 'roads': return '🛣️ Poor Roads / Potholes';
      case 'infrastructure': return '🏥 Damaged Infrastructure / Public Facilities';
      case 'health': return '🏥 Clinic & Health access';
      default: return '📋 Other Public Service challenge';
    }
  };

  // Find linked development project if any
  const linkedProject = projects.find(p => p.id === report.linkedProjectId);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Back Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
        <button 
          onClick={onBackToList}
          className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Reports
        </button>
        <span className="text-[11px] font-mono font-semibold text-slate-400">
          REP ID: {report.id}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
        {/* Title and Category */}
        <div>
          <span className="text-xs font-semibold text-brand-green bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-150 inline-block mb-2">
            {getCategoryLabel(report.category)}
          </span>
          <h3 className="font-display font-bold text-xl text-slate-800 tracking-tight leading-snug">
            {report.title}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">{report.location.address}</span>, {report.location.county} county
          </p>
        </div>

        {/* Status and Upvotes Bar */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Current Resolution Status</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border inline-block capitalize ${getStatusBadge(report.status)}`}>
              {report.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Upvoted by Citizens</span>
            <button 
              onClick={() => onLikeReport(report.id)}
              className={`text-xs px-3 py-1 rounded-full border font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                report.likes.includes(userProfile.id)
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs hover:bg-emerald-700'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{report.likes.length} Upvote{report.likes.length !== 1 ? 's' : ''}</span>
            </button>
          </div>
        </div>

        {/* Report Photo if available */}
        {report.photoUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-3xs max-h-[220px]">
            <img 
              src={report.photoUrl} 
              alt="Challenge Report File" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Description</h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/40 p-3 rounded-xl border border-slate-100">
            {report.description}
          </p>
        </div>

        {/* Reporter info */}
        <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Reported by: <strong className="text-slate-700 font-medium">{report.reporterName}</strong> ({report.reporterRole})
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Submitted: <strong className="text-slate-700 font-medium">{new Date(report.createdAt).toLocaleDateString()}</strong>
          </span>
        </div>

        {/* Linked Active Project Panel */}
        {linkedProject && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-blue-800 font-semibold text-xs">
              <Link2 className="w-4 h-4 text-blue-600" />
              Sponsorship Development Project Linked!
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-800">{linkedProject.title}</h5>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1">{linkedProject.description}</p>
            </div>
            
            {/* Progress indicator */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-semibold">Works Progress</span>
                <span className="text-blue-700 font-bold">{linkedProject.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${linkedProject.progress}%` }}></div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1 justify-between">
              <span>Funded by: <strong className="text-slate-700">{linkedProject.fundedBy}</strong></span>
              <span className="flex items-center gap-0.5 text-blue-700 font-medium">
                Active Sponsorship
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* Status Timeline History */}
        <div className="space-y-2.5 pt-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification & Action Timeline</h4>
          <div className="space-y-3.5 pl-3 border-l-1.5 border-slate-200">
            {report.statusHistory.map((history, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Timeline node */}
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border border-white ring-4 ring-white"></span>
                {idx === report.statusHistory.length - 1 && (
                  <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white ring-4 ring-white animate-ping"></span>
                )}
                
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-slate-800 capitalize bg-slate-100 px-1.5 py-0.2 rounded-md">
                    {history.status.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 font-medium">•</span>
                  <span className="text-slate-400 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(history.updatedAt).toLocaleDateString()} {new Date(history.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{history.note}</p>
                <div className="text-[9px] text-slate-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified update by: {history.updatedBy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public In-App Discussion Comments */}
        <div className="space-y-3 border-t border-slate-150 pt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            Public Discussion & Official Response ({report.comments.length})
          </h4>

          {/* Comment list */}
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {report.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl">No discussion comments yet. Be the first to inquire!</p>
            ) : (
              report.comments.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-800">{c.authorName}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans font-semibold capitalize ${
                        c.authorRole === 'agency' 
                          ? 'bg-blue-100 text-blue-800' 
                          : c.authorRole === 'ngo' 
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {c.authorRole}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Inquire or contribute to this public challenge..."
              className="flex-1 bg-slate-50 border border-slate-250 text-xs rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-brand-green transition-all"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="bg-brand-green hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
