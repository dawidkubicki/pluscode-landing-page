'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAnnouncement } from './AnnouncementContext';
import Link from 'next/link';

export interface AnnouncementData {
  text: string;
  linkText?: string | null;
  linkUrl?: string | null;
}

interface AnnouncementBarProps {
  announcement?: AnnouncementData | null;
}

export default function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const { isVisible, setIsVisible } = useAnnouncement();
  
  // Don't render if no announcement data
  if (!announcement || !announcement.text) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative w-full bg-black overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="mx-auto max-w-[1400px] flex items-center justify-between">
              {/* Announcement text - left aligned */}
              <p className="text-white text-xs sm:text-sm font-normal tracking-wide">
                <span className="text-purple-400 mr-2">✦</span>
                {announcement.text}
                {announcement.linkText && announcement.linkUrl && (
                  <>
                    {' '}
                    <Link 
                      href={announcement.linkUrl} 
                      className="underline hover:text-purple-400 transition-colors duration-200 cursor-pointer"
                    >
                      {announcement.linkText}
                    </Link>
                  </>
                )}
              </p>

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="ml-4 p-1.5 text-white/60 hover:text-white transition-colors duration-200 group shrink-0 cursor-pointer"
                aria-label="Close announcement"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
