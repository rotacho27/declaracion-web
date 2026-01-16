"use client";
import { useState, useEffect } from "react";
import Countdown from "../components/Countdown"; // Ajusta la ruta si es necesario
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const FECHA_DE_DECLARACION = "2026-01-28T22:10:00"; 

// --- Componente con el contenido de la declaración (Lo que ya teníamos) ---
const MainContent = () => {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  const container = useRef(null);

  useGSAP(() => {
    gsap.to(".bg-image", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    // ... resto de tus animaciones ...
  }, { scope: container });

  return (
    <main ref={container} className="relative animate-fade-in">
      <section className="hero-section relative h-[120vh] flex items-center justify-center overflow-hidden">
        <div className="bg-image absolute inset-0 z-0 bg-[url('/foto.jpg')] bg-cover bg-center scale-110" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="hero-text relative z-20 text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-serif italic mb-4">Por fin llegó el momento</h1>
        </div>
      </section>
      {/* Resto del contenido */}
    </main>
  );
};

// --- Página Principal (Lógica del Contador) ---
export default function Home() {
  // Estado para saber si ya es hora
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificación inicial al cargar para evitar "flasheo" del contador si ya pasó la fecha
    const now = new Date().getTime();
    const target = new Date(FECHA_DE_DECLARACION).getTime();
    
    if (now >= target) {
      setIsUnlocked(true);
    }
    setIsChecking(false);
  }, []);

  if (isChecking) return null; // O un spinner de carga simple

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