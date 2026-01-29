"use client";
import { useState, useEffect } from "react";
import LiquidEther from './LiquidEther'; 

interface CountdownProps {
  targetDate: string;
  onComplete: () => void;
}

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function calculateTimeLeft() {
    if (typeof window === 'undefined') return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        clearInterval(timer);
        onComplete();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center font-sans py-20 overflow-y-auto overflow-x-hidden">

      {/* --- CAPA DE FONDO --- */}
      <div className="fixed inset-0 z-0">
        <div className="w-full h-full relative">
          <LiquidEther mouseForce={52} />
        </div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 animate-fade-in-up gap-12">

        {/* Título */}
        <h2 className="text-xl md:text-3xl font-light tracking-[0.4em] text-center uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 drop-shadow-sm">
          ALGO ESPECIAL ESTA POR SUCEDER
        </h2>

        {/* Grid de tarjetas de tiempo */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="group relative">
              <div className="relative flex flex-col items-center justify-center 
                            w-24 h-32 md:w-40 md:h-48 
                            bg-white/5 backdrop-blur-xl 
                            border border-white/10 rounded-2xl 
                            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                            transition-all duration-500 ease-out
                            group-hover:bg-white/10 group-hover:scale-105 group-hover:border-white/20">
                <span className="text-4xl md:text-7xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {value < 10 ? `0${value}` : value}
                </span>
                <div className="absolute bottom-4 w-full flex justify-center">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 font-medium group-hover:text-white transition-colors">
                    {unit === 'days' ? 'Días' : unit === 'hours' ? 'Horas' : unit === 'minutes' ? 'Min' : 'Seg'}
                  </span>
                </div>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
              </div>
            </div>
          ))}
        </div>

        {/* --- SECCIÓN NUEVA: MAPA DE GOOGLE --- */}
        <div className="w-full max-w-3xl mt-8 px-2 md:px-0">
            
            {/* Marco de Cristal */}
            <div className="p-2 md:p-3 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col gap-3">
                
                {/* Iframe del Mapa */}
                <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden group">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.130821180739!2d-68.14689352424318!3d-16.51949188422719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915edf002119135b%3A0x944fe2a9b539dcd7!2sMirador%2C%20La%20Paz!5e0!3m2!1ses-419!2sbo!4v1769719965686!5m2!1ses-419!2sbo" 
                        className="w-full h-full border-0 filter grayscale-[50%] invert-[5%] hover:grayscale-0 hover:invert-0 transition-all duration-700 ease-in-out"
                        allowFullScreen={true}
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación del evento"
                    ></iframe>
                </div>

                {/* --- BOTÓN NUEVO PARA ABRIR APP --- */}
                <div className="w-full flex justify-center pb-2">
                    <a 
                        href="https://maps.app.goo.gl/EpyELoCxaYsseYrb8" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-2 rounded-full 
                                   bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/30
                                   transition-all duration-300 group/btn"
                    >
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-300 group-hover/btn:text-white font-medium">
                            Abrir Ubicación
                        </span>
                        {/* Icono de flecha externa */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-transform">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                </div>

            </div>
        </div>

        {/* Texto inferior pulsante */}
        <p className="text-xs md:text-sm text-slate-400 animate-pulse tracking-[0.2em] opacity-70">
          ESPERA UN POCO MAS...
        </p>

      </div>
    </div>
  );
}