import React, { useState } from 'react';
import { 
  CommunityReport, 
  DevelopmentProject, 
  UserProfile, 
  UserRole, 
  ReportStatus, 
  ProjectSector, 
  ProjectStatus 
} from '../types';
import { 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  PlusCircle, 
  Link2, 
  TrendingUp, 
  Coins, 
  AlertCircle, 
  Building2, 
  HeartHandshake, 
  UserPlus, 
  MessageSquare,
  Sparkles,
  MapPin
} from 'lucide-react';

interface DashboardPortalsProps {
  reports: CommunityReport[];
  projects: DevelopmentProject[];
  userProfile: UserProfile;
  onChangeRole: (role: UserRole, details?: any) => void;
  onUpdateReportStatus: (id: string, status: ReportStatus, note: string) => void;
  onAssignReport: (id: string, agencyName: string) => void;
  onCreateProject: (projectData: any) => void;
  onLinkReportToProject: (projectId: string, reportId: string) => void;
  onAddProjectUpdate: (projectId: string, updateData: any) => void;
}

export default function DashboardPortals({
  reports,
  projects,
  userProfile,
  onChangeRole,
  onUpdateReportStatus,
  onAssignReport,
  onCreateProject,
  onLinkReportToProject,
  onAddProjectUpdate
}: DashboardPortalsProps) {
  
  // Tab within the dashboards
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'actions' | 'create_project'>('overview');
  
  // Local form states
  const [statusNote, setStatusNote] = useState('');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [assignAgency, setAssignAgency] = useState('Nairobi Water and Sewerage Company (NCWSC)');
  
  // New project states
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCounty, setNewProjCounty] = useState('Nairobi');
  const [newProjBudget, setNewProjBudget] = useState('KES 5,000,000');
  const [newProjSector, setNewProjSector] = useState<ProjectSector>('water');
  const [newProjDonor, setNewProjDonor] = useState('');

  // Project update states
  const [updateProjId, setUpdateProjId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDesc, setUpdateDesc] = useState('');
  const [updateProgress, setUpdateProgress] = useState(20);
  const [updateStatus, setUpdateStatus] = useState<ProjectStatus>('ongoing');

  // Submit report assignment
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId) return;
    onAssignReport(selectedReportId, assignAgency);
    alert(`Successfully assigned challenge to ${assignAgency}`);
    setSelectedReportId('');
  };

  // Submit report status update
  const handleStatusUpdateSubmit = (reportId: string, newStatus: ReportStatus) => {
    if (!statusNote.trim()) {
      alert("Please provide a brief technical note regarding this status update.");
      return;
    }
    const updaterName = userProfile.role === 'agency' ? (userProfile.agencyName || 'Agency Crew') : 'System Administrator';
    onUpdateReportStatus(reportId, newStatus, statusNote);
    alert(`Report status successfully updated to ${newStatus.replace('_', ' ')}!`);
    setStatusNote('');
  };

  // Submit project creation
  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjDesc || !newProjDonor) {
      alert("Please fill in all required fields.");
      return;
    }

    // Default coordinates based on County
    let lat = -1.2921, lng = 36.8219;
    if (newProjCounty === 'Mombasa') { lat = -4.0435; lng = 39.6682; }
    else if (newProjCounty === 'Kisumu') { lat = -0.1022; lng = 34.7617; }
    else if (newProjCounty === 'Nakuru') { lat = -0.3031; lng = 36.0800; }
    else if (newProjCounty === 'Eldoret') { lat = 0.5143; lng = 35.2698; }
    else if (newProjCounty === 'Machakos') { lat = -1.5177; lng = 37.2634; }
    else if (newProjCounty === 'Kitui') { lat = -1.3750; lng = 38.0167; }
    else if (newProjCounty === 'Makueni') { lat = -1.8041; lng = 37.6291; }

    onCreateProject({
      title: newProjTitle,
      description: newProjDesc,
      county: newProjCounty,
      budget: newProjBudget,
      sector: newProjSector,
      fundedBy: newProjDonor,
      location: { lat, lng }
    });

    alert(`Development Project "${newProjTitle}" successfully registered and mapped!`);
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjDonor('');
    setActiveSubTab('overview');
  };

  // Link report to project
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedReportId) {
      alert("Please select both a Development Project and a community report.");
      return;
    }
    onLinkReportToProject(selectedProjectId, selectedReportId);
    alert("Community challenge linked to project. Construction crew notified!");
    setSelectedProjectId('');
    setSelectedReportId('');
  };

  // Submit project updates
  const handleProjectUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateProjId || !updateTitle || !updateDesc) {
      alert("All update fields are required.");
      return;
    }
    onAddProjectUpdate(updateProjId, {
      title: updateTitle,
      description: updateDesc,
      progress: Number(updateProgress),
      status: updateStatus
    });
    alert("Project progress update published successfully!");
    setUpdateProjId('');
    setUpdateTitle('');
    setUpdateDesc('');
  };

  // Filter lists based on role
  const assignedAgencyReports = reports.filter(r => r.assignedTo?.agencyName === userProfile.agencyName);
  const unassignedReports = reports.filter(r => r.status === 'reported' || r.status === 'under_review');
  const linkableReports = reports.filter(r => !r.linkedProjectId);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col gap-6">
      
      {/* Switch Stakeholder Quick Bar */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">CivicLink Sandbox Simulation Role Switcher</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onChangeRole('citizen')}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              userProfile.role === 'citizen'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Citizen
          </button>
          
          <button
            type="button"
            onClick={() => onChangeRole('agency', { agencyName: 'Nairobi Water and Sewerage Company (NCWSC)' })}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              userProfile.role === 'agency'
                ? 'bg-brand-blue text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Agency (NCWSC)
          </button>

          <button
            type="button"
            onClick={() => onChangeRole('ngo', { ngoName: 'Kenya Development Watch NGO' })}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              userProfile.role === 'ngo'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            NGO / Donor
          </button>

          <button
            type="button"
            onClick={() => onChangeRole('admin')}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              userProfile.role === 'admin'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin Panel
          </button>
        </div>
      </div>

      {/* PORTAL CONTENT: CITIZEN */}
      {userProfile.role === 'citizen' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h4 className="font-display font-bold text-slate-800">Citizen Reporting Hub</h4>
              <p className="text-xs text-slate-500">Submit, track, upvote issues, and comment on resolutions.</p>
            </div>
          </div>
          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 text-sm space-y-2">
            <h5 className="font-semibold text-emerald-800">Your Devolution Rights under Kenya 2010 Constitution:</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens have a constitutional right to public participation and access to basic services (water, safety, health). CivicLink Kenya allows you to log challenges directly, bypass county bureaucratic delays, and get parastatal or NGO sponsorships for community relief.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-3xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Your Filed Challenges</span>
              <div className="text-2xl font-bold text-slate-800">
                {reports.filter(r => r.reporterEmail === userProfile.email).length}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Issues verified and mapped inside Kenya's parastatal systems</p>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-3xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Supported Community Initiatives</span>
              <div className="text-2xl font-bold text-brand-blue">
                {reports.filter(r => r.likes.includes(userProfile.id || 'current')).length}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Local issues you have upvoted to push higher on county priority list</p>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL CONTENT: GOVERNMENT AGENCY */}
      {userProfile.role === 'agency' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-brand-blue" />
            <div>
              <h4 className="font-display font-bold text-slate-800">Government Agency Portal</h4>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                {userProfile.agencyName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-slate-100 rounded-lg p-3 text-center bg-slate-50">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Assigned</span>
              <span className="text-xl font-bold text-slate-800">{assignedAgencyReports.length}</span>
            </div>
            <div className="border border-slate-100 rounded-lg p-3 text-center bg-yellow-50/50">
              <span className="text-[10px] font-semibold text-yellow-700 uppercase block">In Progress</span>
              <span className="text-xl font-bold text-yellow-600">
                {assignedAgencyReports.filter(r => r.status === 'in_progress').length}
              </span>
            </div>
            <div className="border border-slate-100 rounded-lg p-3 text-center bg-emerald-50/50">
              <span className="text-[10px] font-semibold text-emerald-700 uppercase block">Resolved</span>
              <span className="text-xl font-bold text-emerald-600">
                {assignedAgencyReports.filter(r => r.status === 'resolved').length}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Task Actions</h5>
            
            {assignedAgencyReports.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center border border-dashed rounded-lg">No active challenges assigned to your agency at this time.</p>
            ) : (
              <div className="space-y-3">
                {assignedAgencyReports.map(rep => (
                  <div key={rep.id} className="border border-slate-150 rounded-xl p-3.5 space-y-3 bg-white">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-medium text-slate-600 mb-1 inline-block">
                          ID: {rep.id}
                        </span>
                        <h6 className="font-semibold text-sm text-slate-800">{rep.title}</h6>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {rep.location.address}, {rep.location.county}
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize bg-yellow-100 text-yellow-800">
                        {rep.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase">
                        Publish Technical Status / Action Updates
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Repairs scheduled, Crew sent with equipment, water valve shut off..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none focus:border-brand-blue"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusUpdateSubmit(rep.id, 'in_progress')}
                          className="bg-brand-blue hover:bg-blue-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-md cursor-pointer"
                        >
                          Mark: Crew Dispatch / In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdateSubmit(rep.id, 'resolved')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-md cursor-pointer"
                        >
                          Mark: Fully Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PORTAL CONTENT: NGO / DONOR */}
      {userProfile.role === 'ngo' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HeartHandshake className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-display font-bold text-slate-800">NGO & Development Partner Hub</h4>
              <p className="text-xs text-slate-500">Fund boreholes, grid components, highway patching, and link community gaps.</p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className={`pb-2 px-3 border-b-2 font-medium ${activeSubTab === 'overview' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Link Reports to Projects
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('create_project')}
              className={`pb-2 px-3 border-b-2 font-medium ${activeSubTab === 'create_project' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Fund New Project (+)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('actions')}
              className={`pb-2 px-3 border-b-2 font-medium ${activeSubTab === 'actions' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Publish Project Works
            </button>
          </div>

          {/* Sub Tab: Link Reports */}
          {activeSubTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-800 leading-relaxed">
                📢 NGOs and International Donors can directly "sponsor" community water, energy, or educational needs reported by citizens. By linking a report to a development project, the report status moves to <strong>In Progress</strong> and users receive instant notifications of your progress.
              </div>

              <form onSubmit={handleLinkSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <h5 className="text-xs font-bold text-slate-700 uppercase">Link Community Challenge to Active Project</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Development Project</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 outline-none"
                    >
                      <option value="">-- Choose Project --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.county})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Unlinked Challenge</label>
                    <select
                      value={selectedReportId}
                      onChange={(e) => setSelectedReportId(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 outline-none"
                    >
                      <option value="">-- Choose Citizen Challenge --</option>
                      {linkableReports.map(r => (
                        <option key={r.id} value={r.id}>{r.title} ({r.location.county})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Link2 className="w-4 h-4" />
                  Establish Sponsorship Link
                </button>
              </form>
            </div>
          )}

          {/* Sub Tab: Fund New Project */}
          {activeSubTab === 'create_project' && (
            <form onSubmit={handleCreateProjectSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <h5 className="text-xs font-bold text-slate-700 uppercase">Fund and Launch New Development Project</h5>
              
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-500">Project Title</label>
                <input 
                  type="text" 
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Westlands Water Pipeline and Storage Expansion"
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-500">Project Mission Description</label>
                <textarea 
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Describe the scope of community problems solved and infrastructure built..."
                  rows={2}
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Target County</label>
                  <select
                    value={newProjCounty}
                    onChange={(e) => setNewProjCounty(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Eldoret">Eldoret</option>
                    <option value="Machakos">Machakos</option>
                    <option value="Kitui">Kitui</option>
                    <option value="Makueni">Makueni</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Funding Budget</label>
                  <input 
                    type="text"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(e.target.value)}
                    placeholder="e.g. KES 15,000,000"
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sector Category</label>
                  <select
                    value={newProjSector}
                    onChange={(e) => setNewProjSector(e.target.value as ProjectSector)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                  >
                    <option value="water">Water & Sanitation</option>
                    <option value="energy">Energy & Electricity</option>
                    <option value="roads">Road Network</option>
                    <option value="health">Healthcare Facilities</option>
                    <option value="education">Schools Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-500">Funded / Sponsored By (Agency/NGO Name)</label>
                <input 
                  type="text" 
                  value={newProjDonor}
                  onChange={(e) => setNewProjDonor(e.target.value)}
                  placeholder="e.g. Safaricom Foundation, Red Cross, USAID"
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Launch & Publish Fund
              </button>
            </form>
          )}

          {/* Sub Tab: Project Updates */}
          {activeSubTab === 'actions' && (
            <form onSubmit={handleProjectUpdateSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <h5 className="text-xs font-bold text-slate-700 uppercase">Publish Construction Milestones / Updates</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Project</label>
                  <select
                    value={updateProjId}
                    onChange={(e) => setUpdateProjId(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                  >
                    <option value="">-- Choose Project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Progress Percentage (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={updateProgress}
                    onChange={(e) => setUpdateProgress(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-500">Update Title</label>
                  <input 
                    type="text"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    placeholder="e.g. Drilling 50% complete, Excavation started"
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Project Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="ongoing">Ongoing Works</option>
                    <option value="completed">Completed Successfully</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-500">Update Technical Description</label>
                <input 
                  type="text"
                  value={updateDesc}
                  onChange={(e) => setUpdateDesc(e.target.value)}
                  placeholder="Provide precise milestones details regarding layout, engineering works..."
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                Publish Milestone Update
              </button>
            </form>
          )}
        </div>
      )}

      {/* PORTAL CONTENT: ADMINISTRATOR */}
      {userProfile.role === 'admin' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-slate-850" />
            <div>
              <h4 className="font-display font-bold text-slate-800">CivicLink National Admin Terminal</h4>
              <p className="text-xs text-slate-500">County distribution oversight & ministry parastatal allocation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Reports</span>
              <span className="text-xl font-bold text-slate-800">{reports.length}</span>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
              <span className="text-[10px] text-red-700 uppercase block font-semibold">Unresolved</span>
              <span className="text-xl font-bold text-red-600">
                {reports.filter(r => r.status !== 'resolved' && r.status !== 'rejected').length}
              </span>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
              <span className="text-[10px] text-blue-700 uppercase block font-semibold">Active Fundings</span>
              <span className="text-xl font-bold text-blue-600">{projects.length}</span>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
              <span className="text-[10px] text-emerald-700 uppercase block font-semibold">Completed Projects</span>
              <span className="text-xl font-bold text-emerald-600">
                {projects.filter(p => p.status === 'completed').length}
              </span>
            </div>
          </div>

          {/* Allocation actions */}
          <form onSubmit={handleAssignSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h5 className="text-xs font-bold text-slate-750 uppercase">Allocate Community Challenge to Ministry / Parastatal</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Incoming Report</label>
                <select
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="">-- Choose Challenge --</option>
                  {unassignedReports.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.location.county})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Assign to Competent Agency</label>
                <select
                  value={assignAgency}
                  onChange={(e) => setAssignAgency(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2.5 outline-none"
                >
                  <option value="Nairobi Water and Sewerage Company (NCWSC)">Nairobi Water NCWSC</option>
                  <option value="Kenya Power & Lighting Company (KPLC)">Kenya Power KPLC</option>
                  <option value="Kenya National Highways Authority (KeNHA)">Highways KeNHA</option>
                  <option value="Kenya Urban Roads Authority (KURA)">Urban Roads KURA</option>
                  <option value="Mombasa Water and Sanitation (MOWASSCO)">Mombasa Water MOWASSCO</option>
                  <option value="County Health Services Board">County Health Board</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Assign & Transition Status to "Assigned"
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
