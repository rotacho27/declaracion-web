import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 79; // número de frames exportados
const FRAME_PATH = "/images/frames/Ajuste_de_Prompt_para_Video_"; // ruta base

function getCurrentFrame(index: number) {
  return `${FRAME_PATH}${String(index).padStart(3, "0")}.jpg`;
}

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const img = new Image();
    img.src = getCurrentFrame(0);
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const section = document.getElementById("video-scroll");
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollTop = -rect.top; // avance dentro de la sección
      const sectionHeight = rect.height - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / sectionHeight, 0), 1);

      const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
      const img = new Image();
      img.src = getCurrentFrame(frameIndex);
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
  <div className="sticky top-0 h-screen">
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="w-screen h-screen object-cover"
    />
  </div>

  );
}
