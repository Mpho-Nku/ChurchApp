'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

export default function PostMediaGrid({
  media,
}: {
  media: { url: string; type: 'image' | 'video' }[];
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (i: number) => {
    setSelectedIndex(i);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const nextMedia = useCallback(() => {
    setSelectedIndex((i) => (i + 1) % media.length);
  }, [media.length]);
  const prevMedia = useCallback(() => {
    setSelectedIndex((i) => (i - 1 + media.length) % media.length);
  }, [media.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, nextMedia, prevMedia]);

  if (!media || media.length === 0) return null;

  const visibleMedia = media.slice(0, 5);
  const extraCount = media.length - 5;

  return (
    <div className="relative w-full">
      {/* --- Thumbnail Grid --- */}
      <div
        className={`grid gap-1 ${
          media.length === 1
            ? 'grid-cols-1'
            : media.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-2 grid-rows-2'
        }`}
      >
        {visibleMedia.map((item, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className={`relative overflow-hidden cursor-pointer rounded-lg ${
              media.length === 3 && idx === 0 ? 'col-span-2' : ''
            }`}
          >
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={`media-${idx}`}
                width={800}
                height={800}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            ) : (
              <div className="relative w-full h-full bg-black">
                <video
                  src={item.url}
                  className="object-cover w-full h-full opacity-90"
                  muted
                />
                <PlayCircleIcon className="absolute inset-0 m-auto text-white h-12 w-12 opacity-80" />
              </div>
            )}

            {/* “+x” overlay */}
            {idx === 4 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">+{extraCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- Full-Screen Lightbox --- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 bg-black bg-opacity-70 text-white p-2 rounded-full z-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Previous / Next */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-6 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeftIcon className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-6 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRightIcon className="h-8 w-8" />
                  </button>
                </>
              )}

              {/* Media Display */}
              {media[selectedIndex].type === 'image' ? (
                <Image
                  src={media[selectedIndex].url}
                  alt="Expanded"
                  width={1200}
                  height={1200}
                  className="max-h-[90vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={media[selectedIndex].url}
                  controls
                  autoPlay
                  className="max-h-[90vh] rounded-lg"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
