import React, { useState } from 'react';
import { QuizData } from '../types';
import { CheckCircle, XCircle, RefreshCw, Trophy, AlertTriangle, Star, ArrowRight } from 'lucide-react';

interface QuizProps {
  data: QuizData;
  onComplete?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ data, onComplete }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(data.questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === data.questions[idx].correctIndex) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setAnswers(new Array(data.questions.length).fill(null));
    setShowResults(false);
  };

  const isAllAnswered = answers.every(a => a !== null);

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / data.questions.length) * 100;
    const isSuccess = percentage >= 50;

    return (
      <div className="bg-slate-900 rounded-3xl p-8 animate-fadeIn border border-slate-800 shadow-2xl max-w-4xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 w-40 h-40 bg-yellow-500/10 blur-[60px] rounded-full"></div>
          
          <div className={`inline-flex items-center justify-center p-8 rounded-full mb-6 shadow-2xl border-[6px] ${isSuccess ? 'bg-slate-800 border-yellow-500/50' : 'bg-slate-800 border-slate-700'}`}>
            <Trophy size={80} className={isSuccess ? "text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]" : "text-slate-600"} />
          </div>
          
          <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
            {isSuccess ? 'نتيجة رائعة!' : 'حاول مرة أخرى'}
          </h3>
          
          <div className="flex justify-center items-baseline gap-2 mb-6">
             <span className={`text-7xl font-black ${isSuccess ? 'text-yellow-500' : 'text-slate-500'}`}>{score}</span>
             <span className="text-2xl text-slate-600 font-bold">/ {data.questions.length}</span>
          </div>
          
          <div className="h-1 w-32 bg-slate-800 mx-auto rounded-full overflow-hidden">
            <div className={`h-full ${isSuccess ? 'bg-yellow-500' : 'bg-slate-600'}`} style={{width: `${percentage}%`}}></div>
          </div>
        </div>

        <div className="space-y-6">
          {data.questions.map((q, qIdx) => {
            const userAnswer = answers[qIdx];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div key={q.id} className={`p-6 rounded-2xl border-l-4 transition-all bg-slate-950/50 ${isCorrect ? 'border-l-green-500 border-y border-r border-slate-800' : 'border-l-red-500 border-y border-r border-slate-800'}`}>
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-1.5 rounded-full ${isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg leading-relaxed mb-4">{q.question}</p>
                    
                    <div className="flex flex-col gap-3">
                       <div className={`p-4 rounded-xl text-sm flex justify-between items-center ${isCorrect ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                          <span className="font-bold">إجابتك:</span>
                          <span>{q.options[userAnswer!]}</span>
                       </div>
                       
                       {!isCorrect && (
                         <div className="p-4 rounded-xl text-sm bg-green-500/10 text-green-300 border border-green-500/20 flex justify-between items-center">
                            <span className="font-bold">الإجابة الصحيحة:</span>
                            <span>{q.options[q.correctIndex]}</span>
                         </div>
                       )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-800/50 flex gap-3 text-sm text-slate-400">
                       <div className="min-w-[4px] rounded-full bg-blue-500/50"></div>
                       <p className="leading-relaxed"><span className="text-blue-400 font-bold">الشرح:</span> {q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={resetQuiz}
            className="group flex items-center gap-3 bg-slate-800 hover:bg-yellow-500 hover:text-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-all border border-slate-700 hover:border-yellow-500"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" /> 
            إعادة الاختبار
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-24">
      {data.questions.map((q, idx) => (
        <div key={q.id} className="bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-800 relative group hover:border-slate-700 transition-all">
          {/* Question Number Badge */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-slate-300 font-mono font-bold shadow-lg z-10 group-hover:scale-110 transition-transform group-hover:border-yellow-500/50 group-hover:text-yellow-500">
            {idx + 1}
          </div>
          
          <div className="mb-8">
            <div className="flex gap-1 mb-4">
               {[1,2,3].map(i => (
                 <Star key={i} size={16} className={`${
                   (q.difficulty === 'easy' && i === 1) || 
                   (q.difficulty === 'medium' && i <= 2) || 
                   (q.difficulty === 'hard') 
                   ? 'text-yellow-500 fill-yellow-500' : 'text-slate-800 fill-slate-800'
                 }`} />
               ))}
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-white leading-normal">{q.question}</h4>
          </div>
          
          <div className="grid gap-3">
            {q.options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(idx, optIdx)}
                className={`w-full text-right p-5 rounded-xl transition-all border flex items-center justify-between group relative overflow-hidden
                  ${answers[idx] === optIdx 
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-100' 
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <span className="relative z-10 font-medium">{opt}</span>
                {answers[idx] === optIdx && (
                  <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none px-4">
        <button
          onClick={() => setShowResults(true)}
          disabled={!isAllAnswered}
          className={`pointer-events-auto px-10 py-4 rounded-full font-bold shadow-2xl transition-all transform flex items-center gap-3 backdrop-blur-xl border
            ${isAllAnswered 
              ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 border-yellow-400 scale-100 hover:scale-105 shadow-yellow-500/20' 
              : 'bg-slate-900/90 text-slate-500 border-slate-700 translate-y-24 opacity-0 md:opacity-100 md:translate-y-0'
            }`}
        >
          {isAllAnswered ? (
             <>
               اعتماد الإجابات <ArrowRight className="rotate-180" />
             </>
          ) : (
             <>
               <AlertTriangle size={18} /> أكمل الإجابات ({answers.filter(a => a !== null).length}/{data.questions.length})
             </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Quiz;