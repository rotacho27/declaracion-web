"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

// Importación de tus componentes
import Countdown from "../components/Countdown";
import MusicController from "../components/MusicController";
import SplitText from "../components/SplitText";
import Prism from '../components/Prism';
import DecryptedText from "../components/DecryptedText";
import ScrollAnimation from "../components/ScrollAnimation";

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

// --- CONFIGURACIÓN ---
const FECHA_DE_DECLARACION = "2026-01-30T18:10:00";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MainContent = () => {
  const container = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // 1. PLAYLIST ACTUALIZADA
  const playlist = [
    { sectionId: "hero", songUrl: "/music/a%20sky%20full%20of%20star.mp3" },
    { sectionId: "zoom-carta-section", songUrl: "/music/a%20sky%20full%20of%20star.mp3" }, 
    { sectionId: "reasons", songUrl: "/music/emotional.mp3" }, // <--- NUEVA MÚSICA PARA LA NUEVA SECCIÓN
    { sectionId: "final", songUrl: "/music/climax.mp3" }
  ];

  // 2. INTEGRACIÓN LENIS + GSAP
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  // 3. ANIMACIONES VISUALES
  useGSAP(() => {
    // A. Parallax Hero
    gsap.to(".bg-image", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // B. SECCIÓN COMBINADA (MÁSCARA -> CARTA)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#zoom-carta-section",
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // Animación 1: Escalar + MOVER A LA DERECHA
    tl.to("#mask-text", {
      scale: 100,         
      xPercent: -32,
      duration: 1,
      ease: "power2.inOut"
    })
    .to("#mask-overlay", {
      opacity: 0,
      duration: 0.8,
      ease: "power1.inOut"
    }, "<") 
    
    // Animación 2: Explosión de esquinas
    .to(".corner-text", {
      opacity: 0,
      scale: 2,
      x: (i) => (i === 0 ? -100 : 100),
      duration: 0.5
    }, "<")

    // Animación 3: Revelar carta
    .from("#carta-content", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.5");

    // C. NUEVA ANIMACIÓN PARA LA SECCIÓN DE RAZONES
    gsap.from(".reason-card", {
      scrollTrigger: {
        trigger: "#reasons",
        start: "top 70%", // Comienza cuando la sección está visible
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.3, // Aparecen una por una
      ease: "power3.out"
    });

    // D. Pregunta Final
    gsap.from("#pregunta-content", {
      scrollTrigger: {
        trigger: "#final",
        start: "top center",
      },
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    });

  }, { scope: container });

  return (
    <main ref={container} className="relative bg-black min-h-screen text-white overflow-hidden">

      <MusicController songs={playlist} />

      {/* --- SECCIÓN 1: HERO --- */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="bg-image absolute inset-0 z-0 bg-cover bg-center scale-110 opacity-60">
          {/* <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          /> */}
        </div>

        <div className="relative z-20 w-full text-center px-4 animate-fade-in-up">
          <SplitText
            text="Por fin llegó el momento"
            className="text-5xl md:text-8xl font-serif italic mb-6 drop-shadow-2xl"
            delay={300}
            duration={2}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <p className="text-sm md:text-base uppercase tracking-widest text-slate-300 animate-bounce mt-10">
            Desliza suavemente ↓
          </p>
        </div>
      </section>

      {/* --- SECCIÓN 2 y 3 FUSIONADAS --- */}
      <section id="zoom-carta-section" className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        
        {/* CAPA 1: CARTA (FONDO) */}
        <div id="carta-content" className="absolute inset-0 z-0 flex flex-col items-center justify-center">
          <div className="max-w-2xl text-left space-y-12 px-6">
            
            <div className="space-y-6 text-lg md:text-2xl font-light text-slate-300 leading-relaxed whitespace-pre-line">
                <DecryptedText
                  text={"Es un gusto tenerte aquí.\n\nTe mando un cordial saludo a través de la pantalla!\nSeguramente tienes muchas preguntas en este momento y te aseguro que al final todas serán respondidas. \n\nSolo... sigue bajando."}
                  animateOn="view"
                  revealDirection="start"
                  sequential
                  useOriginalCharsOnly={false} 
                  />
            </div>

          </div>
        </div>

        {/* CAPA 2: MÁSCARA NEGRA */}
        <div id="mask-overlay" className="absolute inset-0 z-10 bg-black" />

        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Texto Superior Izquierda */}
          <div className="corner-text absolute top-10 left-6 md:top-20 md:left-20">
            <h2 className="text-3xl md:text-6xl font-bold uppercase text-[#A0E8AF] tracking-tighter drop-shadow-lg">
              EL 2025 FUE
            </h2>
          </div>

          {/* Texto Central (Máscara) */}
          <div className="corner-text absolute inset-0 flex items-center justify-center">
            <h2 
              id="mask-text"
              className="text-[12vw] font-black uppercase leading-none text-transparent tracking-tighter whitespace-nowrap "
              style={{ WebkitTextStroke: "2px white" }}
            >
              UN GRAN AÑO
            </h2>
          </div>

          {/* Texto Inferior Derecha */}
          <div className="corner-text absolute bottom-10 right-6 md:bottom-20 md:right-20">
            <h2 className="text-3xl md:text-6xl font-bold uppercase text-[#C8B6FF] tracking-tighter drop-shadow-lg text-right">
              VERDAD?
            </h2>
          </div>
        </div>
      </section>

      <section id="video-scroll" className="h-[200vh] bg-black">
        <ScrollAnimation />
      </section>
          
      

      {/* --- SECCIÓN 4: FINAL --- */}
      <section id="final" className="relative z-20 h-screen flex flex-col items-center justify-center bg-gradient-to-t from-red-950 via-black to-black px-4">
        <div id="pregunta-content" className="text-center">

          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-purple-300 mb-16 drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
            ¿Quieres ser mi novia?
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <button
              onClick={() => alert("¡TE AMO! ❤️ (Ahora corre a abrazarme)")}
              className="px-12 py-5 bg-white text-black text-xl md:text-2xl font-bold rounded-full hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300"
            >
              ¡SÍ, ACEPTO! ❤️
            </button>
            <button
              className="px-8 py-4 border border-white/20 text-white/40 text-sm md:text-lg rounded-full cursor-not-allowed opacity-50 hover:bg-red-900/20"
              title="Esta opción no está disponible en tu universo"
            >
              Lo pensaré...
            </button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const now = new Date().getTime();
    const target = new Date(FECHA_DE_DECLARACION).getTime();

    if (now >= target) {
      setIsUnlocked(true);
    }
    setIsChecking(false);
  }, []);

  if (isChecking) return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full"></div>
    </div>
  );

  return (
    <>
      {isUnlocked ? (
        <MainContent />
      ) : (
        <Countdown
          targetDate={FECHA_DE_DECLARACION}
          onComplete={() => setIsUnlocked(true)}
        />
      )}
    </>
  );
}