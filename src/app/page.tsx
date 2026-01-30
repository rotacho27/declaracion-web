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
import DecryptedText from "../components/DecryptedText";
import ScrollReveal from "../components/ScrollReveal";

// --- CONFIGURACIÓN ---
const FECHA_DE_DECLARACION = "2026-01-29T17:10:00";
const TOTAL_FRAMES = 79;
const FRAME_PATH = "/frames/26452-358778857_";

// --- DATOS DE LA LÍNEA DE TIEMPO (¡EDITA ESTO!) ---
const TIMELINE_DATA = [
  {
    date: "10 de abril",
    title: "Donde todo comenzó",
    desc: "Aún recuerdo la primera vez que que te vi con esa falta verde y ardiente en el Señor.",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1887&auto=format&fit=crop"
  },
  {
    date: "31 de mayo",
    title: "Un acercamiento inesperado...",
    desc: "Un festejo por el día de la madre que se llevó una gran sorpresa.",
    img: "/images/dia-madre.jpeg"
  },
  {
    date: "16 de junio",
    title: "Una muchacha arriesgada",
    desc: "El primer mensaje de muchos.",
    img: "/images/wapp.jpeg"
  },
  {
    date: "11 de julio",
    title: "El click",
    desc: "Un día que nunca olvidare por la manera en que conectamos los dos.",
    img: "/images/click.png"
  },
  {
    date: "18 de julio",
    title: "Una plantada terrible",
    desc: "Nunca me perdonaré por dejarte ese día afuera de la congre jaja.",
    img: "/images/pizza.png"
  },
  {
    date: "06 de agosto",
    title: "Nuestra primera salida",
    desc: "Una día hermoso para conocernos y desarmarnos completamente.",
    img: "/images/salida.jpeg"
  },
  {
    date: "29 de agosto",
    title: "Confesión de amor",
    desc: "El día mas cargado de emociones en todo lo que llevo de vida.",
    img: "/images/lego.png"
  },
  {
    date: "30 de agosto",
    title: "Mi primera muestra de amor",
    desc: "Edificadoras, una flor y un corazon mal hecho",
    img: "/images/ginebra.jpeg"
  },
  {
    date: "5 de septiembre",
    title: "Una primera cita desastrosa",
    desc: "Todo lo que podia salir mal, salió mal. Pero aun así, fue perfecto.",  
    img: "/images/wapp2.jpeg"
  },
  {
    date: "20 de septiembre",
    title: "Una verdadera cita",
    desc: "Un musical cargado de recuerdos bonitos y una espera que valió la pena.",
    img: "/images/primera.jpeg"
  }
];


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

function getCurrentFrame(index: number) {
  return `${FRAME_PATH}${String(index).padStart(3, "0")}.jpg`;
}

const MainContent = () => {
  const container = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Referencia para el contenedor que se moverá horizontalmente
  const timelineTrackRef = useRef<HTMLDivElement>(null);

  // 1. PLAYLIST
  const playlist = [
    { sectionId: "hero", songUrl: "/music/intro.mp3" },
    { sectionId: "zoom-carta-section", songUrl: "/music/intro.mp3" }, 
    { sectionId: "video-scroll", songUrl: "/music/intro.mp3" }, 
    { sectionId: "definition-section", songUrl: "/music/a%20sky%20full%20of%20star.mp3" }, 
    { sectionId: "reasons", songUrl: "/music/emotional.mp3" },
    { sectionId: "timeline-section", songUrl: "/music/emotional.mp3" }, // Agregado al playlist
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
    
    // --- A. Parallax Hero ---
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

    // --- B. SECCIÓN COMBINADA ---
    const tlMask = gsap.timeline({
      scrollTrigger: {
        trigger: "#zoom-carta-section",
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    tlMask.to("#mask-text", { scale: 100, xPercent: -32, duration: 1, ease: "power2.inOut" })
    .to("#mask-overlay", { opacity: 0, duration: 0.8, ease: "power1.inOut" }, "<") 
    .to(".corner-text", { opacity: 0, scale: 2, x: (i) => (i === 0 ? -100 : 100), duration: 0.5 }, "<")
    .from("#carta-content", { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.5");


    // --- D. VIDEO SCROLL ---
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      canvas.width = 1920; 
      canvas.height = 1080;
      const images: HTMLImageElement[] = [];
      const playhead = { frame: 0 };
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getCurrentFrame(i);
        images.push(img);
      }
      const render = () => {
        const frameIndex = Math.round(playhead.frame);
        const img = images[frameIndex];
        if (img && img.complete) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
      images[0].onload = render;
      const tlVideo = gsap.timeline({
        scrollTrigger: {
          trigger: "#video-scroll",
          start: "top top",
          end: "+=4000", 
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });
      tlVideo.to(playhead, { frame: TOTAL_FRAMES - 1, ease: "none", duration: 1, onUpdate: render }, 0);
      tlVideo.fromTo(".scroll-text-1", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.1)
      .to(".scroll-text-1", { autoAlpha: 0, y: -50, duration: 0.1 }, 0.3);
      tlVideo.fromTo(".scroll-text-2", { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: 0.1 }, 0.4)
      .to(".scroll-text-2", { autoAlpha: 0, x: -50, duration: 0.1 }, 0.6);
      tlVideo.fromTo(".scroll-text-3", { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.1 }, 0.7);
    }

    // --- DEFINICIÓN (PIN + REVEAL) ---
    const tlDef = gsap.timeline({
        scrollTrigger: {
            trigger: "#definition-section",
            start: "top top",
            end: "+=3000",
            pin: true,
            scrub: 1,
            anticipatePin: 1
        }
    });
    tlDef.fromTo("#def-text-col", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .fromTo("#def-image-reveal", 
        { clipPath: "inset(0% 100% 0% 0%)", scale: 1.1 }, 
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 2, ease: "power4.inOut" }, 
        "-=0.2" 
    )
    .to({}, { duration: 0.5 });


    // --- NUEVO: HORIZONTAL SCROLL TIMELINE ---
    const track = timelineTrackRef.current;
    if (track) {
      // Calculamos cuánto tenemos que mover el track hacia la izquierda.
      // (Ancho total del track - Ancho de la ventana)
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);
      
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: "#timeline-section",
          start: "top top",
          // Ajusta el 'end' para hacer el scroll más lento o rápido
          end: () => `+=${getScrollAmount() * -1 + 1000}`, 
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // Recalcula si cambia el tamaño de ventana
        }
      });
    }


    // --- E. Pregunta Final ---
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
        <div className="bg-image absolute inset-0 z-0 bg-cover bg-center scale-110 opacity-60"></div>
        <div className="relative z-20 w-full text-center px-4 animate-fade-in-up">
          <SplitText
            text="Por fin llegó el momento"
            className="text-5xl md:text-8xl font-serif italic mb-6 drop-shadow-2xl"
            delay={300} duration={2} ease="power3.out" splitType="chars"
            from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }}
            threshold={0.1} rootMargin="-100px" textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <p className="text-sm md:text-base uppercase tracking-widest text-slate-300 animate-bounce mt-10">Desliza suavemente ↓</p>
        </div>
      </section>

      {/* --- SECCIÓN 2: CARTA --- */}
      <section id="zoom-carta-section" className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        <div id="carta-content" className="absolute inset-0 z-0 flex flex-col items-center justify-center">
          <div className="max-w-2xl text-left space-y-12 px-6">
            <div className="space-y-6 text-lg md:text-2xl font-light text-slate-300 leading-relaxed whitespace-pre-line">
                <DecryptedText
                  text={"Es un gusto tenerte aquí.\n\nTe mando un cordial saludo a través de la pantalla!\nFué un largo camino para que llegaras hasta acá... Seguramente tienes muchas preguntas.\n\nSolo... sigue bajando."}
                  animateOn="view" revealDirection="start" sequential useOriginalCharsOnly={false} 
                  />
            </div>
          </div>
        </div>
        <div id="mask-overlay" className="absolute inset-0 z-10 bg-black" />
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="corner-text absolute top-10 left-6 md:top-20 md:left-20">
            <h2 className="text-3xl md:text-6xl font-bold uppercase text-[#A0E8AF] tracking-tighter drop-shadow-lg">EL 2025 FUE</h2>
          </div>
          <div className="corner-text absolute inset-0 flex items-center justify-center">
            <h2 id="mask-text" className="text-[12vw] font-black uppercase leading-none text-transparent tracking-tighter whitespace-nowrap" style={{ WebkitTextStroke: "2px white" }}>UN GRAN AÑO</h2>
          </div>
          <div className="corner-text absolute bottom-10 right-6 md:bottom-20 md:right-20">
            <h2 className="text-3xl md:text-6xl font-bold uppercase text-[#C8B6FF] tracking-tighter drop-shadow-lg text-right">VERDAD?</h2>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN VIDEO --- */}
      <section id="video-scroll" className="relative h-screen w-full bg-black overflow-hidden">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 pointer-events-none p-10 md:p-20">
            <div className="scroll-text-1 absolute top-20 left-10 md:top-32 md:left-32 max-w-sm opacity-0">
                <h3 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">Tiempo</h3>
                <p className="text-lg md:text-xl text-slate-300 mt-2">Tiempo y mas tiempo...</p>
            </div>
            <div className="scroll-text-2 absolute top-1/2 right-10 md:right-32 -translate-y-1/2 text-right max-w-sm opacity-0">
                <h3 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">¿Cuánto TIEMPO estuviste esperando?</h3>
                <p className="text-lg md:text-xl text-slate-300 mt-2">Hasta este momento...</p>
            </div>
            <div className="scroll-text-3 absolute bottom-20 left-10 md:bottom-32 md:left-32 text-left max-w-sm opacity-0">
                <h3 className="text-3xl md:text-5xl font-bold text-[#FFB6C1] drop-shadow-lg">Linda</h3>
                <p className="text-lg md:text-xl text-slate-300 mt-2">Muchacha.</p>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN DEFINICIÓN --- */}
      <section id="definition-section" className="relative h-screen bg-black flex items-center justify-center px-6 md:px-20 py-24 z-20">
           <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
               <div id="def-text-col" className="text-left opacity-0">
                   <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                       Definición de <br /><span className="text-pink-400 text-5xl md:text-7xl">“Linda muchacha”?</span>
                   </h2>
                   <div className="mt-6 h-1 w-24 bg-pink-400/50 rounded-full"></div> 
               </div>
               <div className="relative h-[500px] md:h-[700px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-pink-500/10">
                   <img id="def-image-reveal" src="/images/linda-muchacha.jpeg" alt="Foto de ella" className="w-full h-full object-cover" style={{ clipPath: "inset(0% 100% 0% 0%)" }} />
               </div>
           </div>
      </section>

      {/* --- SECCIÓN RAZONES --- */}
      <div id="reasons" className="relative min-h-[50vh] bg-black z-20 flex items-center justify-center px-6 py-20">
         <div className="max-w-3xl text-center">
            <ScrollReveal baseOpacity={0.3} enableBlur baseRotation={3} blurStrength={4}>
                Andrea Nicole Ochoa Bustillos, hoy 30 de enero de 2026, es el día en el que quiero pedirte algo muy importante.
                Es importante para mí porque sé que me dirijo a una hija de Papá. Por eso, antes de dar este paso, quiero que 
                sientas todo mi amor. Pero antes, hagamos memoria de todo lo que hemos compartido hasta este momento:
            </ScrollReveal>
         </div>
      </div>

      {/* --- NUEVA SECCIÓN: TIMELINE (SCROLL HORIZONTAL) --- */}
      <section id="timeline-section" className="relative h-screen bg-neutral-900 overflow-hidden flex items-center z-20">
        
        {/* Título flotante (opcional, fijo a la izquierda) */}
        <div className="absolute top-10 left-10 z-30 pointer-events-none">
            <h3 className="text-white/20 text-4xl font-bold uppercase tracking-widest">Nuestra Historia</h3>
        </div>

        {/* El Track que se mueve horizontalmente */}
        <div ref={timelineTrackRef} className="flex h-full w-fit px-10 md:px-32 items-center gap-10 md:gap-40">
            
            {/* Tarjeta de Inicio (Intro) */}
            <div className="timeline-item flex-shrink-0 w-[80vw] md:w-[600px] h-[70vh] flex flex-col justify-center">
                <h2 className="text-5xl md:text-8xl font-bold text-white mb-6">
                    Cada fecha <br/> 
                    <span className="text-purple-400">cuenta...</span>
                </h2>
                <p className="text-xl text-slate-400 max-w-md">Desliza para ver nuestros mejores momentos →</p>
            </div>

            {/* Mapeo de eventos */}
            {TIMELINE_DATA.map((item, index) => (
                <div key={index} className="timeline-item flex-shrink-0 w-[85vw] md:w-[800px] h-[70vh] relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                    
                    {/* Contenido */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm font-bold border border-pink-500/30 backdrop-blur-md">
                                {item.date}
                            </span>
                            <div className="h-[1px] flex-grow bg-white/20"></div>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{item.title}</h3>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl">{item.desc}</p>
                    </div>
                </div>
            ))}

            {/* Tarjeta Final */}
            <div className="timeline-item flex-shrink-0 w-[80vw] md:w-[500px] h-[70vh] flex flex-col justify-center items-center text-center">
                 <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Y la historia <br/> sigue...
                </h2>
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    <span className="text-2xl">↓</span>
                </div>
            </div>

        </div>
      </section>


      {/* --- SECCIÓN FINAL --- */}
      <section id="final" className="relative z-20 h-screen flex flex-col items-center justify-center bg-gradient-to-t from-red-950 via-black to-black px-4">
        <div id="pregunta-content" className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-purple-300 mb-16 drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
            ¿Quieres ser mi novia?
          </h2>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <button onClick={() => alert("¡TE AMO! ❤️")} className="px-12 py-5 bg-white text-black text-xl md:text-2xl font-bold rounded-full hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300">
              ¡SÍ, ACEPTO! ❤️
            </button>
            <button className="px-8 py-4 border border-white/20 text-white/40 text-sm md:text-lg rounded-full cursor-not-allowed opacity-50">
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
    if (now >= target) setIsUnlocked(true);
    setIsChecking(false);
  }, []);

  if (isChecking) return <div className="h-screen w-full bg-black flex items-center justify-center"><div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full"></div></div>;

  return <>{isUnlocked ? <MainContent /> : <Countdown targetDate={FECHA_DE_DECLARACION} onComplete={() => setIsUnlocked(true)} />}</>;
}