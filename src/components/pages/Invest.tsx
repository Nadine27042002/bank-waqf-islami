import React, { useState } from 'react';
import { IslamicPattern } from '../IslamicPattern';
import { LucideIcon } from '../LucideIcon';

export const Invest: React.FC = () => {
  // Tabs within Invest page: 'sectors' | 'formulas' | 'reports' | 'simulator'
  const [activeTab, setActiveTab] = useState<'sectors' | 'formulas' | 'reports' | 'simulator'>('sectors');

  // Simulator State
  const [sector, setSector] = useState<'industrial' | 'commercial' | 'agricultural' | 'infrastructure'>('industrial');
  const [formula, setFormula] = useState<'musharakah' | 'mudarabah' | 'murabahah' | 'salam' | 'istisna' | 'ijarah' | 'muzaraah'>('musharakah');
  const [amount, setAmount] = useState<number>(1000000); // Default 1M DZD

  // Form Submission State
  const [investorName, setInvestorName] = useState('');
  const [investorPhone, setInvestorPhone] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sector Details
  const sectorsData = [
    {
      id: 'industrial',
      title: 'القطاع الصناعي',
      icon: 'Factory',
      desc: 'تمويل خطوط إنتاج المصانع، شراء العتاد الصناعي، وتطوير البنى التصنيعية لتحقيق الاكتفاء الذاتي.',
      projects: ['مصنع تعليب وتصنيع المواد الغذائية', 'ورشات صناعة عتاد الطاقة الشمسية المتجددة']
    },
    {
      id: 'commercial',
      title: 'القطاع التجاري',
      icon: 'ShoppingBag',
      desc: 'دعم الاستيراد والتصدير للمنتجات الإستراتيجية وتأمين سلاسل الإمداد ومنافذ التوزيع الوطنية.',
      projects: ['مجمع أسواق المواد الاستهلاكية الكبرى', 'شركة الخدمات اللوجستية وتوزيع التجهيزات الطبية']
    },
    {
      id: 'agricultural',
      title: 'القطاع الزراعي',
      icon: 'Sprout',
      desc: 'استصلاح الأراضي، حفر الآبار العميقة، زراعة المحاصيل الإستراتيجية، وإنشاء البيوت البلاستيكية الذكية.',
      projects: ['مزرعة نموذجية للقمح والأعلاف العضوية', 'شبكة توزيع الموارد المائية ومحطات السقي']
    },
    {
      id: 'infrastructure',
      title: 'البنية التحتية',
      icon: 'Globe',
      desc: 'الاستثمار طويل الأجل في تشييد الطرق، بناء المدارس والمستشفيات، وتهيئة مناطق النشاط الصناعي.',
      projects: ['مجمع العيادات الطبية الإستشفائية المتطورة', 'تطوير حظيرة تكنولوجية للأبحاث الرقمية']
    }
  ];

  // Financing Formulas with specific definitions requested by user
  const formulasData = [
    {
      id: 'musharakah',
      title: 'المشاركة',
      def: 'يدخل المستثمر شريكاً معنا في مشروع بنسبة محددة من رأس المال، وبعد تحقيق العائد نتقاسم الأرباح بالنسبة المتفق عليها، ونتحمل الخسائر بحسب نسب المساهمة.',
      icon: 'Users',
      tag: 'الأكثر شعبية في الاستثمار التنموي'
    },
    {
      id: 'mudarabah',
      title: 'المضاربة',
      def: 'يقدم البنك أو المستثمر رأس المال بالكامل، بينما يتولى الطرف الآخر العمل والجهد والإدارة والخبرة، وفي نهاية فترة الاستثمار نتقاسم الأرباح الصافية بنسب محددة متفق عليها مسبقاً.',
      icon: 'Brain',
      tag: 'مبدأ رأس المال والجهد المشترك'
    },
    {
      id: 'murabahah',
      title: 'المرابحة',
      def: 'نقوم بشراء السلعة أو الأصل المطلوب من طرف المستثمر بناءً على مواصفاته، ثم نبيعها له بآجل مع هامش ربح محدد متفق عليه وواضح منذ البداية.',
      icon: 'Coins',
      tag: 'هامش ربح محدد ومضمون شرعاً'
    },
    {
      id: 'salam',
      title: 'بيع السلم',
      def: 'بيع موصوف في الذمة ببدل يعجل دفعه فوراً وتأجيل تسليم السلعة إلى أجل معلوم، وهو ممتاز لتمويل العمليات الزراعية وصغار الفلاحين.',
      icon: 'Calendar',
      tag: 'تمويل زراعي متكامل'
    },
    {
      id: 'istisna',
      title: 'الاستصناع',
      def: 'عقد يطلب فيه شراء سلعة يُصنعها الصانع بمواصفات معينة ومحددة، ممتاز للمشاريع الهندسية والإنشائية والتصنيع الثقيل.',
      icon: 'Hammer',
      tag: 'مناسب لقطاع التشييد والعتاد'
    },
    {
      id: 'ijarah',
      title: 'الإجارة',
      def: 'تمليك منفعة أصل موصوف أو معين لفترة زمنية محددة مقابل عوض معلوم، قد ينتهي بتمليك الأصل للمستثمر.',
      icon: 'Key',
      tag: 'تمويل الأصول والمباني'
    },
    {
      id: 'muzaraah',
      title: 'المزارعة',
      def: 'عقد على استغلال الأرض لإنتاج المحاصيل الزراعية بين صاحب الأرض والعامل، بحيث توزع الثمار بحصص مشاعة متفق عليها.',
      icon: 'Trees',
      tag: 'دعم حقيقي للأمن الغذائي'
    }
  ];

  // Annual Reports Sim Data
  const reportsData = [
    { title: 'التقرير السنوي الشامل للأداء الاستثماري ٢٠٢٥', date: 'مارس ٢٠٢٦', size: '٤.٨ ميجابايت', type: 'PDF' },
    { title: 'تقرير التدقيق الشرعي لقرارات الاستثمار وعقود التمويل', date: 'يناير ٢٠٢٦', size: '٢.١ ميجابايت', type: 'PDF' },
    { title: 'الحصيلة المالية المدققة للبنك الوقفي الرقمي وقائمة التدفقات', date: 'ديسمبر ٢٠٢٥', size: '٣.٥ ميجابايت', type: 'Excel' },
    { title: 'خطة التنمية المستدامة والاستثمار الأخضر ٢٠٢٦-٢٠٣٠', date: 'أبريل ٢٠٢٦', size: '٥.٢ ميجابايت', type: 'PDF' },
  ];

  // Helper calculation for Investment Yield Simulator
  const calculateYield = () => {
    // Basic Sharia compliance simulation: Industrial/Agricultural has higher expected yields but variable.
    let expectedRate = 0.08; // 8%
    if (sector === 'industrial') expectedRate = 0.11; // 11%
    if (sector === 'commercial') expectedRate = 0.09; // 9%
    if (sector === 'agricultural') expectedRate = 0.12; // 12%
    if (sector === 'infrastructure') expectedRate = 0.07; // 7%

    if (formula === 'mudarabah') expectedRate += 0.015; // Higher return potential
    if (formula === 'murabahah') expectedRate = 0.085; // Fixed margin

    const profit = amount * expectedRate;
    const shareBank = profit * 0.4;
    const shareInvestor = profit * 0.6;

    return {
      rate: (expectedRate * 100).toFixed(1),
      totalProfit: Math.round(profit),
      bankProfit: Math.round(shareBank),
      investorProfit: Math.round(shareInvestor),
    };
  };

  const currentYield = calculateYield();

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName.trim() || !investorPhone.trim() || !investorEmail.trim()) {
      alert('الرجاء تعبئة جميع الحقول للتواصل معكم');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleDownload = (title: string) => {
    alert(`تمت محاكاة تحميل ملف: ${title} بنجاح من خوادم وقفي تك الآمنة.`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F6F0] pt-28 pb-16 text-right font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#C9A84C] tracking-wider uppercase font-mono">الاستثمارات التنموية المتوافقة مع الشريعة الغراء</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1B5E20] font-sans mt-2">استثمر معنا</h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-2">
            شراكة تنموية واعدة تدمج الحوكمة الرقمية المعاصرة مع صيغ التمويل الإسلامي الرائدة لتشغيل أصول الوقف وتحقيق نفع متبادل مستدام.
          </p>
        </div>

        {/* Outer Tabs Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-slate-200 pb-4">
          {[
            { id: 'sectors', label: '١. استثمر في (المجالات)', icon: 'Briefcase' },
            { id: 'formulas', label: '٢. استثمر عن طريق (الصيغ الشرعية)', icon: 'Scale' },
            { id: 'simulator', label: 'مُحاكي ومسجّل الاستثمارات', icon: 'Calculator' },
            { id: 'reports', label: '٣. تقارير سنوية مالية', icon: 'FileText' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsSubmitted(false);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1B5E20] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <LucideIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* MAIN DISPLAY BODY CONTAINER */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 relative overflow-hidden">
          <IslamicPattern opacity={0.02} color="#C9A84C" />
          
          <div className="relative z-10">
            
            {/* TAB 1: SECTORS */}
            {activeTab === 'sectors' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-rose-50 pb-4">
                  <h3 className="text-xl font-extrabold text-[#1B5E20]">استثمر في المشاريع الاستراتيجية المطروحة</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    نطرح باقة من المشاريع المختارة بعناية لتمكين المستثمرين من الدخول في شراكات ذات نفع عام وعائد ممتاز.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sectorsData.map((sect) => (
                    <div key={sect.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-[#1B5E20] text-white rounded-xl">
                            <LucideIcon name={sect.icon} size={22} />
                          </div>
                          <h4 className="text-lg font-bold text-[#1B5E20]">{sect.title}</h4>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sect.desc}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100/80">
                        <span className="text-xs font-bold text-slate-400 block mb-2">أمثلة المشاريع النشطة المطروحة:</span>
                        <div className="space-y-1.5">
                          {sect.projects.map((proj, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-800 bg-white py-1.5 px-3 rounded-lg border border-slate-100">
                              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span>
                              <span>{proj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#1B5E20]/5 p-5 rounded-2xl border border-[#1B5E20]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1B5E20]">هل لفت انتباهك قطاع معين؟</h4>
                    <p className="text-xs text-slate-500 mt-1">استخدم المحاكي التفاعلي لتقدير العوائد وتقديم طلب مبدئي للانضمام.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="py-2.5 px-5 bg-[#C9A84C] text-[#1B5E20] hover:bg-[#b0913e] font-extrabold text-xs rounded-xl transition-all shadow-sm"
                  >
                    الانتقال للمحاكي الرقمي
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: FORMULAS */}
            {activeTab === 'formulas' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-rose-50 pb-4">
                  <h3 className="text-xl font-extrabold text-[#1B5E20]">صيغ التمويل والاستثمار الإسلامي الرقمي</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    تتم هندسة العقود قانونياً وشرعياً بواسطة كبار الخبراء لضمان السلامة التامة ومطابقة المعاملات للأحكام الفقهية الشريفة.
                  </p>
                </div>

                {/* Grid of Formulas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formulasData.map((formu) => {
                    // Accent specific popular formulas differently for higher visual quality
                    const isCore = ['musharakah', 'mudarabah', 'murabahah'].includes(formu.id);
                    return (
                      <div
                        key={formu.id}
                        className={`p-6 rounded-2xl border transition-all ${
                          isCore
                            ? 'bg-gradient-to-br from-white to-[#1B5E20]/5 border-[#1B5E20]/20 shadow-md ring-1 ring-[#1B5E20]/5'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-xl ${isCore ? 'bg-[#1B5E20] text-white' : 'bg-[#C9A84C]/20 text-[#1B5E20]'}`}>
                            <LucideIcon name={formu.icon} size={18} />
                          </div>
                          <h4 className="text-base font-bold text-slate-900">{formu.title}</h4>
                        </div>
                        
                        <span className="inline-block bg-[#C9A84C]/10 text-[#C9A84C] text-[9px] font-black py-0.5 px-2 rounded-full mb-3">
                          {formu.tag}
                        </span>

                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {formu.def}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SIMULATOR & APPLICATION */}
            {activeTab === 'simulator' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-rose-50 pb-4">
                  <h3 className="text-xl font-extrabold text-[#1B5E20]">مُحاكي الأرباح والتقديم الاستثماري</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    أدخل بيانات الاستثمار المرغوبة لمعاينة التقاسم التقديري للأرباح حسب الصيغ ونسبة مساهمة وقفي تك الرقمي.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-10 space-y-4 max-w-xl mx-auto animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1B5E20] flex items-center justify-center mx-auto shadow-sm">
                      <LucideIcon name="CheckCircle2" size={32} />
                    </div>
                    <h4 className="text-xl font-extrabold text-[#1B5E20]">تم استلام رغبتكم بنجاح</h4>
                    <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
                      نشكر ثقتكم الفاضلة. لقد تم تقييد طلبكم المبدئي للاستثمار في <strong className="text-slate-800">({sectorsData.find(s => s.id === sector)?.title})</strong> عبر صيغة <strong className="text-[#1B5E20]">({formulasData.find(f => f.id === formula)?.title})</strong> بقيمة <strong className="text-slate-800">{amount.toLocaleString()} د.ج</strong>.
                      سيقوم ممثل من مجلس الأمناء بالتواصل معكم في غضون ٢٤ ساعة عمل لمناقشة العقود والتفاصيل.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setInvestorName('');
                        setInvestorPhone('');
                        setInvestorEmail('');
                      }}
                      className="py-2.5 px-6 bg-[#1B5E20] text-white hover:bg-[#154619] text-xs font-bold rounded-xl shadow-xs"
                    >
                      إجراء محاكاة أخرى
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT: FORMULATOR SLIDERS */}
                    <div className="lg:col-span-7 space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                      
                      {/* 1. Sector Choice */}
                      <div>
                        <label className="block text-xs font-bold text-slate-750 mb-2">١. حدد القطاع الاستثماري المستهدف:</label>
                        <div className="grid grid-cols-2 gap-2">
                          {sectorsData.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSector(s.id as any)}
                              className={`p-3 rounded-xl border text-right text-xs font-bold transition-all ${
                                sector === s.id
                                  ? 'bg-[#1B5E20]/5 border-[#1B5E20] text-[#1B5E20] ring-1 ring-[#1B5E20]/10'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{s.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Formula Choice */}
                      <div>
                        <label className="block text-xs font-bold text-slate-750 mb-2">٢. اختر صيغة التمويل الإسلامي:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {formulasData.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setFormula(f.id as any)}
                              className={`p-2.5 rounded-xl border text-center text-xs font-extrabold transition-all ${
                                formula === f.id
                                  ? 'bg-[#1B5E20] border-[#1B5E20] text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span>{f.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Amount Input Slider */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">٣. حدد القيمة المالية المستهدفة للاستثمار:</span>
                          <span className="text-[#C9A84C] font-mono font-black">{amount.toLocaleString()} د.ج</span>
                        </div>
                        <input
                          type="range"
                          min={200000}
                          max={50000000}
                          step={100000}
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>٢٠٠,٠٠٠ د.ج</span>
                          <span>٥٠,٠٠٠,٠٠٠ د.ج</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: LIVE PROJECTIONS & SUBMISSION */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Yield Projections Display Card */}
                      <div className="bg-gradient-to-b from-[#1B5E20] to-[#154619] text-white p-6 rounded-2xl shadow-md border border-[#1B5E20]/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-[#C9A84C]/10 rounded-full filter blur-xl pointer-events-none"></div>
                        
                        <h4 className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">دراسة الجدوى التقديرية ربع السنوية:</h4>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70">العائد السنوي المتوقع للمشروع:</span>
                            <span className="text-base font-mono font-black text-[#C9A84C]">~ {currentYield.rate}%</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70">إجمالي صافي الربح السنوي المتوقع:</span>
                            <span className="text-sm font-mono font-bold text-white">{currentYield.totalProfit.toLocaleString()} د.ج</span>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <span className="text-xs text-[#C9A84C]">نصيب المستثمر الشريك (٦٠٪):</span>
                            <strong className="text-lg font-mono font-black text-[#C9A84C]">{currentYield.investorProfit.toLocaleString()} د.ج</strong>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/60">نصيب وقفي تك الرقمي (٤٠٪):</span>
                            <span className="text-xs font-mono font-bold text-white/80">{currentYield.bankProfit.toLocaleString()} د.ج</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-white/50 text-center mt-6">
                          * هذه أرقام تقديرية قابلة للربح والخسارة وفقاً للممارسات الفعلية في الاقتصاد الإسلامي الحقيقي.
                        </p>
                      </div>

                      {/* Instant Investor Application form */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide border-b border-rose-50 pb-2">طلب قيد مبدئي كمستثمر:</h4>
                        
                        <form onSubmit={handleApplicationSubmit} className="space-y-3">
                          <div>
                            <input
                              type="text"
                              value={investorName}
                              onChange={(e) => setInvestorName(e.target.value)}
                              placeholder="اسمكم الكريم أو اسم الشركة"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B5E20]"
                              required
                            />
                          </div>

                          <div>
                            <input
                              type="tel"
                              value={investorPhone}
                              onChange={(e) => setInvestorPhone(e.target.value)}
                              placeholder="رقم الهاتف الفعال"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B5E20]"
                              required
                            />
                          </div>

                          <div>
                            <input
                              type="email"
                              value={investorEmail}
                              onChange={(e) => setInvestorEmail(e.target.value)}
                              placeholder="البريد الإلكتروني المهني"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B5E20]"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-[#1B5E20] hover:bg-[#154619] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {loading ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>جارٍ توجيه الطلب الآمن...</span>
                              </>
                            ) : (
                              <span>تقديم طلب الاستثمار الشرعي</span>
                            )}
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ANNUAL REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-rose-50 pb-4">
                  <h3 className="text-xl font-extrabold text-[#1B5E20]">التقارير المالية والشرعية السنوية</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    نلتزم بقمة مستويات الإفصاح والشفافية التامة، ونوفر لمستثمرينا وشركائنا تقارير تدقيقية دورية وموثقة.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportsData.map((rep, idx) => (
                    <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center hover:shadow-sm transition-shadow">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 py-0.5 px-2 rounded-full inline-block">
                          {rep.type}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{rep.title}</h4>
                        <div className="flex gap-4 text-[11px] text-slate-400">
                          <span>نشر: {rep.date}</span>
                          <span>الحجم: {rep.size}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(rep.title)}
                        className="p-3 bg-white hover:bg-[#1B5E20]/5 text-[#1B5E20] border border-slate-250 rounded-xl transition-colors cursor-pointer"
                        title="تحميل الملف"
                      >
                        <LucideIcon name="Download" size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Simulated Visual Performance Chart */}
                <div className="bg-slate-50/40 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-750 uppercase tracking-wider">نمو استثمارات المحفظة والعوائد السنوية (المُحققة):</h4>
                  
                  <div className="grid grid-cols-4 gap-4 items-end h-40 pt-6 px-4 border-b border-slate-200">
                    {[
                      { year: '٢٠٢٢', amount: '٤.٢ مليار', height: 'h-[35%]', yield: '٦.٨٪' },
                      { year: '٢٠٢٣', amount: '٧.٥ مليار', height: 'h-[60%]', yield: '٧.٥٪' },
                      { year: '٢٠٢٤', amount: '١٢.٨ مليار', height: 'h-[80%]', yield: '٨.٢٪' },
                      { year: '٢٠٢٥', amount: '٢١.٤ مليار', height: 'h-[100%]', yield: '٩.١٪' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] text-[#C9A84C] font-mono font-bold">{item.yield}</span>
                        <div className={`w-full max-w-[40px] bg-gradient-to-t from-[#1B5E20] to-[#2E7D32] rounded-t-lg transition-all duration-500 hover:opacity-90 relative group cursor-pointer ${item.height}`}>
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-1 px-2 rounded whitespace-nowrap transition-opacity z-10 font-bold">
                            إجمالي الأصول: {item.amount}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 mt-1">{item.year}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    * الحصيلة المالية بالدينار الجزائري وتخضع لتدقيق مفوض الحسابات المالي المستقل وهيئة التدقيق الفقهية الشرعية.
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
