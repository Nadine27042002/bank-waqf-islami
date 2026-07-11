import React, { useState, useEffect } from 'react';
import { Project, Page, User } from '../../types';
import { WaqfCertificate } from '../WaqfCertificate';
import { IslamicPattern } from '../IslamicPattern';
import { LucideIcon } from '../LucideIcon';

interface WaqfPageProps {
  onNavigatePage: (page: Page) => void;
  selectedProject: Project | null;
  onRecordContribution: (projectName: string, amount: number) => void;
  projectsList: Project[];
  user: User | null;
}

export const WaqfPage: React.FC<WaqfPageProps> = ({
  onNavigatePage,
  selectedProject,
  onRecordContribution,
  projectsList,
  user,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [email, setEmail] = useState(user ? user.email : '');
  
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  const [waqfTarget, setWaqfTarget] = useState('وقف رعاية الاسرة والطفولة');
  const [amount, setAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTargetProject, setSelectedTargetProject] = useState('البنك الوقفي العام');

  // Payment Form Simulation States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Validation / Error States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Declare covenant accepted
  const [covenantAccepted, setCovenantAccepted] = useState(false);

  // Specified Waqf targets (جهات الوقف / شروط الواقف)
  const waqfTargetsList = [
    'وقف رعاية الاسرة والطفولة',
    'وقف على رعاية الايتام',
    'وقف العلم',
    'وقف على الصحة',
    'وقف على خدمة القرأن والسنة',
    'وقف رعاية المساجد',
    'وقف على البيئة',
    'وقف على خدمة المجتمع'
  ];

  useEffect(() => {
    if (selectedProject) {
      setSelectedTargetProject(selectedProject.title);
      // Map category to best target option
      const categoryMap: { [key: string]: string } = {
        educational: 'وقف العلم',
        health: 'وقف على الصحة',
        agricultural: 'وقف على البيئة',
        social: 'وقف على خدمة المجتمع'
      };
      setWaqfTarget(categoryMap[selectedProject.category] || 'وقف رعاية الاسرة والطفولة');
    } else if (projectsList.length > 0) {
      setSelectedTargetProject(projectsList[0].title);
    }
  }, [selectedProject, projectsList]);

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim() && !isAnonymous) {
      newErrors.fullName = "الرجاء إدخال الاسم الكامل لإصدار الحجة الوقوفية الموثقة";
    }
    if (!phone.trim()) {
      newErrors.phone = "الرجاء إدخال رقم الهاتف للتواصل";
    } else if (!/^\+?[\d\s-]{8,15}$/.test(phone)) {
      newErrors.phone = "نأمل إدخال رقم هاتف صحيح";
    }
    if (!email.trim()) {
      newErrors.email = "الرجاء إدخال البريد الإلكتروني لإرسال السندات";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "يرجى كتابة بريد إلكتروني منطقي";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!covenantAccepted) {
      newErrors.covenant = "يجب الموافقة والإقرار بشرط الواقف وتسبيل المنفعة لربط العقد";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: { [key: string]: string } = {};
    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = "الرجاء إرسال رقم بطاقة مكوّن من ١٦ خانة";
      }
      if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = "أدخل صيغة تاريخ صحيحة (MM/YY)";
      }
      if (!cardCVC.trim() || cardCVC.length < 3) {
        newErrors.cardCVC = "أدخل رمز التحقق (3 أرقام)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (amount <= 0) {
        setErrors({ amount: 'يرجى كتابة مبلغ يتجاوز الصفر لتثبيت السهم الوقفي الرقمي' });
      } else {
        setErrors({});
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep1()) {
        setStep(3);
      }
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as any);
      setErrors({});
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectTitle: selectedTargetProject,
          amount: amount,
          donorName: fullName,
          email: email,
          phone: phone,
          isAnonymous: isAnonymous,
          waqfTarget: waqfTarget
        })
      });

      if (response.ok) {
        onRecordContribution(selectedTargetProject, amount);
      } else {
        throw new Error('Failed to record contribution in backend');
      }
    } catch (err) {
      console.warn("Backend donation API failed, recording in local state instead", err);
      // Fallback: call parent to record locally
      onRecordContribution(selectedTargetProject, amount);
    } finally {
      setLoading(false);
      setIsCompleted(true);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsCompleted(false);
    setFullName(user ? user.name : '');
    setPhone(user ? user.phone || '' : '');
    setEmail(user ? user.email : '');
    setCardNumber('');
    setCardExpiry('');
    setCardCVC('');
    setCovenantAccepted(false);
  };

  // Pre-configured templates sums
  const amountPresets = [50, 100, 500, 1000, 2500, 5000];

  if (isCompleted) {
    return (
      <div className="pt-28 pb-16 min-h-screen bg-[#F9F6F0]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex py-2 px-6 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] font-sans font-bold text-sm items-center gap-2 mb-4 shadow-xs">
            <LucideIcon name="CheckCircle2" size={16} />
            <span>نفع الله بصدقتكم وأجزل لكم المثوبة</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1B5E20]">اكتمل إصدار الصدقة الجارية</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            تم تسجيل السهم الوقفي الرقمي المبارك باسمكم وتوجيه التمويل للمصرف المخصص بنجاح كامل وصممت هذه شهادة الصدقة الجارية الرسمية.
          </p>

          <WaqfCertificate
            donorName={isAnonymous ? "واقف خير مجهول" : fullName}
            amount={amount}
            waqfTypeOrProject={`${waqfTarget} لصالح (${selectedTargetProject})`}
            onReset={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9F6F0] pt-28 pb-16 text-right" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Page Titles */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#C9A84C] tracking-wider uppercase font-mono">المنصة الوقفية الرقمية - شروط الواقف</span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#1B5E20] font-sans mt-2">أوقف الآن</h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
            حدد وجهة الوقف (شروط الواقف) وساهم بخطوات بسيطة مشفرة وآمنة في حبس الأصول وتوجيه الريع لتنمية الفئات المستهدفة.
          </p>
        </div>

        {/* Dynamic Nav Wizard Header */}
        <div className="bg-white rounded-xl py-4 px-6 md:px-8 shadow-sm border border-slate-100 flex justify-between items-center mb-8 select-none">
          {[
            { label: 'شروط الواقف والمبلغ', step: 1 },
            { label: 'البيانات الشخصية', step: 2 },
            { label: 'مراجعة الميثاق', step: 3 },
            { label: 'الدفع والتأكيد', step: 4 },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                step === item.step 
                  ? 'bg-[#1B5E20] text-white ring-4 ring-[#1B5E20]/20'
                  : step > item.step 
                  ? 'bg-[#C9A84C] text-[#1B5E20]' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {item.step}
              </span>
              <span className={`text-[11px] md:text-xs font-bold hidden sm:inline ${
                step === item.step ? 'text-[#1B5E20]' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Multi-Step Form Card Wrapper */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-100 relative min-h-[400px] flex flex-col justify-between">
          <IslamicPattern opacity={0.03} color="#C9A84C" />
          
          <div className="relative z-10 flex-1">
            
            {/* STEP 1: CHOOSE WAQF SECTOR AND AMOUNT */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in text-right">
                <div className="border-b border-rose-50 pb-3">
                  <h3 className="text-lg font-bold text-[#1B5E20]">جهة الوقف (شروط الواقف) وقيمة السهم</h3>
                  <p className="text-xs text-slate-400 mt-1">اختر الجهة المستحقة لريع الوقف حسب رغبتك وشروطك الوقوفية، وحدد القيمة المالية للمساهمة.</p>
                </div>

                <div className="space-y-4">
                  {/* Category select grid with gorgeous icons and descriptions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">حدد جهة الوقف (شرط الواقف):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                      {waqfTargetsList.map((target) => {
                        const targetDetails: { [key: string]: { icon: string; desc: string; bg: string } } = {
                          'وقف رعاية الاسرة والطفولة': { icon: 'Users', desc: 'دعم الأسر المنتجة ورعاية وحماية الأمهات والطفل', bg: 'bg-indigo-50/50' },
                          'وقف على رعاية الايتام': { icon: 'Heart', desc: 'كفالة شاملة لليتيم تعليماً ومعيشة وتربية ورعاية نفسية واجتماعية', bg: 'bg-red-50/50' },
                          'وقف العلم': { icon: 'GraduationCap', desc: 'تمويل المنح الدراسية والبحوث والمنصات التعليمية الرقمية', bg: 'bg-emerald-50/50' },
                          'وقف على الصحة': { icon: 'HeartPulse', desc: 'توفير الأدوية والأجهزة الطبية وعلاج المرضى وتطوير خدمات الرعاية', bg: 'bg-rose-50/50' },
                          'وقف على خدمة القرأن والسنة': { icon: 'BookOpen', desc: 'طباعة وتوزيع المصاحف، وكفالة الحلقات والتعليم الشرعي', bg: 'bg-amber-50/50' },
                          'وقف رعاية المساجد': { icon: 'Building', desc: 'عمارة المساجد وصيانتها وتجهيزها بالمرافق الحديثة الذكية', bg: 'bg-blue-50/50' },
                          'وقف على البيئة': { icon: 'Sprout', desc: 'مشاريع التشجير وتوفير المياه وحلول الطاقة البديلة المستدامة', bg: 'bg-teal-50/50' },
                          'وقف على خدمة المجتمع': { icon: 'Home', desc: 'المشاريع الاجتماعية والخيرية العامة ومكافحة الفقر وتحسين المعيشة', bg: 'bg-purple-50/50' }
                        };
                        const details = targetDetails[target] || { icon: 'Heart', desc: 'المشاريع والخيرات الوقفية العامة', bg: 'bg-slate-50' };
                        const isSelected = waqfTarget === target;

                        return (
                          <button
                            key={target}
                            type="button"
                            onClick={() => setWaqfTarget(target)}
                            className={`p-4 rounded-xl border text-right transition-all flex items-start gap-3 select-none relative ${
                              isSelected
                                ? 'bg-[#1B5E20]/5 border-[#1B5E20] text-[#1B5E20] ring-2 ring-[#1B5E20]/10 shadow-xs'
                                : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50'
                            }`}
                          >
                            <div className={`p-2 rounded-lg shrink-0 ${
                              isSelected ? 'bg-[#1B5E20]/10 text-[#1B5E20]' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <LucideIcon name={details.icon} size={20} />
                            </div>
                            
                            <div className="flex-1 min-w-0 pr-1">
                              <h4 className="text-sm font-extrabold leading-tight text-slate-800">{target}</h4>
                              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{details.desc}</p>
                            </div>

                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-[#1B5E20] flex items-center justify-center text-white absolute left-3 top-3">
                                <LucideIcon name="Check" size={12} />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-slate-200 absolute left-3 top-3"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project specific dropdown mapping */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="sel-target-project">تخصيص الصرف للمشروع وقفي نشط معين (اختياري):</label>
                    <select
                      id="sel-target-project"
                      value={selectedTargetProject}
                      onChange={(e) => setSelectedTargetProject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B5E20]"
                    >
                      <option value="البنك الوقفي العام">محفظة البنك الوقفي العام</option>
                      {projectsList.map((p) => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preset donation templates */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700">القيمة المالية الموقوفة:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {amountPresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAmount(preset);
                            setErrors({});
                          }}
                          className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-all ${
                            amount === preset
                              ? 'bg-[#1B5E20] border-[#C9A84C] text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {preset.toLocaleString('ar-EG')} د.ج
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount editor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="num-amount">قيمة مخصصة أخرى (بالدينار الجزائري د.ج):</label>
                    <input
                      type="number"
                      id="num-amount"
                      min={10}
                      value={amount || ''}
                      onChange={(e) => {
                        setAmount(parseInt(e.target.value) || 0);
                        setErrors({});
                      }}
                      placeholder="أدخل مبلغ وقفك بالدينار الجزائري"
                      className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B5E20] font-mono text-center transition-colors ${
                        errors.amount ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    {errors.amount && <p className="text-xs text-red-500 font-medium mt-1">{errors.amount}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PERSONAL DETAILS */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in text-right">
                <div className="border-b border-rose-50 pb-3">
                  <h3 className="text-lg font-bold text-[#1B5E20]">البيانات الشخصية للواقف</h3>
                  <p className="text-xs text-slate-400 mt-1">تستخدم هذه البيانات فقط لتوثيق الشهادة وإرسال تقارير استثمارات الوقف ربع السنوية.</p>
                </div>

                <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-orange-50/50 border border-orange-100 text-amber-800 text-xs text-right">
                  <LucideIcon name="ShieldCheck" size={18} className="text-[#C9A84C] shrink-0" />
                  <p>تلتزم الإدارة التزاماً غليظاً بالسرية المطلقة للمانحين، ويمكنك حجب ظهور اسمك باختيار "فاعل خير" ليكون الوقف خفياً.</p>
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="chk-anonymous"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) {
                        setFullName('فاعل خير');
                        // Clean up errors
                        if (errors.fullName) {
                          setErrors(prev => {
                            const copy = { ...prev };
                            delete copy.fullName;
                            return copy;
                          });
                        }
                      } else {
                        setFullName('');
                      }
                    }}
                    className="w-4 h-4 text-[#1B5E20] focus:ring-[#1B5E20] accent-[#1B5E20] cursor-pointer"
                  />
                  <label htmlFor="chk-anonymous" className="text-xs font-extrabold text-slate-700 cursor-pointer">
                    المساهمة دون الإفصاح عن الهوية (صدقة جارية في الخفاء)
                  </label>
                </div>

                <div className="space-y-4">
                  {!isAnonymous && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="txt-full-name">الاسم الثلاثي المكتوب في حجة الوقف:</label>
                      <input
                        type="text"
                        id="txt-full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثال: صالح بن سليمان الراجحي"
                        className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B5E20] transition-colors ${
                          errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {errors.fullName && <p className="text-xs text-red-500 font-medium mt-1">{errors.fullName}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="txt-phone">رقم الجوال:</label>
                      <input
                        type="tel"
                        id="txt-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="مثال: +213555555555"
                        className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B5E20] transition-colors ${
                          errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="txt-email">البريد الإلكتروني للشهادة والسند:</label>
                      <input
                        type="email"
                        id="txt-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@waqfitek.com"
                        className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B5E20] transition-colors ${
                          errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: COVENANT & CONTRACT REVIEW */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in text-right">
                <div className="border-b border-rose-50 pb-3">
                  <h3 className="text-lg font-bold text-[#1B5E20]">مراجعة المساهمة وصياغة حجة الوقف</h3>
                  <p className="text-xs text-slate-400 mt-1">طالع مراجعة مخرجات مساهمتك الشرعية قبل تسبيل الأجر وحبس النقد الرقمي.</p>
                </div>

                <div className="bg-[#F9F6F0]/80 border border-[#1B5E20]/10 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-[#1B5E20] border-b border-[#1B5E20]/10 pb-1 uppercase tracking-wider">سند الصدقة الجارية المحبّسة:</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">الواقف الشريف:</span>
                      <strong className="text-slate-800 text-sm">{isAnonymous ? "فاعل خير مجهول" : fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">شرط الواقف (المصرف):</span>
                      <strong className="text-[#1B5E20] text-sm">{waqfTarget}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">توجيه الصرف المستهدف:</span>
                      <strong className="text-slate-800 text-sm line-clamp-1">{selectedTargetProject}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">قيمة الحبس الوقفي الرقمي:</span>
                      <strong className="text-[#C9A84C] text-[15px] font-mono font-black">{amount.toLocaleString('ar-EG')} د.ج (دينار جزائري)</strong>
                    </div>
                  </div>
                </div>

                {/* Covenant Declaration */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="chk-covenant"
                      checked={covenantAccepted}
                      onChange={(e) => setCovenantAccepted(e.target.checked)}
                      className="w-5 h-5 mt-0.5 text-[#1B5E20] focus:ring-[#1B5E20] accent-[#1B5E20] cursor-pointer shrink-0"
                    />
                    <label htmlFor="chk-covenant" className="text-xs text-slate-700 leading-relaxed cursor-pointer font-medium">
                      أُشهد الله العلي العظيم وأقر بأنني وهبت هذا المبلغ تبرعاً جازماً لا رجعة فيه للبنك الوقفي الرقمي (وقفي تك)، ليكون <span className="text-[#1B5E20] font-bold">أصلاً وقفياً محبساً ومؤبداً</span> وفق شروطي الوقفية المذكورة، يصرف ريعه وعائداته الاستثمارية في أوجه البر الشرعي بضوابط الهيئة الشرعية للبنك.
                    </label>
                  </div>
                  {errors.covenant && <p className="text-xs text-red-500 font-medium mt-1">{errors.covenant}</p>}
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT AND CONFIRMATION */}
            {step === 4 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in text-right">
                <div className="border-b border-rose-50 pb-3">
                  <h3 className="text-lg font-bold text-[#1B5E20]">بوابة الدفع التكافلي المشفرة</h3>
                  <p className="text-xs text-slate-400 mt-1">تعبأ البيانات عبر خادم البنك الوقفي الآمن والمحمي بالكامل لتمرير عملية التحويل الرقمي.</p>
                </div>

                {/* Simulated payment type switch */}
                <div className="grid grid-cols-3 gap-3">
                  {['card', 'cib', 'dahabia'].map((method) => (
                    <div
                      key={method}
                      onClick={() => {
                        setPaymentMethod(method);
                        setErrors({});
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'bg-[#1B5E20]/5 border-[#1B5E20] ring-2 ring-[#1B5E20]/10'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {method === 'card' && <span className="text-xs font-bold text-slate-750">بطاقة بنكية دولية</span>}
                      {method === 'cib' && <span className="text-xs font-extrabold text-[#1B5E20]">بطاقة CIB البنكية</span>}
                      {method === 'dahabia' && <span className="text-xs font-serif italic text-amber-600 font-bold">البطاقة الذهبية</span>}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="txt-card-number">رقم البطاقة الائتمانية / الذهبية:</label>
                    <input
                      type="text"
                      id="txt-card-number"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        const matches = v.match(/\d{4,16}/g);
                        const match = (matches && matches[0]) || '';
                        const parts = [];

                        for (let i = 0, len = match.length; i < len; i += 4) {
                          parts.push(match.substring(i, i + 4));
                        }

                        if (parts.length > 0) {
                          setCardNumber(parts.join(' '));
                        } else {
                          setCardNumber(v);
                        }
                        setErrors({});
                      }}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm font-mono text-center tracking-widest focus:outline-none focus:border-[#1B5E20] ${
                        errors.cardNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                      }`}
                    />
                    {errors.cardNumber && <p className="text-xs text-red-500 font-medium mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="txt-expiry">تاريخ الانتهاء:</label>
                      <input
                        type="text"
                        id="txt-expiry"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          }
                          setCardExpiry(val);
                          setErrors({});
                        }}
                        placeholder="MM/YY"
                        className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm font-mono text-center focus:outline-none focus:border-[#1B5E20] ${
                          errors.cardExpiry ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {errors.cardExpiry && <p className="text-xs text-red-500 font-medium mt-1">{errors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="txt-cvc">رمز التحقق الأمني (CVC):</label>
                      <input
                        type="password"
                        id="txt-cvc"
                        maxLength={3}
                        value={cardCVC}
                        onChange={(e) => {
                          setCardCVC(e.target.value.replace(/\D/g, ''));
                          setErrors({});
                        }}
                        placeholder="***"
                        className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm font-mono text-center focus:outline-none focus:border-[#1B5E20] ${
                          errors.cardCVC ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {errors.cardCVC && <p className="text-xs text-red-500 font-medium mt-1">{errors.cardCVC}</p>}
                    </div>
                  </div>
                </div>
              </form>
            )}

          </div>

          {/* Core Navigation controls for multi-step card */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 relative z-10">
            <button
              onClick={handlePrev}
              disabled={step === 1 || loading}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-lg transition-colors ${
                step === 1 || loading
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              السابق
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#1B5E20] text-white hover:bg-[#154619] font-bold text-xs rounded-xl shadow-xs transition-transform flex items-center gap-1"
                id="btn-next-step"
              >
                <span>التالي</span>
                <LucideIcon name="ArrowLeft" size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                id="btn-submit-donation"
                className="px-6 py-3 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:opacity-95 text-[#C9A84C] font-black text-xs rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>جارٍ معالجة الحبس الوقفي...</span>
                  </>
                ) : (
                  <>
                    <LucideIcon name="ShieldCheck" size={16} />
                    <span>تأكيد الوقف والمساهمة ({amount.toLocaleString('ar-EG')} د.ج)</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
