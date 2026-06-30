import React, { useState, useEffect } from 'react';
import { 
  CommunityReport, 
  DevelopmentProject, 
  UserProfile, 
  AppNotification, 
  UserRole,
  ReportCategory,
  ReportStatus
} from './types';
import MockMap from './components/MockMap';
import AIChat from './components/AIChat';
import DashboardPortals from './components/DashboardPortals';
import ReportDetails from './components/ReportDetails';
import ReportForm from './components/ReportForm';
import { 
  Sparkles, 
  Bell, 
  MapPin, 
  AlertTriangle, 
  ListCollapse, 
  HeartHandshake, 
  HelpCircle, 
  Layers, 
  PhoneCall, 
  Building2,
  CheckCircle,
  X,
  Laptop,
  Smartphone,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
  Volume2
} from 'lucide-react';

export default function App() {
  // Application Data States
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // User Authentication / Sandbox Session Role
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-001',
    name: 'Winfred Luvai',
    email: 'winfredluvai@gmail.com',
    role: 'citizen',
    county: 'Nairobi',
    createdAt: new Date().toISOString()
  });

  // UI Presentation States
  const [activeTab, setActiveTab] = useState<'reports' | 'projects' | 'ai_assistant' | 'dashboards'>('reports');
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false); // Toggle mock phone container
  const [showNotifications, setShowNotifications] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // AI-Assisted Form Pre-fill
  const [preFillDraft, setPreFillDraft] = useState<{ title: string; category: ReportCategory; description: string } | null>(null);

  // Map/Form coordinate selection bridge
  const [isSelectingCoordinates, setIsSelectingCoordinates] = useState(false);
  const [selectedMapCoordinates, setSelectedMapCoordinates] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Load initial data from our full-stack Express backend
  const refreshData = async () => {
    try {
      const repRes = await fetch('/api/reports');
      if (repRes.ok) {
        const repData = await repRes.json();
        setReports(repData);
      }

      const projRes = await fetch('/api/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }

      const notifRes = await fetch(`/api/notifications/${currentUser.id}`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }
    } catch (err) {
      console.error('Error synchronizing with full-stack Express API:', err);
    }
  };

  useEffect(() => {
    refreshData();
    // Refresh periodically
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Handle changing user role sandbox-wide
  const handleChangeRole = async (role: UserRole, details?: any) => {
    try {
      let email = 'winfredluvai@gmail.com';
      let name = 'Winfred Luvai';
      
      if (role === 'agency') {
        email = 'support@nairobiwater.co.ke';
        name = 'NCWSC Engineer';
      } else if (role === 'ngo') {
        email = 'sarah.m@ngo-watch.org';
        name = 'Sarah Mwangi';
      } else if (role === 'admin') {
        email = 'admin@civiclink.ke';
        name = 'CivicLink Admin';
      }

      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          role,
          county: 'Nairobi',
          ...details
        })
      });

      if (response.ok) {
        const profile = await response.json();
        setCurrentUser(profile);
        // Clear active selections when switching contexts to avoid state leakage
        setSelectedReport(null);
        setSelectedProject(null);
        setShowReportForm(false);
      }
    } catch (err) {
      console.error('Error transitioning sandbox role:', err);
    }
  };

  // Submit a newly compiled report
  const handleSubmitReport = async (reportData: {
    title: string;
    category: ReportCategory;
    description: string;
    photoUrl?: string;
    videoUrl?: string;
    location: any;
  }) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportData,
          reporterId: currentUser.id,
          reporterName: currentUser.name,
          reporterEmail: currentUser.email,
          reporterRole: currentUser.role
        })
      });

      if (response.ok) {
        const newReport = await response.json();
        setReports(prev => [newReport, ...prev]);
        setShowReportForm(false);
        setPreFillDraft(null);
        setSelectedMapCoordinates(null);
        // Automatically highlight newly created report
        setSelectedReport(newReport);
        alert(`Excellent! Your community challenge "${newReport.title}" has been successfully logged, mapped, and assigned to administrators.`);
        refreshData();
      }
    } catch (err) {
      console.error('Error filing community report:', err);
    }
  };

  // Upvote / Like a report
  const handleLikeReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });

      if (response.ok) {
        const data = await response.json();
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, likes: data.likes } : r));
        // Update selected report view if open
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(prev => prev ? { ...prev, likes: data.likes } : null);
        }
      }
    } catch (err) {
      console.error('Error upvoting report:', err);
    }
  };

  // Add Comment on report
  const handleAddComment = async (reportId: string, commentText: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorEmail: currentUser.email,
          authorRole: currentUser.role,
          text: commentText
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setReports(prev => prev.map(r => {
          if (r.id === reportId) {
            return { ...r, comments: [...r.comments, newComment] };
          }
          return r;
        }));
        // Update selected report view
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
        }
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // Update report status (Agency/Admin)
  const handleUpdateReportStatus = async (reportId: string, status: ReportStatus, note: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          note,
          updatedBy: currentUser.role === 'agency' ? (currentUser.agencyName || 'Agency Crew') : 'System Administrator'
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setReports(prev => prev.map(r => r.id === reportId ? updated : r));
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updated);
        }
        refreshData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Allocate report to specific county agency (Admin)
  const handleAssignReport = async (reportId: string, agencyName: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyName,
          updatedBy: 'System Administrator'
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setReports(prev => prev.map(r => r.id === reportId ? updated : r));
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(updated);
        }
        refreshData();
      }
    } catch (err) {
      console.error('Error assigning parastatal agency:', err);
    }
  };

  // Create new development project (NGO/Donor/County)
  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const newProj = await response.json();
        setProjects(prev => [newProj, ...prev]);
        refreshData();
      }
    } catch (err) {
      console.error('Error registering project:', err);
    }
  };

  // Link reported challenge to development project
  const handleLinkReportToProject = async (projectId: string, reportId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/link-report`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId })
      });

      if (response.ok) {
        refreshData();
      }
    } catch (err) {
      console.error('Error linking report to project:', err);
    }
  };

  // Add Project Update milestone (NGO/Donor)
  const handleAddProjectUpdate = async (projectId: string, updateData: any) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        refreshData();
      }
    } catch (err) {
      console.error('Error posting project milestone:', err);
    }
  };

  // Launch report filing form pre-filled by AI Assistant
  const handlePreFillReport = (draft: { title: string; category: ReportCategory; description: string }) => {
    setPreFillDraft(draft);
    setShowReportForm(true);
    setActiveTab('reports');
  };

  // Handle map coordinate selection click back to form
  const handleSelectCoordinates = (lat: number, lng: number, address: string) => {
    setSelectedMapCoordinates({ lat, lng, address });
  };

  // In-app Notification Read
  const handleReadNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error reading notification:', err);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await fetch(`/api/notifications/${currentUser.id}/clear`, { method: 'POST' });
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  // Select Item triggers
  const handleSelectReport = (report: CommunityReport) => {
    setSelectedReport(report);
    setSelectedProject(null);
    setShowReportForm(false);
    setActiveTab('reports');
  };

  const handleSelectProject = (project: DevelopmentProject) => {
    setSelectedProject(project);
    setSelectedReport(null);
    setShowReportForm(false);
    setActiveTab('projects');
  };

  // Filtering reports
  const filteredReports = reports.filter(r => {
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.location.county.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-red-50 text-red-700 border-red-100';
      case 'under_review': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'assigned': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'in_progress': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  // App container render (allows switching layouts)
  const appContent = (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      
      {/* Platform Header Banner */}
      <header className="bg-white border-b border-slate-150 px-4 py-3 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-md">
            <Layers className="w-6 h-6 rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg tracking-tight text-slate-900 leading-none">CivicLink Kenya</h1>
              <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-sans">National Portal</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Connecting Communities. Inspiring Devolution Change.</p>
          </div>
        </div>

        {/* Header Right Interactions */}
        <div className="flex items-center gap-3">
          
          {/* Active Sandbox Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg py-1 px-2.5 border border-slate-150">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[10px] font-semibold text-slate-600">
              User: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-red text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-150 rounded-2xl shadow-xl z-50 p-3 space-y-2.5 animate-fade-in text-xs text-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    In-App Updates ({notifications.length})
                  </span>
                  {notifications.length > 0 && (
                    <button 
                      onClick={handleClearNotifications}
                      className="text-[10px] text-brand-red hover:underline font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center italic text-slate-400 py-4">No recent updates or challenge resolutions.</p>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => {
                          handleReadNotification(notif.id);
                          // Route if possible
                          const linkedRep = reports.find(r => r.id === notif.linkedId);
                          if (linkedRep) {
                            handleSelectReport(linkedRep);
                          }
                          setShowNotifications(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          notif.read 
                            ? 'bg-slate-50 border-slate-100 text-slate-500' 
                            : 'bg-emerald-50/50 border-emerald-100 text-slate-800 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <strong className="font-semibold block mb-0.5">{notif.title}</strong>
                          {!notif.read && <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0"></span>}
                        </div>
                        <p className="text-[10px] leading-tight text-slate-600">{notif.message}</p>
                        <span className="text-[8px] text-slate-400 block mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Toggle Mobile Mockup Canvas Frame button */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-600 hidden lg:block"
            title={isMobileFrame ? "Switch to Desktop Layout" : "Switch to Mobile Device Layout"}
          >
            {isMobileFrame ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Column Controls / Logs (Tabs, Lists, Forms) */}
        <div className="flex-1 md:w-1/2 flex flex-col border-r border-slate-150 overflow-hidden">
          
          {/* Main Navigation Subtabs */}
          <div className="bg-white border-b border-slate-100 px-4 py-2 shrink-0 flex items-center justify-between gap-1">
            <nav className="flex gap-1.5 text-xs">
              {[
                { id: 'reports', label: '💧 Challenges' },
                { id: 'projects', label: '🏗️ Projects' },
                { id: 'ai_assistant', label: '✨ AI Assistant' },
                { id: 'dashboards', label: '💼 Dashboards' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedReport(null);
                    setSelectedProject(null);
                    setShowReportForm(false);
                  }}
                  className={`py-2 px-3 rounded-xl font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-brand-green text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* File New Challenge trigger (Only shown if on reports and form not already open) */}
            {activeTab === 'reports' && !showReportForm && (
              <button
                onClick={() => {
                  setShowReportForm(true);
                  setSelectedReport(null);
                }}
                className="bg-brand-green hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer transition-all shrink-0"
              >
                + New Report
              </button>
            )}
          </div>

          {/* Core Area: Displays selected views or default list of selected tab */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
            
            {/* ACTION VIEW: Submission form */}
            {showReportForm ? (
              <ReportForm 
                userProfile={currentUser}
                preFilledDraft={preFillDraft}
                onSelectCoordinateMode={setIsSelectingCoordinates}
                selectedCoordinates={selectedMapCoordinates}
                onSubmitReport={handleSubmitReport}
                onCancel={() => { setShowReportForm(false); setPreFillDraft(null); }}
              />
            ) : selectedReport ? (
              /* ACTION VIEW: Single report detail presentation */
              <ReportDetails 
                report={selectedReport}
                userProfile={currentUser}
                projects={projects}
                onAddComment={handleAddComment}
                onLikeReport={handleLikeReport}
                onBackToList={() => setSelectedReport(null)}
              />
            ) : activeTab === 'reports' ? (
              /* TAB AREA: Challenges Board Lists */
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <h2 className="font-display font-bold text-lg text-slate-800 leading-tight">Community Challenge Feed</h2>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Showing {filteredReports.length} cases</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Review community infrastructure reports from across Kenya. Upvote urgent cases to prioritize resolution.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    placeholder="Search by keywords, county..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 text-xs rounded-xl p-2.5 outline-none focus:border-brand-green"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-200 text-xs rounded-xl p-2.5 outline-none cursor-pointer"
                  >
                    <option value="all">All Sectors</option>
                    <option value="water">💧 Water/Sanitation</option>
                    <option value="electricity">⚡ Electricity</option>
                    <option value="roads">🛣️ Roads/Highway</option>
                    <option value="infrastructure">🏥 Infrastructure</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>

                {/* Report Feed cards */}
                <div className="space-y-3.5">
                  {filteredReports.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-2xl bg-white space-y-1">
                      <p className="text-sm font-semibold text-slate-600">No community challenges found matching criteria.</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search queries.</p>
                    </div>
                  ) : (
                    filteredReports.map(rep => (
                      <div 
                        key={rep.id}
                        onClick={() => handleSelectReport(rep)}
                        className="bg-white rounded-xl border border-slate-150 p-4 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden"
                      >
                        {/* Sector color band */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                          rep.category === 'water' ? 'bg-blue-500' :
                          rep.category === 'electricity' ? 'bg-yellow-500' :
                          rep.category === 'roads' ? 'bg-orange-600' :
                          rep.category === 'infrastructure' ? 'bg-emerald-600' : 'bg-indigo-500'
                        }`}></div>

                        <div className="pl-2.5 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400">REP: {rep.id}</span>
                            <span className={`text-[10px] px-2 py-0.5 border rounded-full font-bold capitalize ${getStatusBadgeColor(rep.status)}`}>
                              {rep.status.replace('_', ' ')}
                            </span>
                          </div>

                          <h3 className="font-display font-semibold text-slate-800 text-sm leading-snug line-clamp-1">{rep.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{rep.description}</p>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {rep.location.county} County • {rep.location.address.split(',')[0]}
                            </span>
                            <div className="flex items-center gap-3 font-semibold text-slate-600">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3 text-slate-400" />
                                {rep.likes.length} Upvotes
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-slate-400" />
                                {rep.comments.length} Comments
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : activeTab === 'projects' ? (
              /* TAB AREA: Development Projects */
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <h2 className="font-display font-bold text-lg text-slate-800 leading-tight">Ongoing Development Projects</h2>
                  <p className="text-xs text-slate-500">
                    Track the execution of water drilling, energy grids, and highway upgrades funded by parastatals, development partners, and donors.
                  </p>
                </div>

                <div className="space-y-4">
                  {projects.map(proj => (
                    <div 
                      key={proj.id}
                      onClick={() => setSelectedProject(selectedProject?.id === proj.id ? null : proj)}
                      className="bg-white rounded-2xl border border-slate-150 p-4 hover:border-blue-500 transition-all cursor-pointer flex flex-col gap-3.5 shadow-2xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                            {proj.sector.toUpperCase()} Infrastructure
                          </span>
                          <h3 className="font-display font-bold text-slate-800 text-sm mt-1.5 leading-snug">{proj.title}</h3>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          {proj.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{proj.description}</p>

                      {/* Project Funding & County tags */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Funding</span>
                          <span className="font-bold text-slate-800">{proj.budget}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">County Location</span>
                          <span className="font-bold text-slate-800">{proj.county} County</span>
                        </div>
                      </div>

                      {/* Progress Gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500 font-semibold">Active Works Progress</span>
                          <span className="text-blue-700 font-bold">{proj.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-brand-blue h-full transition-all duration-300" style={{ width: `${proj.progress}%` }}></div>
                        </div>
                      </div>

                      {/* Expanded Project Milestones */}
                      {selectedProject?.id === proj.id && (
                        <div className="border-t border-slate-150 pt-3.5 mt-1 space-y-3.5 animate-fade-in text-xs">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Funded / Executed By</span>
                            <span className="font-semibold text-slate-800">{proj.fundedBy}</span>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Milestones & Technical Logs</span>
                            <div className="space-y-2.5 pl-3.5 border-l-1.5 border-blue-400">
                              {proj.updates.map((up, index) => (
                                <div key={up.id} className="relative space-y-0.5">
                                  <span className="absolute -left-[19.5px] top-1 w-2 h-2 rounded-full bg-blue-500"></span>
                                  <div className="flex justify-between text-[10px]">
                                    <strong className="text-slate-800">{up.title}</strong>
                                    <span className="text-slate-400 font-medium">{up.date}</span>
                                  </div>
                                  <p className="text-slate-600 text-[11px] leading-relaxed">{up.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {proj.reportsLinked.length > 0 && (
                            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 text-xs">
                              <span className="font-semibold text-blue-900 block mb-1">Sponsoring Linked Citizen Reports:</span>
                              <div className="space-y-1">
                                {proj.reportsLinked.map(repId => {
                                  const linkedRep = reports.find(r => r.id === repId);
                                  return (
                                    <div 
                                      key={repId}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (linkedRep) handleSelectReport(linkedRep);
                                      }}
                                      className="text-[10px] text-blue-800 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                                    >
                                      <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                      {linkedRep ? linkedRep.title : `Report ID: ${repId}`}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'ai_assistant' ? (
              /* TAB AREA: AI Assistant Chat */
              <AIChat 
                userProfile={currentUser}
                onPreFillReport={handlePreFillReport}
              />
            ) : (
              /* TAB AREA: Stakeholder Dashboard Portals */
              <DashboardPortals 
                reports={reports}
                projects={projects}
                userProfile={currentUser}
                onChangeRole={handleChangeRole}
                onUpdateReportStatus={handleUpdateReportStatus}
                onAssignReport={handleAssignReport}
                onCreateProject={handleCreateProject}
                onLinkReportToProject={handleLinkReportToProject}
                onAddProjectUpdate={handleAddProjectUpdate}
              />
            )}
          </div>
        </div>

        {/* Right Column (Dynamic GIS Map Overlay) */}
        <div className="hidden md:block md:w-1/2 p-4 md:p-5 h-full overflow-hidden flex flex-col bg-slate-50">
          <MockMap 
            reports={reports}
            projects={projects}
            onSelectReport={handleSelectReport}
            onSelectProject={handleSelectProject}
            onSelectCoordinates={handleSelectCoordinates}
            isSelectingLocation={isSelectingCoordinates}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-900 overflow-hidden flex items-center justify-center">
      {isMobileFrame ? (
        /* Mobile Device Frame Mockup */
        <div className="relative w-[385px] h-[780px] bg-slate-950 rounded-[45px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border-[10px] border-slate-800 flex flex-col overflow-hidden ring-4 ring-slate-900 animate-fade-in my-4">
          
          {/* Phone Speaker Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-800 rounded-b-xl z-50 flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
            <div className="w-12 h-1 bg-slate-950 rounded-full"></div>
          </div>
          
          {/* Custom micro speaker notification status bar */}
          <div className="h-6 shrink-0 bg-white/95 text-slate-800 text-[10px] font-semibold px-6 flex justify-between items-center z-40 border-b border-slate-100 select-none">
            <span>09:41 KES</span>
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Safaricom 5G</span>
              <span className="w-4 h-2.5 rounded-xs bg-slate-700 inline-block text-[8px] text-center text-white leading-none font-sans font-bold">100%</span>
            </div>
          </div>

          {/* Actual Viewport Content inside Frame */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {appContent}
          </div>

          {/* Phone Home Indicator bar */}
          <div className="h-4 bg-white border-t border-slate-100 flex items-center justify-center shrink-0 z-40 select-none">
            <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      ) : (
        /* Full Desktop Layout (Responsive Dashboard) */
        <div className="w-full h-full flex flex-col">
          {appContent}
        </div>
      )}
    </div>
  );
}
