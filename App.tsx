import React, { useState } from 'react';
import { LESSONS } from './constants';
import { LessonContent } from './types';
import Wire3D from './components/Wire3D';
import OhmsChart from './components/OhmsChart';
import CircuitSim from './components/CircuitSim';
import KirchhoffSim from './components/KirchhoffSim'; // Import the new component
import Quiz from './components/Quiz';
import { 
  Menu, X, ChevronRight, ChevronLeft, BookOpen, Activity, 
  HelpCircle, Lightbulb, Zap, GraduationCap, Play, AlertTriangle, CheckCircle2,
  Layers, Star, BrainCircuit
} from 'lucide-react';

// ... existing type Tab ...

const App: React.FC = () => {
  // ... existing state hooks ...
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);
  const [activeTab, setActiveTab] = useState<Tab>('THEORY');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Simulation states
  const [wireValues, setWireValues] = useState({ length: 1, area: 1 });
  const [ohmValues, setOhmValues] = useState({ v: 10, r: 5 });

  const currentLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  const handleLessonChange = (id: string) => {
    setActiveLessonId(id);
    setActiveTab('THEORY');
    setIsSidebarOpen(false);
  };

  const markLessonComplete = (id: string) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  const renderSimulation = (lesson: LessonContent) => {
    switch (lesson.simulationType) {
      case 'WIRE':
        // ... existing WIRE code ...
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-yellow-500">
                     <Activity size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-lg">العوامل المؤثرة في المقاومة</h3>
                     <p className="text-xs text-slate-500">تفاعل مع أبعاد السلك ولاحظ التغير</p>
                   </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-800">
                 <div className="lg:col-span-2 p-6 bg-slate-950/50">
                   <Wire3D length={wireValues.length} area={wireValues.area} />
                 </div>
                 <div className="p-6 bg-slate-900 flex flex-col justify-center relative">
                    <div className="space-y-8 relative z-10">
                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="text-slate-300 text-sm font-bold">طول السلك (L)</label>
                          <span className="text-yellow-500 font-mono text-sm bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">{wireValues.length}x</span>
                        </div>
                        <input type="range" min="0.5" max="3" step="0.1" value={wireValues.length} onChange={(e) => setWireValues({...wireValues, length: Number(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400"/>
                      </div>
                      <div>
                        <div className="flex justify-between mb-3">
                          <label className="text-slate-300 text-sm font-bold">مساحة المقطع (A)</label>
                          <span className="text-blue-400 font-mono text-sm bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{wireValues.area}x</span>
                        </div>
                        <input type="range" min="0.5" max="2" step="0.1" value={wireValues.area} onChange={(e) => setWireValues({...wireValues, area: Number(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"/>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                        <p className="text-slate-500 text-xs mb-2 uppercase tracking-widest">Relative Resistance</p>
                        <div className="text-4xl font-black text-white tracking-tighter">
                          {(wireValues.length / (wireValues.area * wireValues.area)).toFixed(2)} <span className="text-lg text-slate-600 font-medium">Ω</span>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
               <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-yellow-500">
                     <Zap size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-lg">محاكاة قانون أوم</h3>
                     <p className="text-xs text-slate-500">العلاقة بين الجهد والتيار والمقاومة</p>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-800">
                  <div className="p-6 bg-slate-900 flex flex-col">
                      <div className="mb-8 p-6 bg-slate-950 rounded-2xl text-center border border-slate-800 shadow-inner">
                        <div className="text-3xl font-mono font-black text-white">V = I · R</div>
                      </div>
                      
                      <div className="space-y-8 flex-1">
                        <div>
                          <label className="flex justify-between text-slate-300 mb-3 text-sm font-bold">الجهد (V): <span className="text-yellow-400">{ohmValues.v}V</span></label>
                          <input type="range" min="1" max="50" value={ohmValues.v} onChange={(e) => setOhmValues({...ohmValues, v: Number(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"/>
                        </div>
                        <div>
                           <label className="flex justify-between text-slate-300 mb-3 text-sm font-bold">المقاومة (R): <span className="text-blue-400">{ohmValues.r}Ω</span></label>
                           <input type="range" min="1" max="20" value={ohmValues.r} onChange={(e) => setOhmValues({...ohmValues, r: Number(e.target.value)})} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                        </div>
                        <div className="mt-auto">
                           <div className="flex justify-between items-center bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                              <span className="text-slate-400 text-sm font-bold">التيار الناتج (I)</span>
                              <span className="text-green-400 font-bold text-2xl font-mono">{(ohmValues.v / ohmValues.r).toFixed(2)} A</span>
                           </div>
                        </div>
                      </div>
                  </div>
                  <div className="lg:col-span-2 p-6 bg-slate-950/30">
                     <OhmsChart voltage={ohmValues.v} resistance={ohmValues.r} />
                  </div>
               </div>
            </div>
          </div>
        );
      case 'SERIES_PARALLEL':
        return <CircuitSim type="SERIES_PARALLEL" />;
      case 'CLOSED_CIRCUIT':
        return <CircuitSim type="CLOSED_CIRCUIT" />;
      case 'KIRCHHOFF':
        // Use the new component here
        return <KirchhoffSim />;
      default:
        return <div>Sim not found</div>;
    }
  };

  // ... existing return ...
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-cairo flex flex-col md:flex-row overflow-hidden selection:bg-yellow-500/30 selection:text-white">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Zap size={20} className="text-slate-900 fill-slate-900" />
          </div>
          <h1 className="font-black text-lg text-white tracking-tight">الفيزياء الممتعة</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg transition-colors">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 right-0 z-40 w-80 bg-slate-900/95 border-l border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl backdrop-blur-xl
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 border-b border-slate-800/50">
          <div className="flex items-center gap-4 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0">
              <Zap size={24} className="text-slate-900 fill-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">
                الفيزياء <span className="text-yellow-500">الممتعة</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">PREMIUM EDUCATION</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6">
           <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 uppercase tracking-widest font-bold">
             <span>Course Progress</span>
             <span className="text-white">{Math.round((completedLessons.length / LESSONS.length) * 100)}%</span>
           </div>
           <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 shadow-[0_0_10px_#eab308]"
               style={{width: `${(completedLessons.length / LESSONS.length) * 100}%`}}
             ></div>
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
          {LESSONS.map((lesson, idx) => {
            const isActive = activeLessonId === lesson.id;
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <button
                key={lesson.id}
                onClick={() => handleLessonChange(lesson.id)}
                className={`w-full text-right p-4 rounded-2xl transition-all border group relative overflow-hidden ${
                  isActive
                  ? 'bg-slate-800 border-yellow-500/30 text-white shadow-lg' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${
                     isActive ? 'bg-yellow-500 text-slate-900 border-yellow-500' : 
                     isCompleted ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-slate-800/50 text-slate-600 border-slate-700'
                   }`}>
                     {isCompleted && !isActive ? <CheckCircle2 size={16} /> : idx + 1}
                   </div>
                   <div className="flex-1">
                     <span className={`text-[10px] font-bold mb-0.5 block tracking-wider ${isActive ? 'text-yellow-500' : 'text-slate-600'}`}>LESSON {idx + 1}</span>
                     <span className="text-sm font-bold block leading-tight">{lesson.title.split(':')[1] || lesson.title}</span>
                   </div>
                   {isActive && <ChevronLeft size={16} className="text-yellow-500" />}
                </div>
                {isActive && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-yellow-500"></div>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/30">
           <div className="flex items-center gap-3 text-slate-400 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
             <div className="p-2 bg-slate-800 rounded-lg shrink-0">
               <GraduationCap size={18} className="text-yellow-500" />
             </div>
             <div className="text-xs leading-relaxed">
               <p className="font-bold text-white mb-0.5">نصيحة ذهبية:</p>
               <p className="text-slate-400">حل المسائل بيدك هو مفتاح التفوق.</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-60px)] md:h-screen overflow-hidden relative bg-slate-950">
        
        {/* Top Bar */}
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 p-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 z-20 sticky top-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{currentLesson.title}</h2>
            <p className="text-sm text-slate-400 mt-1 hidden md:block font-medium">{currentLesson.description}</p>
          </div>
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto max-w-full no-scrollbar">
             {[
               { id: 'THEORY', icon: BookOpen, label: 'الشرح' },
               { id: 'EXAM_TRICKS', icon: Lightbulb, label: 'أفكار الامتحانات' },
               { id: 'SIMULATION', icon: Activity, label: 'المحاكاة' },
               { id: 'QUIZ', icon: HelpCircle, label: 'الاختبار' },
             ].map((tab) => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as Tab)}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                   activeTab === tab.id 
                   ? 'bg-slate-800 text-white shadow-lg ring-1 ring-slate-700' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                 }`}
               >
                 <tab.icon size={16} className={activeTab === tab.id ? 'text-yellow-500' : ''} /> 
                 {tab.label}
               </button>
             ))}
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950">
           <div className="max-w-5xl mx-auto p-4 md:p-10 pb-24">
             
             {activeTab === 'THEORY' && (
               <div className="space-y-8 animate-fadeIn">
                 {currentLesson.sections.filter(s => !s.examTrick).map((sec, idx) => (
                   <div key={idx} className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
                          <span className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-yellow-500 text-lg border border-slate-700 font-mono shadow-lg">{idx + 1}</span>
                          {sec.title}
                        </h3>
                        
                        <div className="text-slate-300 text-lg leading-loose mb-8 font-medium pl-4">
                          {sec.content}
                        </div>

                        {/* Mental Model / Analogy Section */}
                        {sec.analogy && (
                          <div className="my-6 bg-blue-950/30 border border-blue-900/50 rounded-2xl p-6 relative">
                             <div className="flex gap-4">
                                <div className="p-3 bg-blue-900/30 rounded-xl h-fit shrink-0 text-blue-400">
                                  <BrainCircuit size={24} />
                                </div>
                                <div>
                                  <h4 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">ببساطة (Mental Model)</h4>
                                  <p className="text-blue-100/90 leading-relaxed italic">"{sec.analogy}"</p>
                                </div>
                             </div>
                          </div>
                        )}

                        {sec.law && (
                          <div className="my-8 bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden group/law">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                             <p className="text-xs text-slate-500 mb-4 uppercase tracking-[0.3em] font-bold">Mathematical Formula</p>
                             <p className="text-3xl md:text-4xl font-mono font-bold text-blue-400 relative z-10 drop-shadow-lg" dir="ltr">{sec.law}</p>
                          </div>
                        )}
                        
                        {sec.points && (
                          <ul className="grid grid-cols-1 gap-4 mb-6">
                            {sec.points.map((pt, i) => (
                              <li key={i} className="flex items-start gap-4 text-slate-300 bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50 hover:bg-slate-800/80 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2.5 shrink-0 shadow-[0_0_10px_#eab308]"></div>
                                <span className="leading-relaxed text-base">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {(sec.important || sec.warning) && (
                          <div className={`border-r-4 p-6 rounded-l-2xl flex gap-5 mt-8 ${sec.warning ? 'bg-red-500/5 border-red-500' : 'bg-yellow-500/5 border-yellow-500'}`}>
                            <div className={`p-2 rounded-lg shrink-0 ${sec.warning ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                              <AlertTriangle size={24} />
                            </div>
                            <div>
                              <h4 className={`font-bold text-lg mb-2 ${sec.warning ? 'text-red-500' : 'text-yellow-500'}`}>
                                {sec.warning ? 'تحذير هام' : 'ملاحظة هامة'}
                              </h4>
                              <p className={`${sec.warning ? 'text-red-200/80' : 'text-yellow-200/80'} leading-relaxed`}>
                                {sec.warning || sec.important}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                   </div>
                 ))}
                 
                 <div className="flex justify-center mt-16">
                   <button 
                     onClick={() => setActiveTab('EXAM_TRICKS')}
                     className="group bg-slate-800 hover:bg-yellow-500 hover:text-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-4 transition-all border border-slate-700 hover:border-yellow-500 hover:shadow-[0_0_40px_rgba(234,179,8,0.2)]"
                   >
                     التالي: أفكار الامتحانات <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                   </button>
                 </div>
               </div>
             )}

             {activeTab === 'EXAM_TRICKS' && (
               <div className="space-y-8 animate-fadeIn">
                 <div className="bg-gradient-to-r from-yellow-600 to-amber-700 rounded-[2.5rem] p-10 text-white mb-10 shadow-2xl relative overflow-hidden border border-white/10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl mix-blend-overlay"></div>
                    <div className="relative z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/10">
                        <Star size={12} className="text-yellow-300" fill="currentColor" /> PREMIUM CONTENT
                      </div>
                      <h3 className="text-4xl font-black mb-4 tracking-tight">💡 منطقة العباقرة</h3>
                      <p className="text-yellow-100 text-lg font-medium leading-relaxed">
                        هذه المنطقة مخصصة لأهم الأفكار والتركات التي تميز الطالب المتفوق في الامتحانات. ركز جيداً هنا!
                      </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {currentLesson.sections.filter(s => s.examTrick || s.title.includes('أفكار')).map((sec, idx) => (
                      <div key={idx} className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 hover:border-yellow-500/30 transition-all group hover:shadow-2xl hover:shadow-yellow-500/5">
                         <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors border border-slate-700 group-hover:scale-110 duration-300 shadow-lg">
                           <Lightbulb size={28} />
                         </div>
                         <h4 className="text-xl font-bold text-white mb-4">{sec.title.replace('🔥', '').trim()}</h4>
                         <p className="text-slate-400 mb-6 leading-relaxed">{sec.content}</p>
                         
                         {sec.examTrick && (
                           <div className="bg-slate-950 p-6 rounded-2xl border border-dashed border-slate-700 text-yellow-100/90 leading-relaxed relative">
                             <div className="absolute -top-3 right-4 bg-slate-900 px-2 text-xs text-yellow-500 font-bold border border-slate-700 rounded">الخلاصة</div>
                             {sec.examTrick}
                           </div>
                         )}
                         
                         {sec.law && (
                            <div className="mt-4 p-3 bg-slate-950/50 rounded-xl text-center border border-slate-800">
                               <code className="text-blue-400 font-mono font-bold text-lg" dir="ltr">{sec.law}</code>
                            </div>
                         )}
                      </div>
                   ))}
                   {currentLesson.sections.filter(s => s.examTrick || s.title.includes('أفكار')).length === 0 && (
                      <div className="col-span-2 text-center py-24 bg-slate-900 rounded-[2rem] border border-slate-800 border-dashed">
                        <Layers size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 text-lg font-medium">لا توجد أفكار إضافية لهذا الدرس، المحتوى الأساسي كافٍ.</p>
                      </div>
                   )}
                 </div>

                 <div className="flex justify-center mt-16">
                   <button 
                     onClick={() => setActiveTab('SIMULATION')}
                     className="bg-slate-100 hover:bg-white text-slate-900 px-10 py-5 rounded-full font-bold flex items-center gap-4 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105"
                   >
                     التالي: المختبر التفاعلي <Activity size={20} />
                   </button>
                 </div>
               </div>
             )}

             {activeTab === 'SIMULATION' && (
               <div className="animate-fadeIn">
                  {renderSimulation(currentLesson)}
                  
                  <div className="flex justify-center mt-16">
                   <button 
                     onClick={() => setActiveTab('QUIZ')}
                     className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:to-amber-400 text-slate-900 px-12 py-5 rounded-full font-bold flex items-center gap-4 transition-all shadow-xl shadow-yellow-500/20 hover:scale-105 hover:shadow-yellow-500/30"
                   >
                     جاهز للاختبار؟ <Play fill="currentColor" size={18} />
                   </button>
                 </div>
               </div>
             )}

             {activeTab === 'QUIZ' && (
               <div className="animate-fadeIn">
                 <div className="mb-12 text-center relative">
                   <h3 className="text-4xl font-black text-white mb-4">{currentLesson.quiz.title}</h3>
                   <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full"></div>
                   <p className="text-slate-400 mt-4 font-medium">أجب على الأسئلة التالية للتأكد من فهمك للدرس</p>
                 </div>
                 <Quiz 
                   data={currentLesson.quiz} 
                   onComplete={() => markLessonComplete(currentLesson.id)}
                 />
               </div>
             )}
             
           </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;