'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useMemo } from 'react';

export default function Hero() {
  const t = useTranslations('hero');
  const headlineStart = t('headlineStart');
  const highlight = t('headlineHighlight');
  
  // Get rotating words as raw value and parse it
  const rotatingWordsRaw = t.raw('rotatingWords') as string[];

  // Build the typing sequence: [word1, delay, word2, delay, ...]
  const typingSequence = useMemo(() => {
    const sequence: (string | number)[] = [];
    rotatingWordsRaw.forEach((word) => {
      sequence.push(word);
      sequence.push(4000); // Wait 4 seconds before typing next word
    });
    return sequence;
  }, [rotatingWordsRaw]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(8px)',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const subtextVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.8,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 1.1,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  // Split headline into words and render with highlight
  const renderAnimatedHeadline = () => {
    const words = headlineStart.split(' ');
    
    return (
      <>
        {words.map((word, index) => {
          const isHighlight = word === highlight || word.includes(highlight);
          
          return (
            <motion.span
              key={index}
              variants={wordVariants}
              className={`inline-block mr-[0.25em] ${isHighlight ? 'text-purple-500' : ''}`}
            >
              {word}
            </motion.span>
          );
        })}
        {/* Animated rotating word - whitespace-nowrap prevents line break */}
        <motion.span
          variants={wordVariants}
          className="inline-block text-purple-500 whitespace-nowrap"
        >
          <TypeAnimation
            sequence={typingSequence}
            wrapper="span"
            speed={30}
            deletionSpeed={30}
            repeat={Infinity}
            cursor={false}
            preRenderFirstString={true}
          />
        </motion.span>
      </>
    );
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Plain white background */}
      <div className="absolute inset-0 bg-white" />

      {/* Content - Bottom Center */}
      <div className="absolute bottom-32 inset-x-0 sm:bottom-28 md:bottom-24 flex justify-center px-6 sm:px-12 md:px-16 z-10">
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium text-black mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-normal"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {renderAnimatedHeadline()}
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/70 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl font-light"
          variants={subtextVariants}
          initial="hidden"
          animate="visible"
        >
          {t('subtext')}
        </motion.p>
        
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-black text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium tracking-wide hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          >
            {t('needAdvice')}
          </Link>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

