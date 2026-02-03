'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations('shared');

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className="flex items-center gap-2 text-sm text-neutral-400"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="hover:text-neutral-600 transition-colors duration-200"
      >
        {t('home')}
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <svg
            className="w-3 h-3 text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-neutral-600 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-600">{item.label}</span>
          )}
        </span>
      ))}
    </motion.nav>
  );
}
