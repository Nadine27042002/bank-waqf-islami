import React, { useState } from 'react';
import { Project, Page } from '../../types';
import { IslamicPattern } from '../IslamicPattern';
import { LucideIcon } from '../LucideIcon';

interface ProjectsProps {
  onNavigatePage: (page: Page) => void;
  onSelectProject: (project: Project) => void;
  projectsList: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({
  onNavigatePage,
  onSelectProject,
  projectsList,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'educational' | 'health' | 'social' | 'agricultural'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredProjects = projectsList.filter((project) => {
    const matchesCategory = activeFilter === 'all' || project.category === activeFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle immediate contribution mapping
  const handleContribute = (project: Project) => {
    onSelectProject(project);
    onNavigatePage('contribute');
  };

  // Global aggregate stats
  const totalRaised = projectsList.reduce((acc, p) => acc + p.currentAmount, 0);
  const totalTarget = projectsList.reduce((acc, p) => acc + p.targetAmount, 0);
  const overallPercentage = Math.round((totalRaised / totalTarget) * 100);
  const totalDonors = projectsList.reduce((acc, p) => acc + p.donorCount, 0);

  return (
    <div className="w-full min-h-screen bg-[#F9F6F0] pt-28 pb-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Abstract */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#C9A84C] tracking-wider uppercase font-mono">سجل المشاريع التكافلية</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1B5E20] font-sans mt-2">مشاريعنا الوقفية الجارية</h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
            استعرض وحلل الميزانيات المخصصة وحجم المنجز في الصناديق الوقفية الطبية والتعليمية والزراعية والبلدية.
          </p>
        </div>

        {/* Aggregate statistics ribbon widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-right">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs relative overflow-hidden flex items-center gap-4">
            <div className="p-3 bg-[#1B5E20]/10 text-[#1B5E20] rounded-xl shrink-0">
              <LucideIcon name="TrendingUp" size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-450 block">مجموع الميزانيات المجمّعة:</span>
              <strong className="text-xl font-bold font-mono text-[#1B5E20]">{totalRaised.toLocaleString('ar-EG')} ر.س</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">من أصل {totalTarget.toLocaleString('ar-EG')} ر.س مستهدفة</p>
            </div>
            <div className="absolute top-2 left-2 text-slate-100 italic text-5xl font-black opacity-30 select-none">١</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs relative overflow-hidden flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-[#C9A84C] rounded-xl shrink-0">
              <LucideIcon name="Users" size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-450 block">مجموع المانحين المسجلين:</span>
              <strong className="text-xl font-bold font-mono text-slate-800">{totalDonors.toLocaleString('ar-EG')} واقف شريف</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">في جميع المصارف المنشورة</p>
            </div>
            <div className="absolute top-2 left-2 text-slate-100 italic text-5xl font-black opacity-30 select-none">٢</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs relative overflow-hidden flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl shrink-0">
              <LucideIcon name="Award" size={24} />
            </div>
            <div>
              <span className="text-xs text-slate-450 block">معدل الإنجاز المالي العام:</span>
              <strong className="text-xl font-bold font-mono text-emerald-800">{overallPercentage}% مكتمل</strong>
              <p className="text-[10px] text-slate-400 mt-0.5">خطوات ثابتة نحو الاكتفاء الكامل</p>
            </div>
            <div className="absolute top-2 left-2 text-slate-100 italic text-5xl font-black opacity-30 select-none">٣</div>
          </div>
        </div>

        {/* Filters and search box panel */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-10 select-none">
          {/* Categories Tab Ribbon (Right side RTL) */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {[
              { label: 'الكل', value: 'all' },
              { label: 'تعليمي', value: 'educational' },
              { label: 'صحي', value: 'health' },
              { label: 'اجتماعي', value: 'social' },
              { label: 'زراعي', value: 'agricultural' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value as any)}
                id={`filter-tab-${tab.value}`}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === tab.value
                    ? 'bg-[#1B5E20] text-white shadow-sm font-black'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#1B5E20]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box Panel (Left side RTL) */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
              <LucideIcon name="Search" size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بتسمية المشروع الوعائي..."
              className="w-full bg-slate-50 border border-slate-250 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#1B5E20]"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const projectPercent = Math.min(
                100,
                Math.round((project.currentAmount / project.targetAmount) * 100)
              );

              return (
                <div
                  key={project.id}
                  id={`projects-grid-card-${project.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full justify-between group"
                >
                  {/* Photo with responsive category stamp */}
                  <div className="relative h-48 sm:h-52 overflow-hidden select-none">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#1B5E20] font-black text-[11px] py-1 px-3 rounded-full shadow-sm border border-slate-200">
                      {project.category === 'educational' && 'تعليمي'}
                      {project.category === 'health' && 'صحي'}
                      {project.category === 'agricultural' && 'زراعي'}
                      {project.category === 'social' && 'اجتماعي'}
                    </div>

                    <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-[#C9A84C] font-mono text-[10px] font-bold py-1 px-2.5 rounded">
                      كود وقفي: {project.id}#
                    </div>
                  </div>

                  {/* Body textual outputs */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-right space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-[#1B5E20] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mt-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Financial statistics calculation sliders */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-[#1B5E20]">{projectPercent}% مكتمل</span>
                          <span className="text-slate-400">تراكم الميزانية</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-l from-[#1B5E20] to-[#C9A84C] rounded-full transition-all duration-1000"
                            style={{ width: `${projectPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-50 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">الهدف المالي:</span>
                          <strong className="font-bold text-slate-800 font-mono">{project.targetAmount.toLocaleString('ar-EG')} ر.س</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">المبلغ المجمّع:</span>
                          <strong className="font-bold text-[#1B5E20] font-mono">{project.currentAmount.toLocaleString('ar-EG')} ر.س</strong>
                        </div>
                        <div className="col-span-2 pt-1.5 flex items-center gap-1 text-slate-450 leading-none">
                          <LucideIcon name="Users" size={13} className="text-[#C9A84C]" />
                          <span>عدد المانحين النشطين: <strong className="text-slate-700 font-mono">{project.donorCount.toLocaleString('ar-EG')}</strong> مساهم</span>
                        </div>
                      </div>

                      {/* Explicit button */}
                      <button
                        onClick={() => handleContribute(project)}
                        id={`btn-projects-grid-donate-${project.id}`}
                        className="w-full py-3 bg-[#1B5E20] hover:bg-[#154619] text-white font-bold text-xs rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LucideIcon name="Coins" size={14} />
                        <span>ساهم الآن في وقفك</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-slate-50 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
              <LucideIcon name="FileText" size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#1B5E20]">عذرًا، لم يتم العثور على أوقاف مطابقة</h3>
            <p className="text-xs text-slate-450 mt-1">يرجى المحاولة مجددًا بصيغة بحث أخرى أو إعادة التصفية من التبويبات بالخلف.</p>
          </div>
        )}

      </div>
    </div>
  );
};
