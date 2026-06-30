import React, { useState } from 'react';
import { Job, UserRole } from '../types';
import { INITIAL_JOBS } from '../data';
import { translations } from '../translations';
import { Briefcase, MapPin, DollarSign, Send, CheckCircle, FileText, PlusCircle, Trash } from 'lucide-react';

interface JobBoardSectionProps {
  language: 'en' | 'sw';
  userRole: UserRole;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

export default function JobBoardSection({ language, userRole, jobs, setJobs }: JobBoardSectionProps) {
  const t = translations[language];
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [pitchText, setPitchText] = useState('');
  const [applicantName, setApplicantName] = useState('Mama Joy Akech');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Job creation state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleSw, setNewTitleSw] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newType, setNewType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote'>('Full-time');
  const [newDescEn, setNewDescEn] = useState('');
  const [newDescSw, setNewDescSw] = useState('');

  const handleApplySubmit = (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    if (pitchText.trim()) {
      // Append applicant in local state
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id === jobId) {
            return {
              ...j,
              applicants: [
                ...j.applicants,
                {
                  userId: 'mother_user_self',
                  name: applicantName || 'Mama Member',
                  resumeUrl: 'Completed Caregiving & Soap-Making course',
                  date: new Date().toLocaleDateString(),
                },
              ],
            };
          }
          return j;
        })
      );

      setAppliedJobIds((prev) => [...prev, jobId]);
      setSubmitted(true);
      setPitchText('');
      setTimeout(() => {
        setSubmitted(false);
        setActiveJobId(null);
      }, 4000);
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitleEn && newCompany && newSalary) {
      const newJob: Job = {
        id: `job_${Date.now()}`,
        titleEn: newTitleEn,
        titleSw: newTitleSw || newTitleEn,
        company: newCompany,
        location: newLocation || 'Nairobi',
        salary: newSalary,
        type: newType,
        descriptionEn: newDescEn,
        descriptionSw: newDescSw || newDescEn,
        requirementsEn: ['Flexible and willing to learn', 'Empathetic mindset', 'Graduate of EmpowerHer Connect courses'],
        requirementsSw: ['Wepesi na tayari kujifunza', 'Mtazamo wa huruma', 'Mhitimu wa kozi za EmpowerHer Connect'],
        postedBy: 'employer_user',
        applicants: [],
      };

      setJobs((prev) => [newJob, ...prev]);
      setShowAddForm(false);
      setNewTitleEn('');
      setNewTitleSw('');
      setNewCompany('');
      setNewLocation('');
      setNewSalary('');
      setNewDescEn('');
      setNewDescSw('');
    }
  };

  const isEmployer = userRole === 'employer' || userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
            <Briefcase className="w-5.5 h-5.5 text-emerald-600" />
            {t.jobsTitle}
          </h2>
          <p className="text-sm text-emerald-900 mt-1 leading-relaxed">
            {t.jobsDesc}
          </p>
        </div>
        {isEmployer && (
          <button
            id="btn-show-add-job"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Job Opening</span>
          </button>
        )}
      </div>

      {/* Employer Posting Dashboard */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 max-w-2xl animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            {t.postJobTitle}
          </h3>
          <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Job Title (English)</label>
              <input
                type="text"
                required
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                placeholder={t.jobTitlePlaceholder}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Job Title (Kiswahili)</label>
              <input
                type="text"
                value={newTitleSw}
                onChange={(e) => setNewTitleSw(e.target.value)}
                placeholder="e.g. Msimamizi wa Kituo"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company / Household</label>
              <input
                type="text"
                required
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder={t.companyPlaceholder}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Nairobi, Westlands"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Salary / Compensation</label>
              <input
                type="text"
                required
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder={t.salaryPlaceholder}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Employment Type</label>
              <select
                value={newType}
                onChange={(e: any) => setNewType(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Job Description (English)</label>
              <textarea
                value={newDescEn}
                onChange={(e) => setNewDescEn(e.target.value)}
                rows={3}
                placeholder="Write the responsibilities and background requirements..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Job Description (Kiswahili)</label>
              <textarea
                value={newDescSw}
                onChange={(e) => setNewDescSw(e.target.value)}
                rows={3}
                placeholder="Maelezo na wajibu wa kazi kwa Kiswahili..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                {t.close}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
              >
                Publish Opening
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Listings column */}
        <div className="lg:col-span-2 space-y-4">
          {jobs.map((job) => {
            const hasApplied = appliedJobIds.includes(job.id);
            const isSelected = activeJobId === job.id;

            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all duration-250 flex flex-col justify-between ${
                  isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-gray-100'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base leading-tight">
                        {language === 'en' ? job.titleEn : job.titleSw}
                      </h3>
                      <p className="text-xs font-medium text-emerald-600 mt-1">{job.company}</p>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold text-purple-700 bg-purple-50 rounded-full uppercase">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{job.salary}</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    {language === 'en' ? job.descriptionEn : job.descriptionSw}
                  </p>

                  <div className="pt-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      {language === 'sw' ? 'Mahitaji' : 'Job Requirements'}
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {(language === 'en' ? job.requirementsEn : job.requirementsSw).map((req, index) => (
                        <li key={index} className="text-xs text-gray-700 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    {t.postedByEmployer}: {job.postedBy === 'employer_user' ? 'Tiny Tots' : 'Premium Home Bakery'}
                  </p>

                  {hasApplied ? (
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.alreadyEnrolled.split(' ✓')[0]} ✓</span>
                    </div>
                  ) : (
                    <button
                      id={`btn-job-apply-${job.id}`}
                      onClick={() => setActiveJobId(isSelected ? null : job.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition"
                    >
                      {t.applyNow}
                    </button>
                  )}
                </div>

                {/* Inline Application submission pitch */}
                {isSelected && !hasApplied && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left animate-fade-in">
                    <h4 className="text-xs font-bold text-gray-900 mb-2">
                      {t.applicationForm}
                    </h4>
                    <form onSubmit={(e) => handleApplySubmit(e, job.id)} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Introduction & Core Skills Pitch</label>
                        <textarea
                          required
                          rows={3}
                          value={pitchText}
                          onChange={(e) => setPitchText(e.target.value)}
                          placeholder="Tell the employer why you are a perfect fit. List vocational certificates completed on EmpowerHer..."
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white resize-none"
                        ></textarea>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveJobId(null)}
                          className="px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Submit Application</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Employer Candidate Monitoring console (Always visible to Employers and Admins!) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{t.applicantsList}</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              PERSPECTIVE: {userRole.toUpperCase()}
            </p>
          </div>

          {isEmployer ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-800 truncate max-w-[130px]">
                      {language === 'en' ? job.titleEn : job.titleSw}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full shrink-0">
                      {job.applicants.length} applied
                    </span>
                  </div>

                  {job.applicants.length > 0 ? (
                    <div className="space-y-1.5 pt-1.5 border-t border-gray-100">
                      {job.applicants.map((cand, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-gray-100 text-[10px] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-purple-950">{cand.name}</span>
                            <span className="text-gray-400 font-medium">{cand.date}</span>
                          </div>
                          <p className="text-gray-600 font-semibold leading-normal">
                            {cand.resumeUrl}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic">No candidates yet.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-teal-50 border border-teal-100 text-teal-900 text-center rounded-xl space-y-2">
              <p className="text-xs font-semibold leading-relaxed">
                Want to recruit or view candidate application folders?
              </p>
              <p className="text-[10px] text-teal-700">
                Switch your workspace to <strong>Verified Employer</strong> or <strong>Platform Administrator</strong> using the switcher widget at the top.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
