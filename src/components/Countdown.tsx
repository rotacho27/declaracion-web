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

  // Evita problemas de hidratación renderizando solo en cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  function calculateTimeLeft() {
    // Verificación de seguridad para evitar errores en servidor
    if (typeof window === 'undefined') return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const difference = +new Date(targetDate) - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

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
    <div className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* --- CAPA DE FONDO --- */}
      <div className="absolute inset-0 z-0">
        {/* Cambié height: 600 por h-full para que cubra toda la pantalla siempre */}
        <div className="w-full h-full relative">
          <LiquidEther mouseForce={52} />
        </div>
        
        {/* Gradiente radial para enfocar la vista en el centro y oscurecer esquinas */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 animate-fade-in-up">
        
        {/* Título con efecto gradiente metálico */}
        <h2 className="text-xl md:text-3xl font-light tracking-[0.4em] mb-16 text-center uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 drop-shadow-sm">
          ALGO ESPECIAL ESTA POR SUCEDER
        </h2>
        
        {/* Grid de tarjetas de tiempo */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div key={unit} className="group relative">
              
              {/* Tarjeta de Cristal (Glassmorphism) */}
              <div className="relative flex flex-col items-center justify-center 
                            w-24 h-32 md:w-40 md:h-48 
                            bg-white/5 backdrop-blur-xl 
                            border border-white/10 rounded-2xl 
                            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                            transition-all duration-500 ease-out
                            group-hover:bg-white/10 group-hover:scale-105 group-hover:border-white/20">
                
                {/* Número */}
                <span className="text-4xl md:text-7xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {value < 10 ? `0${value}` : value}
                </span>
                
                {/* Etiqueta */}
                <div className="absolute bottom-4 w-full flex justify-center">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 font-medium group-hover:text-white transition-colors">
                    {unit === 'days' ? 'Días' : unit === 'hours' ? 'Horas' : unit === 'minutes' ? 'Min' : 'Seg'}
                  </span>
                </div>

                {/* Brillo sutil en el borde superior */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
              </div>

            </div>
          ))}

        </div>

        {/* Texto inferior pulsante */}
        <p className="mt-20 text-xs md:text-sm text-slate-400 animate-pulse tracking-[0.2em] opacity-70">
          ESPERA UN POCO MAS...
        </p>
        
      </div>
    </div>
  );
}