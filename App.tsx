
import React, { useState, useEffect, useRef } from 'react';
import { WizardStep } from './types';
import FloatingHearts from './components/FloatingHearts';
import { generateLoveMessage } from './services/gemini';

// Using the actual images provided by the user in the prompt
const IMAGES = {
  SELFIE: "input_file_0.png",
  CAMERA: "input_file_1.png",
  COFFEE: "input_file_2.png"
};

// Background music link - XXL by LANY
const MUSIC_URL = "https://files.catbox.moe/vpt03t.mp3"; 

const App: React.FC = () => {
  const [step, setStep] = useState<WizardStep>(WizardStep.WELCOME);
  const [names] = useState({ partner: 'bebie raerae', me: 'tabachuy dada' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const REQUIRED_CLICKS = 7;

  // Function to handle audio playback on user interaction (to bypass browser autoplay blocks)
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay blocked. Music will start after next interaction.", err);
      });
    }
  };

  const handleNext = () => {
    const steps = Object.values(WizardStep);
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as WizardStep);
    }
    // Attempt to start music on any "Next" click just in case it was blocked earlier
    startMusic();
  };

  const handleBack = () => {
    const steps = Object.values(WizardStep);
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as WizardStep);
    }
  };

  const handleTeaseClick = () => {
    setClickCount(prev => prev + 1);
    startMusic(); // Also trigger on heart clicks to be safe
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  useEffect(() => {
    if (clickCount >= REQUIRED_CLICKS && step === WizardStep.TEASE_3) {
      const timer = setTimeout(() => {
        handleNext();
        setClickCount(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [clickCount, step]);

  const generateMagic = async () => {
    setLoading(true);
    const msg = await generateLoveMessage(names.partner, names.me);
    setMessage(msg);
    setLoading(false);
    handleNext();
  };

  const ProgressDots = () => (
    <div className="flex gap-2 mb-8 fixed top-8 z-50">
      {Object.values(WizardStep).map((s, i) => (
        <div 
          key={s} 
          className={`h-1.5 rounded-full transition-all duration-500 ${
            Object.values(WizardStep).indexOf(step) >= i ? 'w-6 bg-pink-500' : 'w-2 bg-pink-200'
          }`} 
        />
      ))}
    </div>
  );

  const renderWelcome = () => (
    <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
      <div className="relative">
        <span className="text-8xl animate-pulse inline-block">🪄</span>
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce">✨</div>
      </div>
      <h1 className="text-6xl font-romantic text-pink-600 mb-2 leading-tight">Hi, {names.partner}!</h1>
      <p className="text-xl text-pink-400 font-medium max-w-md">
        Your {names.me} has summoned the Love Wizard. <br/>Are you ready for some magic?
      </p>
      <button 
        onClick={() => { startMusic(); handleNext(); }}
        className="mt-8 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-5 px-16 rounded-full shadow-[0_10px_20px_rgba(244,114,182,0.4)] transition-all transform hover:scale-105 active:scale-95"
      >
        I'm Ready! ❤️
      </button>
    </div>
  );

  const renderTease1 = () => (
    <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
      <h2 className="text-4xl font-romantic text-pink-500">Wait... are you REALLY ready?</h2>
      <p className="text-lg text-pink-400 max-w-md">
        The wizard says your heart needs to be 100% full of love before we proceed.
      </p>
      <div className="w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-lg border-2 border-pink-50">
        <span className="text-5xl animate-spin-slow">💘</span>
      </div>
      <button 
        onClick={handleNext} 
        className="bg-pink-100 text-pink-600 font-bold py-3 px-12 rounded-full hover:bg-pink-200 transition-all border border-pink-200"
      >
        It's 1000% full! Next!
      </button>
    </div>
  );

  const renderTease2 = () => (
    <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
      <h2 className="text-4xl font-romantic text-pink-500">First, a quick hug!</h2>
      <p className="text-lg text-pink-400 max-w-md">
        {names.me} is waiting for a virtual squeeze. Tap the hug button to send one!
      </p>
      <button 
        onClick={handleNext} 
        className="group bg-rose-400 text-white font-bold py-4 px-14 rounded-full hover:bg-rose-500 shadow-xl transition-all flex items-center gap-3"
      >
        <span className="group-hover:scale-125 transition-transform text-2xl">🫂</span>
        <span>SEND BIG HUG</span>
      </button>
    </div>
  );

  const renderTease3 = () => (
    <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
      <h2 className="text-4xl font-romantic text-pink-500">Power up the magic!</h2>
      <p className="text-lg text-pink-400 max-w-md">
        Tap this heart {REQUIRED_CLICKS} times to unlock our story...
      </p>
      <div className="relative">
        <button 
          onClick={handleTeaseClick}
          className={`bg-white text-rose-500 p-10 rounded-full shadow-2xl border-4 border-pink-50 transform active:scale-90 transition-all text-6xl hover:bg-pink-50 ${clickCount > 0 ? 'animate-pulse' : ''}`}
        >
          ❤️
        </button>
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({length: REQUIRED_CLICKS}).map((_, i) => (
            <div key={i} className={`h-3 w-3 rounded-full ${i < clickCount ? 'bg-pink-500 scale-125' : 'bg-pink-100'} transition-all`} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderTease4 = () => (
    <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
      <h2 className="text-4xl font-romantic text-pink-500">Remember our coffee dates?</h2>
      <p className="text-lg text-pink-400 max-w-md">
        The way you look when you're enjoying your drink is my favorite view.
      </p>
      <div className="relative w-64 h-80 bg-white shadow-2xl p-4 transform -rotate-3 border-8 border-white rounded-sm">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-pink-200/50 backdrop-blur-sm -rotate-2 z-10"></div>
        <div className="w-full h-full bg-pink-50 overflow-hidden">
           <img src={IMAGES.COFFEE} className="w-full h-full object-cover" alt="Coffee Date" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>
        <div className="mt-4 font-romantic text-pink-400 text-xl">Jungle Base Moments</div>
      </div>
      <button 
        onClick={handleNext} 
        className="bg-pink-500 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-all"
      >
        I remember! Next!
      </button>
    </div>
  );

  const renderTease5 = () => (
    <div className="flex flex-col items-center text-center space-y-6 animate-fadeIn">
      <h2 className="text-4xl font-romantic text-pink-500">And my favorite selfie...</h2>
      <p className="text-lg text-pink-400 max-w-md">
        Look at those smiles. This is why I love you so much, bebie raerae.
      </p>
      <div className="relative w-72 h-72 bg-white shadow-2xl p-4 transform rotate-2 border-8 border-white rounded-sm">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-8 bg-pink-100/60 backdrop-blur-sm rotate-6 z-10"></div>
        <div className="w-full h-full bg-pink-50 overflow-hidden">
           <img src={IMAGES.SELFIE} className="w-full h-full object-cover" alt="Our Selfie" onError={(e) => (e.currentTarget.style.display = 'none')} />
        </div>
        <div className="mt-2 font-romantic text-pink-400 text-xl">Us Always ✨</div>
      </div>
      <button 
        onClick={handleNext} 
        className="bg-gradient-to-tr from-rose-400 to-pink-500 text-white font-bold py-4 px-14 rounded-full shadow-xl transition-all"
      >
        The Final Reveal...
      </button>
    </div>
  );

  const renderGenerator = () => (
    <div className="flex flex-col items-center text-center space-y-8 animate-fadeIn w-full max-w-xl">
      <div className="text-6xl animate-pulse">💌</div>
      <h2 className="text-5xl font-romantic text-pink-500">Your Heart's Message</h2>
      <p className="text-lg text-pink-400 italic">
        "To my bebie raerae, from your tabachuy dada..."
      </p>
      <div className="w-full space-y-4">
        <textarea
          placeholder="Paste your main message here, tabachuy dada..."
          className="w-full h-40 p-8 rounded-[2rem] border-2 border-pink-100 focus:border-pink-300 outline-none text-pink-700 bg-white/50 backdrop-blur-sm shadow-inner transition-all placeholder-pink-200 text-lg leading-relaxed"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          onClick={generateMagic}
          className="text-pink-400 hover:text-pink-600 flex items-center gap-2 mx-auto text-sm font-semibold transition-colors bg-white/30 px-4 py-2 rounded-full"
        >
          ✨ {loading ? 'Consulting the wizard...' : 'Or let the Wizard help write it'}
        </button>
      </div>
      <div className="flex gap-4">
        <button onClick={handleBack} className="text-pink-400 hover:text-pink-600 px-6 py-2">Back</button>
        <button 
          onClick={handleNext}
          disabled={!message.trim()}
          className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-5 px-16 rounded-full shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50"
        >
          UNLOCK MY HEART
        </button>
      </div>
    </div>
  );

  const renderFinal = () => (
    <div className="flex flex-col items-center text-center space-y-12 animate-fadeIn w-full max-w-4xl px-4 pb-24 pt-12">
      <div className="relative">
        <div className="absolute -top-16 -left-16 text-6xl animate-pulse opacity-50">✨</div>
        <div className="absolute -bottom-16 -right-16 text-6xl animate-pulse opacity-50 delay-500">💖</div>
        <h1 className="text-7xl md:text-8xl font-romantic text-rose-600 drop-shadow-md">Happy Valentine's!</h1>
        <p className="text-2xl font-romantic text-pink-400 mt-2">To my bebie raerae 🌹</p>
      </div>
      
      <div className="relative w-full max-w-2xl h-[500px] mt-8 flex justify-center">
        <div className="absolute z-30 transform -rotate-6 hover:rotate-0 transition-all duration-700 hover:scale-110 top-0 left-4 md:left-0 bg-white p-3 shadow-2xl border border-pink-50 rounded-sm w-48 md:w-64">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-100/80 -rotate-2 z-10"></div>
           <div className="aspect-square bg-pink-50 overflow-hidden">
              <img src={IMAGES.SELFIE} className="w-full h-full object-cover" alt="Us" onError={(e) => (e.currentTarget.style.display = 'none')} />
           </div>
           <div className="py-3 font-romantic text-pink-400 text-lg">My World 🌎</div>
        </div>

        <div className="absolute z-20 transform rotate-12 hover:rotate-0 transition-all duration-700 hover:scale-110 top-20 right-4 md:right-0 bg-white p-3 shadow-2xl border border-pink-50 rounded-sm w-44 md:w-56">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-100/80 rotate-6 z-10"></div>
           <div className="aspect-[4/5] bg-pink-50 overflow-hidden">
              <img src={IMAGES.CAMERA} className="w-full h-full object-cover" alt="Cute raerae" onError={(e) => (e.currentTarget.style.display = 'none')} />
           </div>
           <div className="py-3 font-romantic text-pink-400 text-lg">Cutest Bebie 📸</div>
        </div>

        <div className="absolute z-10 transform -rotate-12 hover:rotate-0 transition-all duration-700 hover:scale-110 bottom-4 left-1/2 -translate-x-1/2 bg-white p-3 shadow-2xl border border-pink-50 rounded-sm w-48 md:w-60">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-100/80 -rotate-1 z-10"></div>
           <div className="aspect-[4/5] bg-pink-50 overflow-hidden">
              <img src={IMAGES.COFFEE} className="w-full h-full object-cover" alt="Coffee date" onError={(e) => (e.currentTarget.style.display = 'none')} />
           </div>
           <div className="py-3 font-romantic text-pink-400 text-lg">Matcha & Coffee ☕</div>
        </div>
      </div>

      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-md p-12 rounded-[4rem] shadow-[0_30px_60px_-12px_rgba(244,114,182,0.3)] border-2 border-pink-50 mt-12 animate-fadeIn">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-full flex items-center justify-center text-white text-4xl shadow-xl border-4 border-white animate-bounce">❤️</div>
        <div className="space-y-6">
          <p className="text-3xl md:text-4xl font-romantic text-pink-800 leading-relaxed whitespace-pre-wrap italic">
            "{message}"
          </p>
          <div className="pt-10 border-t border-pink-100">
            <p className="text-pink-400 font-cute text-3xl">— Forever yours, {names.me}</p>
            <div className="mt-4 flex justify-center gap-1 text-pink-300">
               {Array.from({length: 5}).map((_, i) => <span key={i}>⭐</span>)}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => { 
          setStep(WizardStep.WELCOME); 
          setClickCount(0); 
          setMessage(''); 
          if(audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        }}
        className="mt-12 text-pink-300 hover:text-rose-500 font-medium transition-colors bg-white/50 px-8 py-3 rounded-full hover:bg-white/80"
      >
        Replay Our Love Story ✨
      </button>
    </div>
  );

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-[#fffbfb]">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />
      
      {/* Floating Music Toggle */}
      <div className="fixed top-8 right-8 z-[100]">
        <button 
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border-2 border-pink-100 flex items-center justify-center transition-all ${isMuted ? 'opacity-50 grayscale' : 'animate-spin-slow'}`}
        >
          <span className="text-2xl">{isMuted ? '🔇' : '🎵'}</span>
        </button>
      </div>

      <FloatingHearts />
      
      {step !== WizardStep.FINAL && <ProgressDots />}

      <main className="relative z-10 w-full max-w-5xl flex justify-center">
        {step === WizardStep.WELCOME && renderWelcome()}
        {step === WizardStep.TEASE_1 && renderTease1()}
        {step === WizardStep.TEASE_2 && renderTease2()}
        {step === WizardStep.TEASE_3 && renderTease3()}
        {step === WizardStep.TEASE_4 && renderTease4()}
        {step === WizardStep.TEASE_5 && renderTease5()}
        {step === WizardStep.GENERATOR && renderGenerator()}
        {step === WizardStep.FINAL && renderFinal()}
      </main>

      <footer className="fixed bottom-6 left-0 right-0 text-center text-pink-300 text-[11px] tracking-[0.2em] uppercase font-black opacity-40">
        TABACHUY DADA & BEBIE RAERAE • EST 2024 • FOREVER
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
