'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ContentCardProps {
  href: string;
  image?: string;
  category: string;
  title: string;
  description: string;
  gradient?: string;
  index?: number;
  isInView?: boolean;
  metadata?: string;
  featured?: boolean;
}

export default function ContentCard({
  href,
  image,
  category,
  title,
  description,
  gradient = 'bg-gradient-to-br from-neutral-100 to-neutral-50',
  index = 0,
  isInView = true,
  metadata,
  featured = false,
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <Link href={href} className="group block">
        {/* Image Container */}
        <div
          className={`relative ${
            featured ? 'aspect-video' : 'aspect-4/3'
          } rounded-2xl overflow-hidden mb-5 ${gradient}`}
        >
          {image && !imageError ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Category and Metadata Row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400">
              {category}
            </span>
            {metadata && (
              <span className="text-[11px] font-medium text-neutral-400">
                {metadata}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`font-semibold text-neutral-900 leading-tight tracking-tight group-hover:text-neutral-700 transition-colors duration-300 ${
              featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
            }`}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className={`text-neutral-500 leading-relaxed ${
              featured ? 'text-base md:text-lg' : 'text-sm md:text-[15px]'
            }`}
          >
            {description}
          </p>

          {/* Read more indicator */}
          <div className="flex items-center gap-2 text-neutral-400 group-hover:text-neutral-900 transition-colors duration-300 pt-1">
            <span className="text-sm font-medium">Read more</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
