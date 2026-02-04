'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-100 border-t border-neutral-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Company Info Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900">
              Pluscode Sp. z o.o.
            </h3>
            
            <div className="space-y-1 text-sm text-neutral-600">
              <p>Kosowska 12 / 3</p>
              <p>60-464 Poznań, Polska</p>
            </div>

            <div className="space-y-2">
              <a 
                href="mailto:contact@pluscode.io"
                className="block text-sm text-neutral-900 font-medium underline underline-offset-2 hover:text-neutral-600 transition-colors"
              >
                contact@pluscode.io
              </a>
              <a 
                href="tel:+48667688927"
                className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                +48 667 688 927
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.linkedin.com/company/pluscode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-purple-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/pluscode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-purple-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Registration Info Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">{t('krs')}</p>
                <p className="text-neutral-900 font-medium">0000811470</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">{t('nip')}</p>
                <p className="text-neutral-900 font-medium">7812002984</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">{t('regon')}</p>
                <p className="text-neutral-900 font-medium">384741150</p>
              </div>
            </div>
          </div>

          {/* Empty column for spacing on larger screens */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              ©{currentYear} Pluscode Sp. z o.o. {t('allRightsReserved')}
            </p>
            
            <div className="flex items-center gap-8">
              <Link 
                href="/privacy-policy" 
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {t('privacyPolicy')}
              </Link>
              <Link 
                href="/terms-of-use" 
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {t('termsOfUse')}
              </Link>
              <Link 
                href="/site-map" 
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {t('sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
