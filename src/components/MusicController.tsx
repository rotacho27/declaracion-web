"use client";
import { useEffect, useRef, useState } from "react";

interface SongSection {
  sectionId: string;
  songUrl: string;
}

export default function MusicController({ songs }: { songs: SongSection[] }) {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = songs.findIndex((s) => s.sectionId === entry.target.id);
            if (index !== -1) setCurrentSongIndex(index);
          }
        });
      },
      { threshold: 0.4 }
    );
    songs.forEach((song) => {
      const el = document.getElementById(song.sectionId);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [songs]);

  useEffect(() => {
    if (!hasInteracted || currentSongIndex === -1 || !audioRef.current) return;
    const nextSongUrl = songs[currentSongIndex].songUrl;
    if (audioRef.current.src.includes(nextSongUrl)) return;

    const audio = audioRef.current;
    if (fadeInterval.current) clearInterval(fadeInterval.current);

    const fadeOutAndIn = () => {
      let vol = audio.volume;
      fadeInterval.current = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.1;
          audio.volume = vol;
        } else {
          if (fadeInterval.current) clearInterval(fadeInterval.current);
          audio.src = nextSongUrl;
          audio.play();
          audio.volume = 0;
          // Fade In
          let volIn = 0;
          const inInterval = setInterval(() => {
            if (volIn < 0.9) {
              volIn += 0.05;
              audio.volume = volIn;
            } else {
              clearInterval(inInterval);
            }
          }, 100);
        }
      }, 100);
    };

    if (!audio.paused && audio.src) {
      fadeOutAndIn();
    } else {
      audio.src = nextSongUrl;
      audio.play();
      audio.volume = 1;
    }
  }, [currentSongIndex, hasInteracted, songs]);

  if (!hasInteracted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <button
          onClick={() => setHasInteracted(true)}
          className="px-8 py-3 bg-white text-black text-xl rounded-full hover:scale-105 transition-transform font-serif animate-pulse"
        >
          Descubrirlo...
        </button>
      </div>
    );
  }
  return null;
}