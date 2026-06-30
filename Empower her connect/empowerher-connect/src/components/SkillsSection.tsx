import React, { useState } from 'react';
import { Course, UserRole } from '../types';
import { INITIAL_COURSES } from '../data';
import { translations } from '../translations';
import { Award, BookOpen, Clock, User, CheckCircle, GraduationCap, ChevronRight, PlusCircle } from 'lucide-react';

interface SkillsSectionProps {
  language: 'en' | 'sw';
  userRole: UserRole;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export default function SkillsSection({ language, userRole, courses, setCourses }: SkillsSectionProps) {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  
  // Progress states for enrolled courses (Simulate progress 0-100%)
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});

  // Trainer course form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleSw, setNewTitleSw] = useState('');
  const [newCategory, setNewCategory] = useState('Soap Making');
  const [newDescEn, setNewDescEn] = useState('');
  const [newDescSw, setNewDescSw] = useState('');
  const [newTrainer, setNewTrainer] = useState('');
  const [newDurationEn, setNewDurationEn] = useState('4 Weeks');
  const [newDurationSw, setNewDurationSw] = useState('Wiki 4');

  const handleEnroll = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds((prev) => [...prev, courseId]);
      setCourseProgress((prev) => ({ ...prev, [courseId]: 25 })); // Starts at 25%
    }
  };

  const handleCompleteModule = (courseId: string) => {
    setCourseProgress((prev) => {
      const curr = prev[courseId] || 0;
      const next = curr + 25 > 100 ? 100 : curr + 25;
      return { ...prev, [courseId]: next };
    });
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitleEn && newTrainer) {
      const newCourse: Course = {
        id: `course_${Date.now()}`,
        titleEn: newTitleEn,
        titleSw: newTitleSw || newTitleEn,
        category: newCategory,
        trainerName: newTrainer,
        descriptionEn: newDescEn,
        descriptionSw: newDescSw || newDescEn,
        durationEn: newDurationEn,
        durationSw: newDurationSw,
        modulesEn: ['Welcome and introduction to toolkits', 'Core raw chemistry formulation', 'Advanced production process', 'Graduation practical assessment'],
        modulesSw: ['Karibu na utangulizi wa vifaa', 'Utaratibu wa mchanganyiko wa kimsingi', 'Mchakato wa juu wa uzalishaji', 'Tathmini ya mwisho ya vitendo'],
        enrolledUsers: [],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      };

      setCourses((prev) => [newCourse, ...prev]);
      setShowAddForm(false);
      setNewTitleEn('');
      setNewTitleSw('');
      setNewDescEn('');
      setNewDescSw('');
      setNewTrainer('');
    }
  };

  const categories = [
    'All',
    'Soap Making',
    'Tailoring',
    'Basket Weaving',
    'Caregiving',
    'Baking',
    'Digital Skills',
    'Entrepreneurship',
  ];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter((c) => c.category === selectedCategory);

  const canManageCourses = userRole === 'trainer' || userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-teal-950 flex items-center gap-2">
            <GraduationCap className="w-5.5 h-5.5 text-teal-600" />
            {t.skillsTitle}
          </h2>
          <p className="text-sm text-teal-900 mt-1 leading-relaxed">
            {t.skillsDesc}
          </p>
        </div>
        {canManageCourses && (
          <button
            id="btn-show-add-course"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addCourse}</span>
          </button>
        )}
      </div>

      {/* Trainer's Publish Panel */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 max-w-2xl animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            {t.addCourse}
          </h3>
          <form onSubmit={handleAddCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Course Title (English)</label>
              <input
                type="text"
                required
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                placeholder="e.g. Traditional Basket Weaving"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Course Title (Kiswahili)</label>
              <input
                type="text"
                value={newTitleSw}
                onChange={(e) => setNewTitleSw(e.target.value)}
                placeholder="mfano, Ususi wa Vikapu vya Kiasili"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Trainer Name</label>
              <input
                type="text"
                required
                value={newTrainer}
                onChange={(e) => setNewTrainer(e.target.value)}
                placeholder="e.g. Grace Wanza"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Duration (English)</label>
              <input
                type="text"
                value={newDurationEn}
                onChange={(e) => setNewDurationEn(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Duration (Kiswahili)</label>
              <input
                type="text"
                value={newDurationSw}
                onChange={(e) => setNewDurationSw(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Course Description (English)</label>
              <textarea
                value={newDescEn}
                onChange={(e) => setNewDescEn(e.target.value)}
                rows={3}
                placeholder="Course details..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Course Description (Kiswahili)</label>
              <textarea
                value={newDescSw}
                onChange={(e) => setNewDescSw(e.target.value)}
                rows={3}
                placeholder="Maelezo ya kozi..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                {t.close}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer"
              >
                Publish Course
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-gray-50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            {cat === 'All' ? t.allCategories : cat}
          </button>
        ))}
      </div>

      {/* Courses grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          const progress = courseProgress[course.id] || 0;
          const isActive = activeCourseId === course.id;

          return (
            <div
              key={course.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300 ${
                isActive ? 'ring-2 ring-teal-600' : 'border-gray-100'
              }`}
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.titleEn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-teal-900/80 backdrop-blur-xs text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {course.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight">
                    {language === 'en' ? course.titleEn : course.titleSw}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{language === 'en' ? course.durationEn : course.durationSw}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{course.trainerName}</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pt-1 line-clamp-2">
                    {language === 'en' ? course.descriptionEn : course.descriptionSw}
                  </p>
                </div>
              </div>

              {/* Progress Tracker / Enrollment Controls */}
              <div className="p-5 pt-0">
                {isEnrolled ? (
                  <div className="space-y-3 p-3.5 bg-teal-50/50 rounded-xl border border-teal-100/50">
                    <div className="flex items-center justify-between text-[11px] font-bold text-teal-950">
                      <span>{t.progressTracker}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-teal-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    {progress < 100 ? (
                      <button
                        onClick={() => handleCompleteModule(course.id)}
                        className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Mark Module Complete</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 justify-center text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-1 rounded-lg">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Graduated! (Cert Issued)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    id={`btn-enroll-${course.id}`}
                    onClick={() => handleEnroll(course.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{t.enrollNow}</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveCourseId(isActive ? null : course.id)}
                  className="w-full mt-2 text-center text-[10px] font-bold text-purple-700 hover:text-purple-800 flex items-center justify-center gap-0.5 cursor-pointer"
                >
                  <span>{isActive ? 'Hide Syllabus' : 'Show Syllabus & Modules'}</span>
                  <ChevronRight className={`w-3 h-3 transform transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </button>

                {isActive && (
                  <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-xl text-left space-y-2 animate-fade-in">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {t.modules}
                    </h4>
                    <ul className="space-y-1.5">
                      {(language === 'en' ? course.modulesEn : course.modulesSw).map((mod, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
