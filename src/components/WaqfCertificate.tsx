import React from 'react';
import { IslamicPattern, IslamicBorder } from './IslamicPattern';
import { LucideIcon } from './LucideIcon';

interface WaqfCertificateProps {
  donorName: string;
  amount: number;
  waqfTypeOrProject: string;
  onReset: () => void;
}

export const WaqfCertificate: React.FC<WaqfCertificateProps> = ({
  donorName,
  amount,
  waqfTypeOrProject,
  onReset,
}) => {
  const formattedAmount = new Intl.NumberFormat('ar-DZ', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount) + ' د.ج';

  const currentDate = new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'long',
    calendar: 'islamic-umalqura'
  }).format(new Date());

  const gregorianDate = new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'long'
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-4">
      {/* Printable Area Wrapper */}
      <div 
        id="waqf-certificate-print"
        className="relative bg-[#F9F6F0] text-[#1a1a1a] border-[12px] border-double border-[#C9A84C] p-8 md:p-12 rounded-lg shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:p-4 print:my-0"
      >
        {/* Subtle geometric backdrop */}
        <IslamicPattern opacity={0.06} color="#1B5E20" />
        
        {/* Decorative corner accents */}
        <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-[#1B5E20] opacity-40 rounded-tr-md"></div>
        <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-[#1B5E20] opacity-40 rounded-tl-md"></div>
        <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-[#1B5E20] opacity-40 rounded-br-md"></div>
        <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-[#1B5E20] opacity-40 rounded-bl-md"></div>

        {/* Certificate Header */}
        <div className="text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-2 border-[#C9A84C] overflow-hidden bg-white print:shadow-none">
              <img 
                src="/src/assets/images/waqfitek_logo_1783159586464.jpg" 
                alt="Waqfitek" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <h2 className="text-sm font-semibold tracking-widest text-[#C9A84C] font-sans uppercase">البنك الوقفي الرقمي</h2>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1B5E20] mt-1 font-sans">حُجّة وقفية شريفة</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">رقم المستند: {Math.floor(100000 + Math.random() * 900000)}/أب/وع</p>
          
          <IslamicBorder className="my-4" />
        </div>

        {/* Certificate Contents */}
        <div className="text-center my-8 md:my-12 relative z-10 space-y-6">
          <p className="text-lg italic text-[#1B5E20] font-sans leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          
          <p className="text-md text-slate-700 leading-relaxed max-w-xl mx-auto">
            يقول الله تبارك وتعالى في كتابه الحكيم: 
            <br />
            <span className="text-[#1B5E20] font-semibold italic block my-2">"لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ"</span>
          </p>

          <p className="text-lg md:text-xl text-slate-800 leading-loose">
            تشهد إدارة <span className="font-bold text-[#1B5E20]">البنك الوقفي الرقمي</span> وتثبت بأن المحسن الكريم:
            <br />
            <span className="text-2xl md:text-3xl font-extrabold text-[#1B5E20] block my-4 border-b border-dashed border-[#C9A84C] pb-2 max-w-md mx-auto px-4">
              {donorName || "واقف خير مجهول"}
            </span>
            قد حبس حبساً مؤبداً لله تعالى، وأوقف مساهمته النقدية وقدرها:
            <br />
            <span className="text-2xl font-bold text-[#C9A84C] block my-3 bg-white/80 py-2 px-6 rounded-full inline-block border border-[#C9A84C]/20 shadow-sm print:bg-white print:shadow-none">
              {formattedAmount}
            </span>
          </p>

          <p className="text-md md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            وذلك لصالح أحد أبواب البر الجارية وهو:
            <br />
            <strong className="text-[#1B5E20] border-b-2 border-[#C9A84C] pb-1 inline-block mt-2 font-bold">{waqfTypeOrProject}</strong>
          </p>

          <p className="text-sm text-slate-600 max-w-xl mx-auto mt-6 leading-relaxed">
            سائلين المولى عز وجل أن يتقبل منه هذا الوقف المبارك بـالقَبول الحسن، وأن يجعله صدقة جارية ممتدة الأثر، جارية الثواب لا تنقطع، يدخر له ذخرها يوم القيامة ونوراً في صحائف أعماله ووالديه وأهله.
          </p>
        </div>

        {/* Certificate Bottom Block */}
        <div className="mt-12 pt-6 border-t border-dashed border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-right space-y-1 self-start md:self-center">
            <p className="text-xs text-slate-500 font-mono">حُرر في:</p>
            <p className="text-sm text-slate-800 font-medium">{currentDate}</p>
            <p className="text-xs text-slate-400">الموافق: {gregorianDate}م</p>
          </div>

          {/* Decorative Seal logo simulating official stamps */}
          <div className="relative w-28 h-28 flex items-center justify-center opacity-90 select-none">
            {/* Stamp Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#1B5E20]/60 animate-spin-slow"></div>
            {/* Stamp content */}
            <div className="w-24 h-24 rounded-full border-4 double border-[#1B5E20] flex flex-col items-center justify-center text-center p-2 text-[#1B5E20] bg-white/40">
              <span className="text-[9px] font-bold leading-none font-sans">البنك الوقفي</span>
              <span className="text-[14px] font-bold tracking-tight text-[#C9A84C] font-mono leading-none my-1">موقوف</span>
              <span className="text-[8px] leading-tight font-light">لوجه الله تعالى</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs text-slate-500">نظارة الوقف والرقابة الشرعية</p>
            <div className="h-10 flex items-center justify-center relative">
              {/* Fake signature graphic using styling */}
              <span className="font-serif italic text-lg text-[#1B5E20] font-thin tracking-wide rotate-3">عبدالرحمن بن عبدالله</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">رئيس مجلس النظراء</p>
          </div>
        </div>
      </div>

      {/* Interactive Controls Overlay for non-printing screen */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 print:hidden">
        <button
          onClick={handlePrint}
          id="btn-print-cert"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1B5E20] hover:bg-[#154619] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <LucideIcon name="Printer" size={18} />
          <span>طباعة الشهادة الشريفة</span>
        </button>
        
        <button
          onClick={onReset}
          id="btn-new-waqf"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#1B5E20] border-2 border-[#1B5E20] font-bold rounded-lg transition-all duration-300"
        >
          <span>الرجوع والمساهمة من جديد</span>
        </button>
      </div>

      {/* Screen notice informing user they can print/save PDF */}
      <p className="text-center text-xs text-slate-400 mt-4 print:hidden">
        * يمكنك حفظ الشهادة على جهازك بصيغة PDF عن طريق اختيار "حفظ بتنسيق PDF" في قائمة خيارات الطابعة.
      </p>
    </div>
  );
};
