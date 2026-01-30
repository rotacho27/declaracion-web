"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

// Importaciones de estilos para matemáticas
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// Importación de tus componentes
import Countdown from "../components/Countdown";
import MusicController from "../components/MusicController";
import SplitText from "../components/SplitText";
import DecryptedText from "../components/DecryptedText";
import ScrollReveal from "../components/ScrollReveal";
import CurvedLoop from "../components/CurvedLoop";
import ImageTrail from "../components/ImageTrail";
import Prism from "../components/Prism";

// --- CONFIGURACIÓN ---
const FECHA_DE_DECLARACION = "2026-01-30T18:20:00";
const TOTAL_FRAMES = 79;
const FRAME_PATH = "/frames/x/26452-358778857_";

// --- DATOS: LÍNEA DE TIEMPO ---
const TIMELINE_DATA = [
  {
    date: "10 de abril",
    title: "Donde todo comenzó",
    desc: "Aún recuerdo la primera vez que te vi con esa falda verde y ardiente en el Señor.",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1887&auto=format&fit=crop"
  },
  {
    date: "31 de mayo",
    title: "Un acercamiento inesperado...",
    desc: "Un festejo por el día de la madre que se llevó una gran sorpresa.",
    img: "/images/dia-madre.jpg"
  },
  {
    date: "16 de junio",
    title: "Una muchacha arriesgada",
    desc: "El primer mensaje de muchos.",
    img: "/images/wapp.jpg"
  },
  {
    date: "11 de julio",
    title: "El click",
    desc: "Un día que nunca olvidaré por la manera en que conectamos los dos.",
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
    desc: "Un día hermoso para conocernos y desarmarnos completamente.",
    img: "/images/salida.jpg"
  },
  {
    date: "29 de agosto",
    title: "Confesión de amor",
    desc: "El día más cargado de emociones en todo lo que llevo de vida.",
    img: "/images/lego.png"
  },
  {
    date: "30 de agosto",
    title: "Mi primera muestra de amor",
    desc: "Edificadoras, una flor y un corazón mal hecho.",
    img: "/images/ginebra.jpg"
  },
  {
    date: "5 de septiembre",
    title: "Una primera cita desastrosa",
    desc: "Todo lo que podía salir mal, salió mal. Pero aun así, fue perfecto.",  
    img: "/images/wapp2.jpg"
  },
  {
    date: "20 de septiembre",
    title: "Una verdadera cita",
    desc: "Un musical cargado de recuerdos bonitos y una espera que valió la pena.",
    img: "/images/primera.jpg"
  }
];

// --- DATOS: ESTADÍSTICAS ---
const STATS_DATA = [
  { label: "Mensajes enviados", value: 23964, suffix: "+", color: "text-green-400" },
  { label: "Máximo de Horas en Videollamada", value: 2, suffix: "h", color: "text-blue-400" },
  { label: "Palabra más usada", value: "Tlabaja", isText: true, color: "text-pink-400" }, 
  { label: "Horas pico en chat", value: "11:00 - 1:00", isText: true, suffix: "+", color: "text-yellow-400" }
];

// --- DATOS: DETALLES PERSONALES ---
const BUCKET_LIST = [
  { id: 1, text: "Servir juntos en la congre (y no llegar tarde)", done: false },
  { id: 2, text: "Aprender a cocinar tu plato favorito sin quemar la cocina", done: false },
  { id: 3, text: "Un viaje contigo", done: false },
  { id: 4, text: "Ir a un congraso", done: false },
  { id: 5, text: "Construir un hogar donde Dios sea el centro", done: false },
];

const CODE_POEM = `const myLife = async () => {
  try {
    while (alive) {
      await love("Andrea");
      await support("Andrea");
      await admire("Andrea");
    }
  } catch (pain) {
    return hug("Andrea");
  }
};`;

const SECRET_CARDS = [
  { title: "Mi Promesa", content: "Prometo no solo ser quien te quiera, sino quien te cuide. Prometo esforzarme por entenderte, incluso cuando ni tú te entiendas." },
  { title: "Lo que admiro", content: "Admiro tu pasión por el Señor'. Admiro cómo tu fe me empuja a ser mejor hombre." },
  { title: "Un Secreto", content: "La verdad es que... me gustaste mucho antes del 'Click'. Ese día solo confirmé lo que mi corazón ya sabía." }
];

// --- DATOS Y FUNCIONES: MATEMÁTICAS ---
const generateParametricPath = () => {
    const points = 200;
    let d = [];
    for (let i = 0; i <= points; i++) {
        const t = (i / points) * Math.PI * 2;
        // Escalado manual para viewBox -3 -3 6 6
        const x = (16 * Math.pow(Math.sin(t), 3)) / 6.5;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 6.5;
        d.push(`${x.toFixed(3)},${y.toFixed(3)}`);
    }
    return "M" + d.join(" L") + "Z";
};

const generateCubeRootPath = () => {
   // Ruta SVG aproximada para la forma de corazón "agudo"
   return "M 0.000,1.000 C 0.133,1.000 0.263,0.989 0.389,0.968 C 0.512,0.947 0.631,0.917 0.745,0.879 C 0.856,0.841 0.962,0.796 1.061,0.743 C 1.156,0.689 1.245,0.629 1.328,0.562 C 1.406,0.494 1.478,0.420 1.543,0.340 C 1.603,0.258 1.656,0.170 1.702,0.077 C 1.742,-0.019 1.775,-0.119 1.801,-0.223 C 1.821,-0.329 1.832,-0.438 1.832,-0.550 C 1.832,-0.661 1.821,-0.771 1.801,-0.877 C 1.775,-0.981 1.742,-1.081 1.702,-1.177 C 1.656,-1.270 1.603,-1.358 1.543,-1.440 C 1.478,-1.520 1.406,-1.594 1.328,-1.662 C 1.245,-1.729 1.156,-1.789 1.061,-1.843 C 0.962,-1.896 0.856,-1.941 0.745,-1.979 C 0.631,-2.017 0.512,-2.047 0.389,-2.068 C 0.263,-2.089 0.133,-2.100 0.000,-2.100 C -0.133,-2.100 -0.263,-2.089 -0.389,-2.068 C -0.512,-2.047 -0.631,-2.017 -0.745,-1.979 C -0.856,-1.941 -0.962,-1.896 -1.061,-1.843 C -1.156,-1.789 -1.245,-1.729 -1.328,-1.662 C -1.406,-1.594 -1.478,-1.520 -1.543,-1.440 C -1.603,-1.358 -1.656,-1.270 -1.702,-1.177 C -1.742,-1.081 -1.775,-0.981 -1.801,-0.877 C -1.821,-0.771 -1.832,-0.661 -1.832,-0.550 C -1.832,-0.438 -1.821,-0.329 -1.801,-0.223 C -1.775,-0.119 -1.742,-0.019 -1.702,0.077 C -1.656,0.170 -1.603,0.258 -1.543,0.340 C -1.478,0.420 -1.406,0.494 -1.328,0.562 C -1.245,0.629 -1.156,0.689 -1.061,0.743 C -0.962,0.796 -0.856,0.841 -0.745,0.879 C -0.631,0.917 -0.512,0.947 -0.389,0.968 C -0.263,0.989 -0.133,1.000 0.000,1.000 Z";
}

const MATH_HEARTS = [
    {
        title: "La Implícita Clásica",
        latex: "(x^2 + y^2 - 1)^3 - x^2y^3 = 0",
        path: "M0 1.5 C-1.5 1.5 -3 0 -3 -1.5 C-3 -3 -1.5 -4 0 -5 C1.5 -4 3 -3 3 -1.5 C3 0 1.5 1.5 0 1.5 Z",
        desc: "Compleja, pero define perfectamente el contorno de lo que siento."
    },
    {
        title: "La Paramétrica Suave",
        latex: `\\begin{cases} x = 16 \\sin^3(t) \\\\ y = 13 \\cos(t) - 5 \\cos(2t) - 2 \\cos(3t) - \\cos(4t) \\end{cases}`,
        path: generateParametricPath(),
        desc: "Depende del tiempo (t), como mi amor por ti, que crece a cada segundo."
    },
    {
        title: "La Variante con Raíz Cúbica",
        latex: "x^2 + (y - \\sqrt[3]{x^2})^2 = 1",
        path: generateCubeRootPath(),
        desc: "Una forma moderna y aguda, directo al punto."
    },
    {
        title: "La Sumatoria Infinita (Fourier)",
        latex: "y_N(t) = \\sum_{k=0}^{\\infty} y\\text{-pos}(Heart_k(t))",
        path: generateParametricPath(),
        desc: "Porque la suma de todos los pequeños momentos contigo tiende al infinito."
    }
];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

function getCurrentFrame(index) {
  return `${FRAME_PATH}${String(index).padStart(3, "0")}.jpg.jpg`;
}

const MainContent = () => {
  const container = useRef(null);
  const lenisRef = useRef(null);
  const canvasRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const statRefs = useRef([]);

  // 1. PLAYLIST
  const playlist = [
    { sectionId: "hero", songUrl: "/music/intro.mp3" },
    { sectionId: "zoom-carta-section", songUrl: "/music/intro.mp3" }, 
    { sectionId: "video-scroll", songUrl: "/music/intro.mp3" }, 
    { sectionId: "definition-section", songUrl: "/music/a%20sky%20full%20of%20star.mp3" }, 
    { sectionId: "reasons", songUrl: "/music/a%20sky%20full%20of%20star.mp3" },
    { sectionId: "timeline-section", songUrl: "/music/a%20sky%20full%20of%20star.mp3" }, 
    { sectionId: "stats-section", songUrl: "/music/thing.mp3" }, 
    { sectionId: "math-section", songUrl: "/music/thing.mp3" },
    { sectionId: "code-section", songUrl: "/music/thing.mp3" }, 
    { sectionId: "final", songUrl: "/music/camilo.mp3" }
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

    const timer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
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

    // --- B. SECCIÓN COMBINADA (CARTA) ---
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


    // --- C. VIDEO SCROLL ---
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      canvas.width = 1920; 
      canvas.height = 1080;
      const images = [];
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

    // --- D. DEFINICIÓN (PIN + REVEAL) ---
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


    // --- E. HORIZONTAL SCROLL TIMELINE ---
    const track = timelineTrackRef.current;
    if (track) {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: "#timeline-section",
          start: "top top",
          end: () => `+=${getScrollAmount() * -1 + 1000}`, 
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    }

    // --- F. ESTADÍSTICAS ---
    gsap.fromTo(".stat-card", 
      { y: 100, autoAlpha: 0 },
      {
        y: 0, autoAlpha: 1, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: "#stats-section",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    STATS_DATA.forEach((stat, index) => {
      if (!stat.isText) { 
        const targetElement = statRefs.current[index];
        if(targetElement) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.value,
              duration: 2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: targetElement,
                start: "top 90%", 
              },
              onUpdate: () => {
                targetElement.innerText = Math.floor(obj.val).toLocaleString() + (stat.suffix || "");
              }
            });
        }
      }
    });

    // --- G. MATEMÁTICAS (Dibujo Pizarra) ---
    gsap.utils.toArray(".math-row").forEach((row, i) => {
        const svgPath = row.querySelector(".heart-path");
        const equationCol = row.querySelector(".equation-col");
        
        // Preparar SVG
        const length = svgPath.getTotalLength();
        gsap.set(svgPath, { 
            strokeDasharray: length + 1,
            strokeDashoffset: length + 1,
            opacity: 1
        });
        gsap.set(equationCol, { opacity: 0, x: 20 });

        const tlMath = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: "top 75%", 
                toggleActions: "play none none reverse"
            }
        });

        tlMath
            .to(svgPath, {
                strokeDashoffset: 0,
                duration: 2,
                ease: "power2.inOut"
            })
            .to(equationCol, {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=1.0");
    });

    // --- H. CODE POEM ---
    gsap.from(".code-line", {
      scrollTrigger: {
        trigger: "#code-section",
        start: "top 70%",
      },
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.5
    });

    // --- I. CARTAS SECRETAS ---
    gsap.from(".secret-card", {
        scrollTrigger: {
            trigger: "#secrets-section",
            start: "top 75%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)"
    });

    // --- J. BUCKET LIST ---
    gsap.utils.toArray(".bucket-item").forEach((item, i) => {
        gsap.fromTo(item, 
            { opacity: 0, x: 50 },
            { 
                opacity: 1, 
                x: 0, 
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                delay: i * 0.1
            }
        );
        gsap.to(item.querySelector(".check-box"), {
            backgroundColor: "#4ade80", 
            borderColor: "#4ade80",
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
            },
            delay: i * 0.1 + 0.3,
            duration: 0.3
        });
    });

    // --- K. Pregunta Final ---
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
      
      {/* Estilos para Flip Card 3D */}
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .group:hover .group-hover\\:rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      <MusicController songs={playlist} />

      {/* --- 1. HERO --- */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="bg-image absolute inset-0 z-0 bg-cover bg-center scale-110 opacity-60">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          />
        </div>
        
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

      {/* --- 2. CARTA --- */}
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

      {/* --- 3. VIDEO --- */}
      <section id="video-scroll" className="relative h-screen w-full bg-black overflow-hidden">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 pointer-events-none p-10 md:p-20">
            <div className="scroll-text-1 absolute top-20 left-10 md:top-32 md:left-32 max-w-sm opacity-0">
                <h3 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">Tiempo</h3>
                <p className="text-lg md:text-xl text-slate-300 mt-2">Tiempo y más tiempo...</p>
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

      {/* --- 4. DEFINICIÓN --- */}
      <section id="definition-section" className="relative h-screen bg-black flex items-center justify-center px-6 md:px-20 py-24 z-20">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div id="def-text-col" className="text-left opacity-0">
                    <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Definición de <br /><span className="text-pink-400 text-5xl md:text-7xl">“Linda muchacha”?</span>
                    </h2>
                    <div className="mt-6 h-1 w-24 bg-pink-400/50 rounded-full"></div> 
                </div>
                <div className="relative h-[500px] md:h-[700px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-pink-500/10">
                    <img id="def-image-reveal" src="/images/linda-muchacha.jpg" alt="Foto de ella" className="w-full h-full object-cover" style={{ clipPath: "inset(0% 100% 0% 0%)" }} />
                </div>
            </div>
      </section>

      {/* --- 5. RAZONES --- */}
      <div id="reasons" className="relative min-h-[50vh] bg-black z-20 flex items-center justify-center px-6 py-20">
         <div className="max-w-3xl text-center">
            <ScrollReveal baseOpacity={0.3} enableBlur baseRotation={3} blurStrength={4}>
               Andrea Nicole Ochoa Bustillos, hoy 30 de enero de 2026, es el día en el que quiero pedirte algo muy importante (tambien pedirte que no mires atras jajaja).
               Es importante para mí porque sé que me dirijo a una hija de Papá. Por eso, antes de dar este paso, quiero que 
               sientas todo mi amor. Pero antes, hagamos memoria de todo lo que hemos compartido hasta este momento:
            </ScrollReveal>
         </div>
      </div>

      {/* --- 6. TIMELINE --- */}
      <section id="timeline-section" className="relative h-screen bg-neutral-900 overflow-hidden flex items-center z-20">
        <div className="absolute top-10 left-10 z-30 pointer-events-none">
            <h3 className="text-white/20 text-4xl font-bold uppercase tracking-widest">Nuestra Historia</h3>
        </div>
        <div ref={timelineTrackRef} className="flex h-full w-fit px-10 md:px-32 items-center gap-10 md:gap-40">
            <div className="timeline-item flex-shrink-0 w-[80vw] md:w-[600px] h-[70vh] flex flex-col justify-center">
                <h2 className="text-5xl md:text-8xl font-bold text-white mb-6">Cada fecha <br/> <span className="text-purple-400">cuenta...</span></h2>
                <p className="text-xl text-slate-400 max-w-md">Desliza para ver nuestros mejores momentos →</p>
            </div>
            {TIMELINE_DATA.map((item, index) => (
                <div key={index} className="timeline-item flex-shrink-0 w-[85vw] md:w-[800px] h-[70vh] relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    <div className="absolute inset-0">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm font-bold border border-pink-500/30 backdrop-blur-md">{item.date}</span>
                            <div className="h-[1px] flex-grow bg-white/20"></div>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{item.title}</h3>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl">{item.desc}</p>
                    </div>
                </div>
            ))}
             <div className="timeline-item flex-shrink-0 w-[80vw] md:w-[500px] h-[70vh] flex flex-col justify-center items-center text-center">
                 <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Y la historia <br/> sigue...</h2>
            </div>
        </div>
      </section>

      {/* --- 7. ESTADÍSTICAS --- */}
      <section id="stats-section" className="relative z-20 min-h-screen bg-black flex flex-col items-center justify-center py-20 px-6">
          <div className="max-w-6xl w-full text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
                  Nuestros Números
              </h2>
              <p className="text-slate-400 text-xl">Lo que dicen los datos de nosotros...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
              {STATS_DATA.map((stat, index) => (
                  <div key={index} className="stat-card relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 group overflow-hidden">
                      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity ${stat.color.replace('text-', 'bg-')}`}></div>
                      
                      <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">{stat.label}</h3>
                      <div className="flex items-baseline">
                          <span 
                            ref={(el) => { statRefs.current[index] = el }}
                            className={`text-5xl md:text-6xl font-black ${stat.color}`}
                          >
                            {stat.isText ? stat.value : 0}
                          </span>
                      </div>
                  </div>
              ))}
          </div>

            <CurvedLoop marqueeText="Hoy es el diaaaaaaa ✦" />
      </section>

      {/* --- 8. GALERÍA --- */}
      <div style={{ height: '1080px', position: 'relative', overflow: 'hidden'}}>
        <h2 className="text-center text-amber-100 text-4xl font-bold mt-20">
          MÁS FOTOS PORQUE SI 
        </h2>
        <h3 className="text-center text-amber-100"> (Mueve el mouse)</h3>
        <ImageTrail
          items={[
            '/images/ima/1.jpg', '/images/ima/2.jpg', '/images/ima/3.jpg', '/images/ima/4.jpg',
            '/images/ima/5.jpg', '/images/ima/6.jpg', '/images/ima/7.jpg', '/images/ima/8.jpg',
            '/images/ima/9.jpg', '/images/ima/10.jpg', '/images/ima/11.jpg', '/images/ima/12.jpg',
            '/images/ima/13.jpg', '/images/ima/14.jpg', '/images/ima/15.jpg', '/images/ima/16.jpg',
            '/images/ima/17.jpg'
          ]}
          variant={3}
        />
      </div>

      {/* --- 9. MATEMÁTICAS (NUEVO) --- */}
      <section id="math-section" className="relative z-20 py-32 bg-[#111111] px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-felt.png")' }}></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 text-slate-200 font-mono">
                Si mi amor fueran ecuaciones,<br/> serían estos <span className="text-yellow-500/80" style={{textShadow: '0 0 10px rgba(234, 179, 8, 0.5)'}}>insanos</span>:
            </h2>

            <div className="space-y-24">
                {MATH_HEARTS.map((item, index) => (
                    <div key={index} className="math-row grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                        {/* Columna Izquierda: Dibujo */}
                        <div className="md:col-span-2 flex flex-col items-center">
                            <div className="relative w-48 h-48 md:w-64 md:h-64">
                                <svg className="absolute inset-0 w-full h-full blur-md opacity-30" viewBox="-3 -3 6 6">
                                    <path d={item.path} fill="none" stroke="#FFD700" strokeWidth="0.15" />
                                </svg>
                                <svg className="relative w-full h-full" viewBox="-3 -3 6 6" style={{ overflow: 'visible' }}>
                                    <path 
                                        className="heart-path opacity-0" 
                                        d={item.path} 
                                        fill="none" 
                                        stroke="#FFD700" 
                                        strokeWidth="0.08" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        style={{ filter: 'drop-shadow(0 0 2px #FFD700)' }} 
                                    />
                                </svg>
                            </div>
                            <p className="text-yellow-500/70 text-sm font-mono mt-4 uppercase tracking-widest text-center">{item.title}</p>
                        </div>

                        {/* Columna Derecha: Ecuación */}
                        <div className="equation-col md:col-span-3 text-left opacity-0">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                <div className="text-xl md:text-3xl text-slate-100 font-serif mb-6 overflow-x-auto" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                    <BlockMath math={item.latex} />
                                </div>
                                <p className="text-slate-400 font-mono text-sm md:text-base border-l-2 border-yellow-500/50 pl-4 italic">
                                    // {item.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-20 text-slate-500 font-mono text-sm animate-pulse">
                (Desplázate para calcular el resultado final...)
            </div>
        </div>
      </section>

      {/* --- 10. CODE POEM --- */}
      <section id="code-section" className="relative z-20 py-24 bg-neutral-900 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-center mb-10 text-slate-300">La lógica de mi corazón</h2>
            <div className="bg-[#1e1e1e] rounded-xl p-6 md:p-10 shadow-2xl border border-white/10 font-mono text-sm md:text-base overflow-hidden relative">
                <div className="flex gap-2 mb-6 absolute top-4 left-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mt-6 space-y-2 text-blue-300">
                    {CODE_POEM.split('\n').map((line, i) => (
                        <div key={i} className="code-line flex">
                            <span className="text-slate-600 mr-4 select-none">{i + 1}</span>
                            <pre className="whitespace-pre-wrap font-mono">
                                <span dangerouslySetInnerHTML={{ 
                                    __html: line
                                    .replace('const', '<span class="text-pink-400">const</span>')
                                    .replace('async', '<span class="text-pink-400">async</span>')
                                    .replace('await', '<span class="text-pink-400">await</span>')
                                    .replace('try', '<span class="text-yellow-400">try</span>')
                                    .replace('catch', '<span class="text-yellow-400">catch</span>')
                                    .replace('return', '<span class="text-pink-400">return</span>')
                                    .replace(/"Andrea"/g, '<span class="text-green-300">"Andrea"</span>')
                                }}></span>
                            </pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* --- 11. CARTAS SECRETAS --- */}
      <section id="secrets-section" className="relative z-20 py-32 bg-black px-6">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Tres Verdades
                <span className="block text-sm text-slate-500 font-normal mt-4 tracking-widest uppercase">Pasa el mouse para leer</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SECRET_CARDS.map((card, i) => (
                    <div key={i} className="secret-card group h-[400px] perspective-1000 cursor-pointer">
                        <div className="relative w-full h-full transition-all duration-700 preserve-3d group-hover:rotate-y-180">
                            <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-shadow">
                                <div className="text-6xl mb-6">💌</div>
                                <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                            </div>
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-900 to-black border border-purple-500/30 rounded-2xl flex items-center justify-center p-8 text-center">
                                <p className="text-lg text-slate-200 leading-relaxed font-light">
                                    "{card.content}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 12. BUCKET LIST --- */}
      <section id="bucket-section" className="relative z-20 py-24 bg-neutral-900 px-6 flex justify-center">
        <div className="max-w-3xl w-full">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
                Cosas que quiero hacer <span className="text-green-400">contigo</span>
            </h2>
            <div className="space-y-6">
                {BUCKET_LIST.map((item) => (
                    <div key={item.id} className="bucket-item flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="check-box w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center transition-all duration-500">
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <p className="text-xl md:text-2xl text-slate-300 font-light">{item.text}</p>
                    </div>
                ))}
            </div>
            <p className="text-center text-slate-500 mt-12 italic">
                ...y la lista sigue creciendo.
            </p>
        </div>
      </section>

      {/* --- 13. SECCIÓN FINAL --- */}
      <section id="final" className="relative z-20 h-screen flex flex-col items-center justify-center bg-gradient-to-t from-red-950 via-black to-black px-4">
        <div id="pregunta-content" className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-purple-300 mb-16 drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
            AHORA SI PUEDES MIRAR ATRAS Y ASI YO PODER HACERTE UNA PREGUNTITA QUE TE TENGO HACE MUCHO TIEMPO
          </h2>        </div>
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