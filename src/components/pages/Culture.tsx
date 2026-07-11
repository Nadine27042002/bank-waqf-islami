import React, { useState } from 'react';
import { FAQItems, QuranVerses } from '../../data';
import { IslamicPattern } from '../IslamicPattern';
import { LucideIcon } from '../LucideIcon';

export const Culture: React.FC = () => {
  // Accordion active index tracking state
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggleAccordion = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F6F0] pt-28 pb-16 text-right font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Head visual banner */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#C9A84C] tracking-wider uppercase font-mono">الوعي التنموي والاستدامة في الفقه الإسلامي</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1B5E20] font-sans mt-2">ثقافة وقفية وفتاوى شرعية</h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
            دراسة مبسطة ودليل الاستدامة التنموية في الفقه الإسلامي الحنيف، وفتاوى نظارة الوقف الرقمي.
          </p>
        </div>

        {/* Dynamic Display of Quran Verses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {QuranVerses.map((verse, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#1B5E20]/5 rounded-full filter blur-xl"></div>
              <p className="text-sm md:text-base font-serif italic text-slate-800 leading-relaxed font-bold text-center">
                " {verse.text} "
              </p>
              <span className="text-[11px] font-bold text-[#C9A84C] text-left block mt-4">
                {verse.source}
              </span>
            </div>
          ))}
        </div>

        {/* Accordion Component */}
        <div className="space-y-6">
          <div className="border-b border-rose-50 pb-3 flex items-center gap-3">
            <div className="p-2 bg-[#1B5E20] text-white rounded-xl">
              <LucideIcon name="BookOpen" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#1B5E20]">الدليل الفقهي الشامل للوقف الرقمي</h3>
              <p className="text-xs text-slate-400 mt-0.5">إجابات تأصيلية حول أحكام الصدقة الجارية وتسبيل المنافع.</p>
            </div>
          </div>

          <div className="space-y-4">
            {FAQItems.map((item, idx) => {
              const isOpen = activeIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs transition-all duration-300"
                >
                  <button
                    onClick={() => handleToggleAccordion(idx)}
                    id={`faq-accordion-header-${idx}`}
                    className="w-full px-5 py-4 text-right flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 font-bold text-slate-800 text-sm sm:text-base cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <LucideIcon
                      name={isOpen ? 'ChevronUp' : 'ChevronDown'}
                      size={18}
                      className={`text-[#C9A84C] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Collapsible Answer Body */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-slate-100' : 'max-h-0'
                    }`}
                  >
                    <div className="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quote of the week under culture */}
          <div className="bg-[#1B5E20]/5 rounded-xl p-6 border border-[#1B5E20]/10 flex gap-4 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/5 rounded-full filter blur-lg pointer-events-none"></div>
            <div className="text-[#C9A84C] shrink-0">
              <LucideIcon name="Award" size={36} />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="text-[#1B5E20] block font-bold mb-1 text-sm">حكمة النظارة الوقفية:</strong>
              "لا تموت الصدقات التي تُحبَس أصولها ويُسَبَّل ريع ثمارها، بل تدخر كالنيل العذب يروي القلوب العطشى ويوثق صروح المعرفة الشامخة على مر الأجيال."
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
