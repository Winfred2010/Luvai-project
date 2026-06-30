import React, { useState, useEffect } from 'react';
import { Language, UserRole, Course, Job, Product } from './types';
import { translations } from './translations';
import { INITIAL_COURSES, INITIAL_JOBS, INITIAL_PRODUCTS } from './data';

// Modular Subcomponents
import LanguageSelector from './components/LanguageSelector';
import RoleSwitcher from './components/RoleSwitcher';
import EmergencySection from './components/EmergencySection';
import LegalSection from './components/LegalSection';
import CounselingSection from './components/CounselingSection';
import SkillsSection from './components/SkillsSection';
import JobBoardSection from './components/JobBoardSection';
import MarketplaceSection from './components/MarketplaceSection';
import FinancialSection from './components/FinancialSection';
import ForumSection from './components/ForumSection';
import MentorshipSection from './components/MentorshipSection';
import DonationSection from './components/DonationSection';
import SuccessSection from './components/SuccessSection';
import ChatbotSection from './components/ChatbotSection';
import AdminSection from './components/AdminSection';

// Lucide Icons
import {
  Heart,
  Scale,
  GraduationCap,
  Briefcase,
  ShoppingBag,
  PiggyBank,
  MessageSquare,
  Sparkles,
  Shield,
  Phone,
  LogOut,
  LogIn,
  Layers,
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
  User,
} from 'lucide-react';

export default function App() {
  // Global States
  const [language, setLanguage] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('mother');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Interactive Data States (Loaded from seed data, updated locally)
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('eh_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('eh_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eh_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Auth screen inputs
  const [authEmail, setAuthEmail] = useState('mama.afrika@gmail.com');
  const [authPassword, setAuthPassword] = useState('••••••••');
  const [authRoleSelection, setAuthRoleSelection] = useState<UserRole>('mother');

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('eh_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('eh_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('eh_products', JSON.stringify(products));
  }, [products]);

  const t = translations[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(authRoleSelection);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  // Switch role directly from switcher widget inside workspace
  const handleRoleChangeDirect = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // If Admin, auto switch tab to admin center, otherwise go to dashboard
    if (newRole === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Nav categories mapped dynamically
  const menuItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Layers, roles: ['mother', 'trainer', 'mentor', 'employer', 'admin'] },
    { id: 'emergency', label: t.nav.emergency, icon: Phone, roles: ['mother', 'trainer', 'mentor', 'employer', 'admin'], highlight: true },
    { id: 'legal', label: t.nav.legal, icon: Scale, roles: ['mother', 'mentor', 'admin'] },
    { id: 'counseling', label: t.nav.counseling, icon: Heart, roles: ['mother', 'mentor', 'admin'] },
    { id: 'skills', label: t.nav.skills, icon: GraduationCap, roles: ['mother', 'trainer', 'admin'] },
    { id: 'jobs', label: t.nav.jobs, icon: Briefcase, roles: ['mother', 'employer', 'admin'] },
    { id: 'marketplace', label: t.nav.marketplace, icon: ShoppingBag, roles: ['mother', 'employer', 'admin'] },
    { id: 'financial', label: t.nav.financial, icon: PiggyBank, roles: ['mother', 'admin'] },
    { id: 'forum', label: t.nav.forum, icon: MessageSquare, roles: ['mother', 'trainer', 'mentor', 'admin'] },
    { id: 'mentors', label: t.nav.mentors, icon: Heart, roles: ['mother', 'mentor', 'admin'] },
    { id: 'donations', label: t.nav.donations, icon: Sparkles, roles: ['mother', 'trainer', 'mentor', 'employer', 'admin'] },
    { id: 'success', label: t.nav.success, icon: Award, roles: ['mother', 'trainer', 'mentor', 'employer', 'admin'] },
    { id: 'aiAssistant', label: t.nav.aiAssistant, icon: Sparkles, roles: ['mother', 'trainer', 'mentor', 'employer', 'admin'] },
    { id: 'admin', label: t.nav.admin, icon: Shield, roles: ['admin'] },
  ];

  // Render current tab component
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'emergency':
        return <EmergencySection language={language} />;
      case 'legal':
        return <LegalSection language={language} />;
      case 'counseling':
        return <CounselingSection language={language} />;
      case 'skills':
        return (
          <SkillsSection
            language={language}
            userRole={currentRole}
            courses={courses}
            setCourses={setCourses}
          />
        );
      case 'jobs':
        return (
          <JobBoardSection
            language={language}
            userRole={currentRole}
            jobs={jobs}
            setJobs={setJobs}
          />
        );
      case 'marketplace':
        return (
          <MarketplaceSection
            language={language}
            userRole={currentRole}
            products={products}
            setProducts={setProducts}
          />
        );
      case 'financial':
        return <FinancialSection language={language} />;
      case 'forum':
        return <ForumSection language={language} userRole={currentRole} />;
      case 'mentors':
        return <MentorshipSection language={language} />;
      case 'donations':
        return <DonationSection language={language} />;
      case 'success':
        return <SuccessSection language={language} />;
      case 'aiAssistant':
        return <ChatbotSection language={language} />;
      case 'admin':
        return (
          <AdminSection
            language={language}
            products={products}
            setProducts={setProducts}
            courses={courses}
          />
        );
      default:
        return renderDashboardOverview();
    }
  };

  // Dashboard landing screen
  const renderDashboardOverview = () => {
    // We fetch real courses and products to display dynamically in our bento cells
    const featuredCourse = courses[0] || INITIAL_COURSES[0];
    const featuredProduct = products[0] || INITIAL_PRODUCTS[0];
    const secondProduct = products[1] || INITIAL_PRODUCTS[1];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* 1. Main Hero/Skills (Tall/Wide) */}
          <div className="col-span-12 lg:col-span-8 bg-indigo-600 rounded-3xl p-6 md:p-8 text-white flex flex-col justify-between min-h-[340px] relative overflow-hidden shadow-xs">
            <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <span className="bg-indigo-400/30 text-indigo-100 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                {t.roles[currentRole]}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight mt-2">
                {language === 'en' 
                  ? 'Master Digital Skills & Entrepreneurship' 
                  : 'Miliki Ujuzi wa Kidijitali na Ujasiriamali'}
              </h2>
              <p className="text-indigo-100 text-xs md:text-sm max-w-lg leading-relaxed font-medium">
                {language === 'en'
                  ? 'Join 450+ women learning soap making, professional tailoring, caregiving, and digital freelancing this month. Build your independence safely.'
                  : 'Ungana na akina mama 450+ wanaojifunza utengenezaji wa sabuni, ushonaji wa kisasa, utunzaji, na ujasiriamali mwezi huu.'}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 mt-6">
              <button 
                onClick={() => setActiveTab('skills')}
                className="bg-white hover:bg-slate-50 text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-xs cursor-pointer active:scale-95"
              >
                {language === 'en' ? 'Browse All Courses' : 'Tazama Kozi Zote'}
              </button>
              <button 
                onClick={() => setActiveTab('aiAssistant')}
                className="bg-indigo-500 hover:bg-indigo-400 text-white border border-indigo-400/30 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95"
              >
                {language === 'en' ? 'Consult AI Assistant' : 'Uliza Msaidizi wa AI'}
              </button>
            </div>
          </div>

          {/* 2. Emergency SOS Rescue Card (Toned to represent critical support) */}
          <div className="col-span-12 md:col-span-1 lg:col-span-4 bg-red-600 rounded-3xl p-6 text-white flex flex-col justify-between min-h-[340px] relative overflow-hidden shadow-xs">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-4">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {language === 'en' ? '24/7 Safety First' : 'Usalama Saa 24'}
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2 mt-2">
                <Phone className="w-5.5 h-5.5 animate-pulse" />
                <span>{language === 'en' ? 'Rescue & Shelter' : 'Uokoaji na Makazi'}</span>
              </h3>
              <p className="text-red-100 text-xs leading-relaxed font-medium">
                {language === 'en'
                  ? 'Access emergency safe houses, shelters, FIDA pro-bono family advocates, and police rescue hotlines immediately if you feel unsafe.'
                  : 'Fikia nyumba salama za dharura, makazi, mawakili wa FIDA bila malipo, na nambari za polisi mara moja.'}
              </p>
            </div>

            <button
              id="dash-btn-emergency"
              onClick={() => setActiveTab('emergency')}
              className="mt-6 w-full py-3 bg-white hover:bg-red-50 text-red-700 rounded-xl text-xs font-black tracking-wide uppercase transition shadow-xs cursor-pointer active:scale-95"
            >
              {language === 'en' ? 'Open Rescue Center' : 'Fungua Kituo cha Uokoaji'}
            </button>
          </div>

          {/* 3. Legal Advocacy (Medium) */}
          <div className="col-span-12 md:col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between min-h-[280px] shadow-xs hover:shadow-sm transition-all duration-300">
            <div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Legal Advocacy' : 'Haki za Kisheria'}
              </h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">
                {language === 'en'
                  ? 'Free legal consultations and representation directory for custody, property, and protection orders.'
                  : 'Ushauri wa kisheria bila malipo na orodha ya mawakili wa malezi ya watoto na ulinzi.'}
              </p>
            </div>
            <button
              id="dash-btn-legal"
              onClick={() => setActiveTab('legal')}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              {language === 'en' ? 'Request Referral' : 'Omba Msaada'}
            </button>
          </div>

          {/* 4. Counseling & Deep Healing (Medium Teal) */}
          <div className="col-span-12 md:col-span-1 lg:col-span-4 bg-teal-600 rounded-3xl p-6 text-white flex flex-col justify-between min-h-[280px] relative overflow-hidden shadow-xs">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-teal-500/30 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-white">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">
                {language === 'en' ? 'Mental Healing' : 'Uponyaji wa Kihisia'}
              </h3>
              <p className="text-teal-50/90 text-xs mt-2 leading-relaxed font-medium">
                {language === 'en'
                  ? 'Confidential emotional support, mood logging, and healing groups led by certified specialists.'
                  : 'Usaidizi wa kihisia wa siri, kalenda ya mood, na vikundi vya uponyaji vinavyoongozwa na wataalamu.'}
              </p>
            </div>
            <button
              id="dash-btn-counseling"
              onClick={() => setActiveTab('counseling')}
              className="mt-6 w-full py-2.5 bg-white/25 hover:bg-white/35 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 text-white"
            >
              {language === 'en' ? 'Book Therapy Session' : 'Weka Miadi ya Ushauri'}
            </button>
          </div>

          {/* 5. Marketplace Snippet (Featured Products) */}
          <div className="col-span-12 md:col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between min-h-[280px] shadow-xs hover:shadow-sm transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  {language === 'en' ? "Artisans' Marketplace" : 'Soko la Bidhaa'}
                </h3>
                <button 
                  onClick={() => setActiveTab('marketplace')}
                  className="text-teal-600 text-xs font-bold hover:underline cursor-pointer"
                >
                  {language === 'en' ? 'View All' : 'Tazama Zote'}
                </button>
              </div>

              {/* Product items */}
              <div className="space-y-3">
                {featuredProduct && (
                  <div className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition">
                    <img 
                      src={featuredProduct.image} 
                      className="w-10 h-10 object-cover bg-slate-100 rounded-lg shrink-0 border border-slate-100" 
                      alt="Product"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {language === 'en' ? featuredProduct.titleEn : featuredProduct.titleSw}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {featuredProduct.sellerName}
                      </p>
                    </div>
                    <p className="text-xs font-extrabold text-teal-600 shrink-0">
                      KES {featuredProduct.price}
                    </p>
                  </div>
                )}
                {secondProduct && (
                  <div className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition">
                    <img 
                      src={secondProduct.image} 
                      className="w-10 h-10 object-cover bg-slate-100 rounded-lg shrink-0 border border-slate-100" 
                      alt="Product"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {language === 'en' ? secondProduct.titleEn : secondProduct.titleSw}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {secondProduct.sellerName}
                      </p>
                    </div>
                    <p className="text-xs font-extrabold text-teal-600 shrink-0">
                      KES {secondProduct.price}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="mt-6 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {language === 'en' ? 'Support Mothers Shops' : 'Nunua Bidhaa Hapa'}
            </button>
          </div>

          {/* 6. Savings Chama Goal (Wide) */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PiggyBank className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  {language === 'en' ? 'Chama Savings and Wealth' : 'Malengo ya Akiba ya Chama'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 h-32 rounded-2xl overflow-hidden border border-slate-100 shadow-2xs">
                  <img 
                    src="/src/assets/images/chama_savings_group_1782807669567.jpg" 
                    alt="Chama Savings Group"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3">
                  <div className="p-3 bg-teal-50/50 rounded-2xl border border-teal-100/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">
                        {language === 'en' ? 'Butterfly Sewing Machine Goal' : 'Malengo ya Cherehani ya Butterfly'}
                      </span>
                      <span className="text-[11px] font-extrabold text-teal-700">37% Saved</span>
                    </div>
                    <div className="w-full bg-teal-100/50 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full transition-all duration-500" style={{ width: '37%' }}></div>
                    </div>
                    <p className="text-[10px] text-teal-950/80 leading-normal font-medium">
                      {language === 'en'
                        ? 'Your savings are pooled with other mothers to purchase equipment.'
                        : 'Akiba yako inaunganishwa na akina mama wengine kununua vifaa.'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium mt-3">
                {language === 'en'
                  ? 'Upon vocational course graduation, chama active savers qualify to apply for KES 50,000 capital micro-credits to launch their local cottage businesses.'
                  : 'Baada ya kuhitimu kozi ya ujuzi, wanachama wanaoweka akiba wana sifa za kuomba mikopo midogo ya KES 50,000 kuanza biashara.'}
              </p>
            </div>
            <button
              id="dash-btn-financial"
              onClick={() => setActiveTab('financial')}
              className="mt-5 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {language === 'en' ? 'View Savings Account' : 'Angalia Akaunti Yako'}
            </button>
          </div>

          {/* 7. Forum Updates (Wide) */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-300">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  {language === 'en' ? 'Solidarity Forum Updates' : 'Mazungumzo Mapya ya Forum'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-5 h-36 rounded-2xl overflow-hidden border border-slate-100 shadow-2xs shrink-0">
                  <img 
                    src="/src/assets/images/solidarity_forum_community_1782807685739.jpg" 
                    alt="Solidarity Forum Community"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="sm:col-span-7 space-y-2">
                  <div className="p-2.5 bg-slate-50 rounded-2xl space-y-1 text-xs border border-slate-100">
                    <span className="text-[9px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full uppercase">HEALING</span>
                    <h4 className="font-bold text-slate-800 pt-0.5 truncate">Lavender Laundry Soaps batch done!</h4>
                    <p className="text-slate-500 text-[10px] leading-normal line-clamp-2">I finished my second batch and can now supply local shops...</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-2xl space-y-1 text-xs border border-slate-100">
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-full uppercase">SKILLS</span>
                    <h4 className="font-bold text-slate-800 pt-0.5 truncate">Free sisal dye materials available</h4>
                    <p className="text-slate-500 text-[10px] leading-normal line-clamp-2">Grace Wanza: Come collect natural green dye at Safe Center...</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              id="dash-btn-forum"
              onClick={() => setActiveTab('forum')}
              className="mt-5 w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {language === 'en' ? 'Join Community Discussions' : 'Ingia kwenye Forum'}
            </button>
          </div>

          {/* 7.5. Vocational Workshops Gallery (Full Width Beautiful Bento Section) */}
          <div className="col-span-12 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-sm transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {language === 'en' ? 'Live Training Hub' : 'Kituo cha Mafunzo'}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5 font-sans">
                  {language === 'en' ? 'Vocational Classes & Cosmetics Chemistry Labs' : 'Kozi za Kazi na Maabara ya Vipodozi'}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed font-medium">
                  {language === 'en' 
                    ? 'Our hands-on vocational centers are active daily. Mothers build physical skills to launch cottage micro-enterprises immediately.'
                    : 'Vituo vyetu vya mafunzo vinafanya kazi kila siku. Akina mama wanajifunza ujuzi wa kuanzisha biashara zao mara moja.'}
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('skills')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition self-start md:self-center shrink-0 shadow-xs cursor-pointer active:scale-95"
              >
                {language === 'en' ? 'Join Active Classes' : 'Jiunge na Darasa'}
              </button>
            </div>

            {/* Three column grid showing Soap Making, Tailoring, and Baking/Catering */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Workshop A: Soap Making */}
              <div className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:border-teal-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src="/src/assets/images/soap_making_class_1782806996087.jpg" 
                      alt="Soap Making Class"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-teal-900/80 backdrop-blur-xs text-teal-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {language === 'en' ? 'Soap Making' : 'Utengenezaji Sabuni'}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {language === 'en' ? 'Soap Making & Cosmetics Chemistry' : 'Utengenezaji wa Sabuni na Vipodozi'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {language === 'en' ? 'Trainer: Mama Beatrice Ngozi' : 'Mwalimu: Mama Beatrice Ngozi'}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {language === 'en'
                        ? 'Master saponification, safe herbal infusions, organic essential oils, bar soaps, and liquid sanitizers for immediate commercial packaging.'
                        : 'Mudu utengenezaji wa sabuni, mchanganyiko salama wa mitishamba, mafuta asilia, sabuni za miche, na sabuni za maji kwa ufungashaji.'}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100/50">
                    <span>{language === 'en' ? 'STATUS: IN SESSION' : 'HALI: DARASA LINAENDELEA'}</span>
                    <span>18 {language === 'en' ? 'Mothers' : 'Akina Mama'}</span>
                  </div>
                </div>
              </div>

              {/* Workshop B: Tailoring */}
              <div className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:border-indigo-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src="/src/assets/images/tailoring_class_1782806969074.jpg" 
                      alt="Tailoring Workshop"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-indigo-900/80 backdrop-blur-xs text-indigo-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {language === 'en' ? 'Tailoring' : 'Ushonaji'}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {language === 'en' ? 'Modern Tailoring & Fashion Design' : 'Ushonaji wa Kisasa na Ubunifu wa Mavazi'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {language === 'en' ? 'Trainer: Sister Amina Mavazi' : 'Mwalimu: Sister Amina Mavazi'}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {language === 'en'
                        ? 'Hands-on pattern drafting, operating manual butterfly machines, tailoring dresses, baby garments, and beautiful traditional kanga designs.'
                        : 'Kuchora mitindo ya nguo, kuendesha cherehani za miguu, ushonaji wa nguo za watoto, gauni, na mavazi ya kanga ya kiasili.'}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100/50">
                    <span>{language === 'en' ? 'STATUS: IN SESSION' : 'HALI: DARASA LINAENDELEA'}</span>
                    <span>22 {language === 'en' ? 'Mothers' : 'Akina Mama'}</span>
                  </div>
                </div>
              </div>

              {/* Workshop C: Catering & Baking */}
              <div className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:border-amber-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img 
                      src="/src/assets/images/baking_class_1782806983595.jpg" 
                      alt="Catering & Baking Workshop"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-amber-900/80 backdrop-blur-xs text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {language === 'en' ? 'Catering & Baking' : 'Kuoka na Upishi'}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {language === 'en' ? 'Art of Baking & Pastry Making' : 'Sanaa ya Kuoka na Utengenezaji Keki'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {language === 'en' ? 'Trainer: Chef Mary Njeri' : 'Mwalimu: Chef Mary Njeri'}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {language === 'en'
                        ? 'Master local commercial baking, scale-balanced recipes, bread, pastries, cake icing, sanitizing guidelines, and local catering logistics.'
                        : 'Mudu kuoka kwa biashara, vipimo sahihi vya unga na chachu, mikate, keki, sheria za usafi wa chakula, na misingi ya upishi wa sherehe.'}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
                    <span>{language === 'en' ? 'STATUS: IN SESSION' : 'HALI: DARASA LINAENDELEA'}</span>
                    <span>15 {language === 'en' ? 'Mothers' : 'Akina Mama'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 8. Success Impact Story (Wide & Dynamic) */}
          <div className="col-span-12 bg-slate-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2 md:max-w-2xl relative z-10">
              <span className="bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                {language === 'en' ? 'IMPACT STORY' : 'HADITHI YA MAFANIKIO'}
              </span>
              <p className="text-lg md:text-xl font-medium italic leading-relaxed pt-2">
                {language === 'en'
                  ? '"I started with a simple manual sewing kit from EmpowerHer, and now I employ four other single mothers in my local community."'
                  : '"Nilianza na mashine ndogo ya kushona mikono kutoka EmpowerHer, na sasa nimeajiri akina mama wengine wanne katika jamii yangu."'}
              </p>
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest pt-2">
                — Beatrice K., Tailoring Graduate
              </p>
            </div>
            <button
              onClick={() => setActiveTab('success')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer active:scale-95"
            >
              {language === 'en' ? 'Read Inspiring Stories' : 'Soma Hadithi Zaidi'}
            </button>
          </div>

        </div>
      </div>
    );
  };

  // If NOT logged in, show authentication gate
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
          {/* Logo / Splash */}
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-purple-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-md">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {translations[language].appName}
            </h2>
            <p className="text-sm text-gray-500 leading-normal mt-1.5 max-w-sm mx-auto">
              {translations[language].tagline}
            </p>
          </div>

          <div className="flex justify-center">
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xs rounded-2xl border border-gray-100 sm:px-10 space-y-6">
            <h3 className="text-sm font-bold text-center text-purple-950 uppercase tracking-wider border-b border-gray-50 pb-3">
              {language === 'en' ? 'Secure Authentication Gate' : 'Lango la Kuingia Salama'}
            </h3>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {language === 'en' ? 'Email Address' : 'Anwani ya Barua Pepe'}
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {language === 'en' ? 'Password' : 'Nenosiri'}
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {language === 'en' ? 'Select Profile Role Profile' : 'Chagua Mtazamo wa Akaunti'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['mother', 'trainer', 'mentor', 'employer', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setAuthRoleSelection(role)}
                      className={`px-3 py-2 text-[10px] font-bold rounded-lg border text-center transition cursor-pointer ${
                        authRoleSelection === role
                          ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {translations[language].roles[role].split(' /')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-submit-auth"
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'en' ? 'Sign In and Enter Sandbox' : 'Ingia kwenye Mfumo'}</span>
              </button>
            </form>

            <div className="p-3.5 bg-teal-50 text-teal-950 rounded-xl text-[11px] leading-relaxed border border-teal-100">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
                <span>Sandbox Interactive Guide</span>
              </p>
              <p className="text-[10px] text-teal-900/90 mt-0.5">
                No real credentials needed. Select any of the five role categories above to experience the specialized, secure features designed for that demographic.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Main App container
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo details */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  EmpowerHer <span className="text-teal-600">Connect</span>
                </h1>
                <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase mt-0.5">
                  {language === 'en' ? 'MEMBER CONSOLE' : 'JOPO LA MWANACHAMA'}
                </p>
              </div>
            </div>

            {/* Language Selection / Logout Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Language Selector to match Bento design */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('sw')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    language === 'sw' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  SW
                </button>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Pulsing EMERGENCY HELP button */}
              <button
                onClick={() => setActiveTab('emergency')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 uppercase"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                {language === 'en' ? 'EMERGENCY HELP' : 'MSAADA WA HARAKA'}
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Profile Avatar */}
              <img
                src={`https://ui-avatars.com/api/?name=${currentRole === 'admin' ? 'System+Admin' : 'Mama+Grace'}&background=0D9488&color=fff`}
                className="w-10 h-10 rounded-full border-2 border-teal-100 shadow-xs hidden sm:block"
                alt="Profile"
              />

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* Log out */}
              <button
                id="btn-sign-out"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-100 cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'en' ? 'Sign Out' : 'Ondoka'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main app grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <RoleSwitcher
          currentRole={currentRole}
          onRoleChange={handleRoleChangeDirect}
          language={language}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Navigation Rails Sidebar */}
          <aside className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-5 space-y-1.5 shadow-xs">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Workspace Rails
            </h3>

            {menuItems
              .filter((item) => item.roles.includes(currentRole))
              .map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? item.highlight
                          ? 'bg-red-600 border-red-600 text-white shadow-xs scale-102'
                          : 'bg-indigo-600 border-indigo-600 text-white shadow-xs scale-102'
                        : item.highlight
                        ? 'bg-red-50 border-red-100 text-red-700 hover:bg-red-100'
                        : 'bg-white border-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </aside>

          {/* Core main tab viewport */}
          <section className="lg:col-span-3 space-y-6">
            {renderTabContent()}
          </section>
        </div>
      </main>

      {/* Humble simple safe footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-400 font-bold tracking-wide uppercase">
            {t.appName} &copy; 2026
          </p>
          <p className="text-[10px] text-slate-400 leading-normal max-w-lg mx-auto">
            {language === 'en'
              ? 'EmpowerHer Connect is an open-source development project supporting single mothers. Designed with visual integrity, safety directives, and high accessibility.'
              : 'EmpowerHer Connect ni mradi unaosaidia akina mama walezi mmoja Afrika Mashariki. Imeundwa kwa usalama na heshima kuu.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
