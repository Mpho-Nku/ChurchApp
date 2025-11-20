"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PostCarousel({ images = [] }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [holding, setHolding] = useState(false);

  const next = () => {
    if (index < images.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleTap = (e: any) => {
    const x = e.clientX;
    const screenWidth = window.innerWidth;

    if (x < screenWidth / 2) prev();
    else next();
  };

  const handleDoubleTap = () => {
    setZoom((z) => !z);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50) next();
    if (info.offset.x > 50) prev();
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="relative w-full bg-black select-none overflow-hidden"
      onMouseDown={() => setHolding(true)}
      onMouseUp={() => setHolding(false)}
      onClick={handleTap}
      onDoubleClick={handleDoubleTap}
    >
      {/* BLURRED BACKDROP */}
      <div className="absolute inset-0 blur-xl opacity-40">
        <Image
          src={images[index]}
          alt="blur-bg"
          fill
          className="object-cover"
        />
      </div>

      {/* MAIN SLIDE */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 80 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: zoom ? 1.7 : 1,
            }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: holding ? 1.2 : 0.35 }}
            drag={!zoom ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <Image
              src={images[index]}
              alt=""
              fill
              className={`object-contain transition-all ${
                zoom ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ARROWS (Instagram style - only appear on desktop) */}
      <div className="hidden md:block">
        {index > 0 && (
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {index < images.length - 1 && (
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* IMAGE COUNTER TOP-RIGHT */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
        {index + 1} / {images.length}
      </div>

      {/* DOTS */}
      {images.length > 1 && (
        <div className="absolute bottom-3 w-full flex justify-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
