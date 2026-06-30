import { 
  EmergencyContact, 
  LegalReferral, 
  CounselingResource, 
  Course, 
  Job, 
  Product, 
  Event, 
  DonationCamp, 
  SuccessStory, 
  Mentor 
} from './types';

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'e1',
    name: 'National Gender Based Violence Helpline',
    phone: '1195',
    type: 'helpline',
    location: 'National Coverage (Kenya / East Africa)',
    descriptionEn: 'Free 24/7 tele-counseling, legal advice, and rescue services for survivors of GBV.',
    descriptionSw: 'Huduma ya simu ya saa 24 bila malipo kwa ushauri wa kisaikolojia, kisheria na uokoaji.'
  },
  {
    id: 'e2',
    name: 'Toll-Free Child Helpline',
    phone: '116',
    type: 'helpline',
    location: 'National Coverage',
    descriptionEn: '24-hour helpline dedicated to reporting child abuse and seeking assistance.',
    descriptionSw: 'Nambari ya dharura ya saa 24 ya kuripoti unyanyasaji wa watoto na kupata msaada.'
  },
  {
    id: 'e3',
    name: 'Usalama Women Safe Shelter',
    phone: '+254 722 000 111',
    type: 'shelter',
    location: 'Nairobi',
    descriptionEn: 'Safe house providing temporary accommodation, counseling, and medical assistance.',
    descriptionSw: 'Nyumba salama inayotoa makazi ya muda, ushauri nasaha na msaada wa matibabu.'
  },
  {
    id: 'e4',
    name: 'Kivulini Women Rescue Center',
    phone: '+254 733 999 222',
    type: 'shelter',
    location: 'Kisumu',
    descriptionEn: 'Emergency rescue, psychological first aid, and transitional shelter for mothers.',
    descriptionSw: 'Uokoaji wa dharura, huduma ya kwanza ya kisaikolojia, na makazi ya mpito.'
  }
];

export const INITIAL_LEGAL_REFERRALS: LegalReferral[] = [
  {
    id: 'l1',
    name: 'FIDA Kenya (Federation of Women Lawyers)',
    specialty: 'Family Law & Domestic Violence Cases',
    phone: '+254 20 2717056',
    email: 'info@fidakenya.org',
    location: 'Nairobi, Mombasa & Kisumu',
    experienceEn: 'Over 35 years representing vulnerable women in custody, inheritance, and violence cases.',
    experienceSw: 'Zaidi ya miaka 35 wakiwakilisha wanawake katika kesi za malezi, urithi na unyanyasaji.'
  },
  {
    id: 'l2',
    name: 'Faith Macharia & Associates',
    specialty: 'Pro-Bono Legal Defense & Child Support',
    phone: '+254 711 222 333',
    email: 'faith.macharia@legal.or.ke',
    location: 'Nakuru',
    experienceEn: 'Dedicated human rights lawyer focusing on child maintenance and domestic safety orders.',
    experienceSw: 'Wakili wa haki za binadamu anayelenga matunzo ya watoto na amri za usalama wa nyumbani.'
  }
];

export const INITIAL_COUNSELING_RESOURCES: CounselingResource[] = [
  {
    id: 'cr1',
    titleEn: 'Healing from Domestic Trauma',
    titleSw: 'Kupona Kutokana na Jeraha la Unyanyasaji',
    category: 'healing',
    contentEn: 'Step 1: Accept safety. Step 2: Establish boundaries. Step 3: Speak to professional psychologists.',
    contentSw: 'Hatua ya 1: Kubali usalama. Hatua ya 2: Weka mipaka. Hatua ya 3: Ongea na wanasaikolojia wataalamu.'
  },
  {
    id: 'cr2',
    titleEn: 'Positive Parenting as a Single Mother',
    titleSw: 'Malezi Chanya Kama Mama Mlezi Mmoja',
    category: 'parenting',
    contentEn: 'Nurture emotional stability for your child by practicing self-care and open communication.',
    contentSw: 'Kuza utulivu wa kihisia kwa mtoto wako kwa kujitunza na kuwa na mawasiliano ya wazi.'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    titleEn: 'Soap Making & Cosmetics Chemistry',
    titleSw: 'Utengenezaji wa Sabuni na Vipodozi',
    category: 'Soap Making',
    trainerName: 'Mama Beatrice Ngozi',
    descriptionEn: 'Learn how to produce laundry soaps, liquid handwash, and organic bar soaps for local sales.',
    descriptionSw: 'Jifunze jinsi ya kutengeneza sabuni za kufulia, kunawia mikono, na sabuni za miche kwa soko la ndani.',
    durationEn: '4 Weeks',
    durationSw: 'Wiki 4',
    modulesEn: ['Introduction to ingredients & safety', 'Cold process soap formulating', 'Liquid detergents production', 'Packaging and market pricing'],
    modulesSw: ['Utangulizi wa viungo na usalama', 'Njia ya baridi ya kutengeneza sabuni', 'Utengenezaji wa sabuni za maji', 'Ufungashaji na upangaji bei'],
    enrolledUsers: [],
    image: '/src/assets/images/soap_making_class_1782806996087.jpg'
  },
  {
    id: 'c2',
    titleEn: 'Modern Tailoring and Fashion Design',
    titleSw: 'Ushonaji wa Kisasa na Ubunifu wa Mavazi',
    category: 'Tailoring',
    trainerName: 'Sister Amina Mavazi',
    descriptionEn: 'Master sewing machine operation, pattern drafting, and creating custom ladies dresses.',
    descriptionSw: 'Mudu uendeshaji wa cherehani, uchizaji wa mitindo, na utengenezaji wa nguo za wanawake.',
    durationEn: '8 Weeks',
    durationSw: 'Wiki 8',
    modulesEn: ['Understanding sewing machinery', 'Body measurements & patterns', 'Stitching and garment assembly', 'Embroidery & embellishment'],
    modulesSw: ['Kuelewa mashine za kushona', 'Vipimo vya mwili na muundo', 'Kushona na kuunganisha nguo', 'Urembeshaji na mapambo'],
    enrolledUsers: [],
    image: '/src/assets/images/tailoring_class_1782806969074.jpg'
  },
  {
    id: 'c3',
    titleEn: 'Artisanal Basket Weaving',
    titleSw: 'Ususi wa Vikapu vya Sanaa (Kiondo)',
    category: 'Basket Weaving',
    trainerName: 'Grace Wanza',
    descriptionEn: 'Learn the traditional art of weaving Kiondos using sisal fiber and modern decorative threads.',
    descriptionSw: 'Jifunze ususi wa kiasili wa kiondo kwa kutumia katani na nyuzi za kisasa za mapambo.',
    durationEn: '3 Weeks',
    durationSw: 'Wiki 3',
    modulesEn: ['Sisal preparation and dyeing', 'Basic weaving stitches', 'Handles and leather integration', 'International exporting standards'],
    modulesSw: ['Maandalizi ya katani na kupaka rangi', 'Mishono ya kimsingi ya kusuka', 'Nia ya kuweka kishikio cha ngozi', 'Viwango vya usafirishaji nje ya nchi'],
    enrolledUsers: [],
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c4',
    titleEn: 'Professional Caregiving & First Aid',
    titleSw: 'Utoaji Huduma na Huduma ya Kwanza',
    category: 'Caregiving',
    trainerName: 'Dr. Susan Atieno',
    descriptionEn: 'Develop essential skills for elderly care, child care support, and emergency first aid response.',
    descriptionSw: 'Kuza ujuzi muhimu kwa ajili ya huduma za wazee, usaidizi wa kulelea watoto, na huduma ya kwanza.',
    durationEn: '6 Weeks',
    durationSw: 'Wiki 6',
    modulesEn: ['Child health and pediatric CPR', 'Elderly assistance & hygiene', 'Administering basic medication', 'Hospital referral workflows'],
    modulesSw: ['Afya ya mtoto na huduma ya dharura ya CPR', 'Usaidizi wa wazee na usafi', 'Utoaji wa dawa za kimsingi', 'Michakato ya rufaa ya hospitali'],
    enrolledUsers: [],
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c5',
    titleEn: 'Art of Baking and Pastry Making',
    titleSw: 'Sanaa ya Kuoka na Utengenezaji wa Keki',
    category: 'Baking',
    trainerName: 'Chef Mary Njeri',
    descriptionEn: 'Bread making, decorative wedding cakes, cookies, and managing a home bakery business.',
    descriptionSw: 'Utengenezaji wa mkate, keki za harusi, biskuti, na usimamizi wa biashara ya kuoka nyumbani.',
    durationEn: '5 Weeks',
    durationSw: 'Wiki 5',
    modulesEn: ['Oven safety and basic doughs', 'Yeast breads & sweet pastries', 'Cake decorating & frosting techniques', 'Costing and scaling production'],
    modulesSw: ['Usalama wa oveni na unga wa kimsingi', 'Mikate ya chachu na keki tamu', 'Kupamba keki na mbinu za krimu', 'Kukadiria gharama na kuongeza uzalishaji'],
    enrolledUsers: [],
    image: '/src/assets/images/baking_class_1782806983595.jpg'
  },
  {
    id: 'c6',
    titleEn: 'Digital Literacy & Online Freelancing',
    titleSw: 'Ujuzi wa Kidijitali na Kazi za Mtandaoni',
    category: 'Digital Skills',
    trainerName: 'David Omwamba',
    descriptionEn: 'Learn basic computer skills, internet safety, smartphone business usage, and social media marketing.',
    descriptionSw: 'Jifunze ujuzi wa kimsingi wa kompyuta, usalama wa mtandao, matumizi ya simu kwa biashara na masoko.',
    durationEn: '4 Weeks',
    durationSw: 'Wiki 4',
    modulesEn: ['Computer basics & typing', 'Internet navigation and email', 'Creating flyers with Canva', 'Starting a virtual assistant career'],
    modulesSw: ['Misingi ya kompyuta na kupiga chapa', 'Kutumia mtandao na barua pepe', 'Kutengeneza vipeperushi kwa Canva', 'Kuanzisha kazi ya usaidizi wa mtandaoni'],
    enrolledUsers: [],
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c7',
    titleEn: 'Micro-Entrepreneurship & Financial Literacy',
    titleSw: 'Ujasiriamali Mdogo na Maarifa ya Fedha',
    category: 'Entrepreneurship',
    trainerName: 'Elizabeth Kwamboka',
    descriptionEn: 'Master financial bookkeeping, launching small businesses with low capital, and managing savings.',
    descriptionSw: 'Mudu utunzaji wa hesabu za fedha, kuanzisha biashara ndogo kwa mtaji mdogo, na usimamizi wa akiba.',
    durationEn: '4 Weeks',
    durationSw: 'Wiki 4',
    modulesEn: ['Personal budgeting vs. Business finance', 'Registering a micro-enterprise', 'Basic sales & customer service', 'Accessing micro-credits and grants'],
    modulesSw: ['Kupanga bajeti binafsi dhidi ya biashara', 'Kusajili biashara ndogo', 'Mauzo ya kimsingi na huduma kwa wateja', 'Kupata mikopo midogo na ruzuku'],
    enrolledUsers: [],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    titleEn: 'Daycare Supervisor & Caregiver',
    titleSw: 'Msimamizi wa Kituo cha Kulelea Watoto',
    company: 'Tiny Tots Daycare Center',
    location: 'Westlands, Nairobi',
    salary: 'KES 25,000 / month',
    type: 'Full-time',
    descriptionEn: 'Seeking a compassionate mother with caregiving training to supervise toddler groups, coordinate safety plans, and lead daytime learning plays.',
    descriptionSw: 'Tunatafuta mama mwenye upendo aliyepitia mafunzo ya utoaji huduma kusimamia watoto, kuratibu usalama, na kuongoza michezo ya kujifunza.',
    requirementsEn: ['Certified Caregiving course', 'Patience and gentle demeanor', 'Fluent in English and Swahili', 'First Aid certification is an asset'],
    requirementsSw: ['Cheti cha mafunzo ya Utoaji Huduma', 'Uvumilivu na tabia ya upole', 'Fasaha wa Kiingereza na Kiswahili', 'Cheti cha Huduma ya Kwanza kitazingatiwa'],
    postedBy: 'employer_user',
    applicants: []
  },
  {
    id: 'j2',
    titleEn: 'Assistant Tailor / Seamstress',
    titleSw: 'Msaidizi wa Ushonaji (Mshonaji)',
    company: 'Zari Fashion Hub',
    location: 'Mombasa Road, Nairobi',
    salary: 'KES 18,000 - 22,000 / month',
    type: 'Full-time',
    descriptionEn: 'Work with our head designer to cut materials, finish hand-embroidery, and sew base garments using industrial sewing machines.',
    descriptionSw: 'Fanya kazi na mbunifu wetu mkuu kukata vitambaa, kumalizia urembo wa mkono, na kushona nguo kwa mashine ya viwandani.',
    requirementsEn: ['Basic tailoring skills', 'Attention to details', 'Ability to meet tight delivery deadlines'],
    requirementsSw: ['Ujuzi wa kimsingi wa ushonaji', 'Makini na maelezo madogo', 'Uwezo wa kukamilisha kazi kwa wakati'],
    postedBy: 'employer_user',
    applicants: []
  },
  {
    id: 'j3',
    titleEn: 'Home Bakery Assistant',
    titleSw: 'Msaidizi wa Kuoka Nyumbani',
    company: 'Sweet Bites Bakeries',
    location: 'Kisumu Town',
    salary: 'KES 700 / day',
    type: 'Part-time',
    descriptionEn: 'Help mix doughs, operate ovens, pack bakery items safely, and handle over-the-counter customer orders during morning hours.',
    descriptionSw: 'Saidia kuchanganya unga, kuendesha oveni, kufungasha mikate kwa usalama, na kushughulikia maagizo ya wateja asubuhi.',
    requirementsEn: ['Baking course certificate', 'Excellent hygiene habits', 'Friendly client approach'],
    requirementsSw: ['Cheti cha kozi ya kuoka', 'Tabia nzuri za usafi', 'Mbinu rafiki kwa wateja'],
    postedBy: 'employer_user2',
    applicants: []
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    titleEn: 'Handwoven Sisal Kiondo Bag (Teal Motif)',
    titleSw: 'Kikapu cha Katani Kilichosukwa kwa Mkono',
    price: 1500,
    sellerId: 'mother_user_1',
    sellerName: 'Wairimu Handmade Crafts',
    sellerPhone: '+254 722 111 222',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    descriptionEn: 'Beautifully durable kiondo basket woven by hand with natural sisal and customized leather straps. Ideal for grocery shopping and casual wear.',
    descriptionSw: 'Kikapu kizuri cha kiondo kilichosukwa kwa mkono na katani asilia na mikanda ya ngozi. Kizuri kwa ununuzi na matembezi.',
    category: 'Crafts',
    approved: true
  },
  {
    id: 'p2',
    titleEn: 'Organic Eucalyptus Handwash Liquid (5L)',
    titleSw: 'Sabuni ya Maji ya Eucalyptus (Lita 5)',
    price: 850,
    sellerId: 'mother_user_2',
    sellerName: 'Beatrice Healing Soaps',
    sellerPhone: '+254 733 444 555',
    image: 'https://images.unsplash.com/photo-1607006342411-b01362079919?auto=format&fit=crop&w=600&q=80',
    descriptionEn: 'Eco-friendly and antibacterial handwashing liquid formulated from plant-based glycerin and scented with pure eucalyptus essential oil.',
    descriptionSw: 'Sabuni ya maji isiyodhuru mazingira na inayoua wadudu iliyotengenezwa kwa glycerin ya mimea na manukato ya mti wa eucalyptus.',
    category: 'Soaps',
    approved: true
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'ev1',
    titleEn: 'Trauma & Resilience Support Circle',
    titleSw: 'Kikundi cha Kusaidiana na Kupona Jeraha',
    date: '2026-07-05',
    time: '14:00 - 16:00',
    location: 'EmpowerHer Safe Space Hall, Nairobi',
    type: 'support-group',
    descriptionEn: 'A safe, therapist-guided circle for single mothers sharing healing journeys and practicing deep breathing exercises.',
    descriptionSw: 'Kikundi salama kinachoongozwa na mwanasaikolojia kwa akina mama kubadilishana safari zao za uponyaji na kufanya mazoezi ya kupumua.'
  },
  {
    id: 'ev2',
    titleEn: 'Micro-Grants & Seed Funding Webinar',
    titleSw: 'Semina ya Mtandaoni kuhusu Ruzuku Ndogo',
    date: '2026-07-12',
    time: '10:00 - 12:00',
    location: 'Virtual Zoom / YouTube Live',
    type: 'webinar',
    descriptionEn: 'Join financial experts as they detail how to apply for the KES 50,000 EmpowerHer Seed Fund to launch your business.',
    descriptionSw: 'Ungana na wataalamu wa fedha wakieleza jinsi ya kuomba ruzuku ya KES 50,000 kuanzisha biashara yako.'
  }
];

export const INITIAL_DONATION_CAMPS: DonationCamp[] = [
  {
    id: 'd1',
    titleEn: 'Sponsor a Mother\'s Sewing Machine',
    titleSw: 'Mpatie Mama Mashine ya Kushona (Cherehani)',
    descriptionEn: 'Each manual butterfly sewing machine costs KES 12,000. Your donation directly equips a tailoring graduate with the tool of independence.',
    descriptionSw: 'Cherehani ya mkono inagharimu KES 12,000. Mchango wako unampatia mhitimu wa ushonaji chombo cha uhuru wake wa kiuchumi.',
    goal: 120000,
    raised: 72000,
    supporters: 18,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'd2',
    titleEn: 'Safe House Nutrition & Infant Formula Fund',
    titleSw: 'Mfuko wa Lishe wa Nyumba Salama na Maziwa ya Watoto',
    descriptionEn: 'Supporting abandoned mothers with infants in our rescue shelter by buying fresh milk, vegetables, and sanitary supplies.',
    descriptionSw: 'Kusaidia akina mama waliotelekezwa wenye watoto wachanga katika nyumba yetu salama kwa kununua maziwa, mboga na taulo za kike.',
    goal: 200000,
    raised: 154000,
    supporters: 42,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 's1',
    name: 'Mercy Aoko',
    titleEn: 'From Abandonment to Boutique Owner',
    titleSw: 'Kutoka Kutelekezwa hadi Kuwa Mmiliki wa Duka la Nguo',
    contentEn: 'Mercy was left alone in poverty with two kids. After completing the Tailoring and Entrepreneurship courses here, she acquired a sewing machine, started sewing custom bags, and now operates a profitable fashion stall employing two other mothers.',
    contentSw: 'Mercy aliachwa peke yake katika umaskini na watoto wawili. Baada ya kumaliza kozi za Ushonaji na Ujasiriamali, alipata cherehani, akaanza kushona mikoba, na sasa anamiliki duka la nguo akiajiri akina mama wengine wawili.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 's2',
    name: 'Phyllis Mwende',
    titleEn: 'Healing Trauma Through Soap Formulation',
    titleSw: 'Kupona Majeraha kwa Utengenezaji wa Sabuni',
    contentEn: 'Phyllis fled severe domestic violence. She joined the Counseling circle, learned organic soap making, and created "Mwende Organics". Today, she distributes quality detergents to three local estates and maintains stable savings for her child\'s secondary school fees.',
    contentSw: 'Phyllis alikimbia unyanyasaji mkali wa nyumbani. Alijiunga na ushauri nasaha, akajifunza utengenezaji sabuni na kuanzisha "Mwende Organics". Leo anasambaza sabuni katika maeneo matatu na kuhifadhi akiba ya karo.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Jane Sang',
    specialtyEn: 'Clinical Psychologist & Emotional Resilience',
    specialtySw: 'Mwanasaikolojia wa Kliniki na Ustahimilivu wa Kihisia',
    location: 'Nairobi',
    bioEn: 'Over 15 years facilitating safe healing circles for women overcoming trauma.',
    bioSw: 'Zaidi ya miaka 15 akiongoza vikundi vya uponyaji vya akina mama waliokumbana na unyanyasaji.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    matchingMothers: []
  },
  {
    id: 'm2',
    name: 'Zipporah Waithera',
    specialtyEn: 'Retail Business Management & Sourcing',
    specialtySw: 'Usimamizi wa Biashara Ndogondogo na Masoko',
    location: 'Thika',
    bioEn: 'Successful entrepreneur who grew her business from a backyard sewing unit to a regional label.',
    bioSw: 'Mjasiriamali aliyefanikiwa kukuza biashara ya nguo kutoka nyumbani kwake hadi soko la kitaifa.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    matchingMothers: []
  }
];
