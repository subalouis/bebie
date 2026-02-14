
import React, { useState, useEffect, useCallback } from 'react';
import { HeartBackground } from './components/HeartBackground';

const STEPS = [
  { text: "Hi bebi 👀", button: "Next" },
  { text: "May surprise ako...", button: "Next" },
  { text: "Sure ka na?", button: "Oo naman!" },
  { text: "Last chance HAHA", button: "TULOY NA!" },
  { text: "Okay ready na??", button: "Reveal 💖" }
];

const FINAL_MESSAGE = `hi bebie,

happy valentine's day!!! I am always looking forward on having this celebration with u every year. Gusto ko gawa tayo dami memories together and we get to enjoy and appreciate every event palagi. Dada is always here patiently loving you at the same time being your #1 supporter.

Cheers to more borlogs nights and dogshow days with u HAHASDFASLDKDFZ55ASDFJHAHAA and I hope u liked this greeting that I made out of nowhere.

With love,

louis lablab bebie dada dadamove dadabank dadapatrol dadabee dadaking`;

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowFinal(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-200 to-rose-300 overflow-hidden">
      <HeartBackground />
      
      <div className="z-10 w-full max-w-sm px-6">
        {!showFinal ? (
          <div 
            key={currentStep} 
            className="fade-in bg-white/70 backdrop-blur-lg p-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-center transform transition-all"
          >
            <h1 className="text-3xl font-semibold text-rose-600 mb-8 leading-relaxed">
              {STEPS[currentStep].text}
            </h1>
            <button
              onClick={handleNext}
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-rose-300/50"
            >
              {STEPS[currentStep].button}
            </button>
          </div>
        ) : (
          <div className="fade-in bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-rose-100 max-h-[85vh] overflow-y-auto scrollbar-hide">
            <div className="text-center mb-6">
              <span className="text-4xl">💌</span>
            </div>
            <p className="text-rose-800 text-base leading-relaxed whitespace-pre-line font-medium text-left">
              {FINAL_MESSAGE}
            </p>
            <div className="mt-8 text-center">
              <button 
                onClick={() => {setShowFinal(false); setCurrentStep(0);}}
                className="text-rose-400 hover:text-rose-600 text-sm transition-colors font-medium underline underline-offset-4"
              >
                Read again?
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative corner hearts */}
      <div className="absolute top-10 left-10 text-rose-300 opacity-50 text-4xl hidden md:block">❤</div>
      <div className="absolute bottom-10 right-10 text-rose-300 opacity-50 text-4xl hidden md:block">❤</div>
    </div>
  );
};

export default App;
