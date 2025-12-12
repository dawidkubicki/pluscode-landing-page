'use client';

import { useState, useEffect, useLayoutEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface DropdownItem {
  title: string;
  description: string;
  href: string;
}

export default function Navigation() {
  const t = useTranslations('navigation');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [locale, setLocale] = useState('en');
  
  // Use layout effect to sync locale before paint (avoids flash of wrong language)
  useLayoutEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1];
    if (cookieLocale && cookieLocale !== 'en') {
      // Use startTransition to indicate this is a non-urgent update
      startTransition(() => {
        setLocale(cookieLocale);
      });
    }
  }, []);

  const currentLocale = locale;

  const changeLocale = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    setLocale(newLocale);
    window.location.reload();
  };

  const aiDataItems: DropdownItem[] = [
    {
      title: t('aiDataItems.machineLearning.title'),
      description: t('aiDataItems.machineLearning.description'),
      href: '/ai-data/machine-learning',
    },
    {
      title: t('aiDataItems.dataAnalytics.title'),
      description: t('aiDataItems.dataAnalytics.description'),
      href: '/ai-data/analytics',
    },
    {
      title: t('aiDataItems.aiConsulting.title'),
      description: t('aiDataItems.aiConsulting.description'),
      href: '/ai-data/consulting',
    },
  ];

  const servicesItems: DropdownItem[] = [
    {
      title: t('servicesItems.webDevelopment.title'),
      description: t('servicesItems.webDevelopment.description'),
      href: '/services/web-development',
    },
    {
      title: t('servicesItems.mobileApps.title'),
      description: t('servicesItems.mobileApps.description'),
      href: '/services/mobile',
    },
    {
      title: t('servicesItems.cloudSolutions.title'),
      description: t('servicesItems.cloudSolutions.description'),
      href: '/services/cloud',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if user has scrolled past threshold (50px)
      setHasScrolled(currentScrollY > 50);

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide nav
        setIsVisible(false);
      } else {
        // Scrolling up - show nav
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        hasScrolled ? 'pt-3' : 'pt-6'
      }`}
    >
      <nav 
        className={`mx-auto max-w-[1400px] rounded-2xl transition-all duration-300 ${
          hasScrolled 
            ? 'bg-black/10 backdrop-blur-xs shadow-black/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="px-6 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10">
            <Image 
              src="/assets/logo/pluscode-logo.svg" 
              alt="PLUSCODE" 
              width={80} 
              height={20}
              className="h-6 w-auto"
            />
          </Link>

          {/* Center Menu - Absolutely positioned to stay centered */}
          <div className={`absolute left-1/2 -translate-x-1/2 items-center space-x-8 ${
            hasScrolled ? 'hidden' : 'hidden md:flex'
          }`}>
            {/* AI & Data with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('ai-data')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide">
                {t('aiData')}
              </button>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 origin-top ${
                  activeDropdown === 'ai-data'
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="p-4 space-y-2">
                  {aiDataItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block p-3 rounded-md hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Services with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide">
                {t('services')}
              </button>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 origin-top ${
                  activeDropdown === 'services'
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="p-4 space-y-2">
                  {servicesItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block p-3 rounded-md hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights */}
            <Link
              href="/insights"
              className="text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide"
            >
              {t('insights')}
            </Link>

            {/* About us */}
            <Link
              href="/about"
              className="text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide"
            >
              {t('about')}
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3 z-10">
            {/* Language switcher dropdown */}
            <div 
              className="hidden md:block relative"
              onMouseEnter={() => setIsLangDropdownOpen(true)}
              onMouseLeave={() => setIsLangDropdownOpen(false)}
            >
              <button className={`cursor-pointer text-white px-2 py-1 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                isLangDropdownOpen 
                  ? 'bg-white/10 backdrop-blur-sm' 
                  : 'hover:bg-white/5'
              }`} suppressHydrationWarning>
                {currentLocale.toUpperCase()}
                <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {/* Language Dropdown */}
              <div
                className={`absolute top-full right-0 pt-2 transition-all duration-200 ${
                  isLangDropdownOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="w-24 bg-white rounded-lg shadow-xl overflow-hidden origin-top">
                  <button
                    onClick={() => changeLocale('en')}
                    className={`cursor-pointer w-full px-3 py-2 text-left text-xs font-medium transition-colors duration-200 ${
                      currentLocale === 'en'
                        ? 'bg-gray-100 text-black'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLocale('pl')}
                    className={`cursor-pointer w-full px-3 py-2 text-left text-xs font-medium transition-colors duration-200 ${
                      currentLocale === 'pl'
                        ? 'bg-gray-100 text-black'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Polski
                  </button>
                </div>
              </div>
            </div>

            {/* Get in touch button */}
            <Link
              href="/contact"
              className={`hidden md:flex items-center justify-center bg-white text-black px-5 h-9 rounded-2xl text-xs font-normal tracking-wide hover:bg-gray-100 transition-all duration-300 ${
                hasScrolled ? '-translate-x-2' : 'translate-x-0'
              }`}
            >
              <span className="mt-px">{t('getInTouch')}</span>
            </Link>

            {/* Hamburger button - shows on scroll for desktop, always shows on mobile */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`bg-white hover:cursor-pointer text-black px-3 h-9 rounded-2xl transition-all duration-300 hover:bg-gray-100 flex items-center justify-center ${
                hasScrolled 
                  ? 'md:opacity-100 md:pointer-events-auto' 
                  : 'md:opacity-0 md:pointer-events-none'
              } opacity-100 scale-100`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        </div>
      </nav>

      {/* Full-screen Menu */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="h-full w-full overflow-y-auto">
          {/* Close button */}
          <div className="flex justify-end p-6">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex flex-col items-center justify-center px-6 pb-12 space-y-12">
            {/* Language switcher for mobile */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-white/60 text-sm font-medium">Language</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => changeLocale('en')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentLocale === 'en'
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLocale('pl')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentLocale === 'pl'
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                  }`}
                >
                  Polski
                </button>
              </div>
            </div>

            {/* AI & Data Section */}
            <div className="text-center space-y-6">
              <h3 className="text-white text-3xl md:text-4xl font-bold">{t('aiData')}</h3>
              <div className="space-y-4">
                {aiDataItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block group"
                  >
                    <div className="text-white/90 hover:text-white text-xl md:text-2xl font-medium transition-colors">
                      {item.title}
                    </div>
                    <div className="text-white/60 text-sm md:text-base mt-1">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Services Section */}
            <div className="text-center space-y-6">
              <h3 className="text-white text-3xl md:text-4xl font-bold">{t('services')}</h3>
              <div className="space-y-4">
                {servicesItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block group"
                  >
                    <div className="text-white/90 hover:text-white text-xl md:text-2xl font-medium transition-colors">
                      {item.title}
                    </div>
                    <div className="text-white/60 text-sm md:text-base mt-1">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Links */}
            <div className="flex flex-col items-center space-y-6">
              <Link
                href="/insights"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/90 hover:text-white text-3xl md:text-4xl font-bold transition-colors"
              >
                {t('insights')}
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/90 hover:text-white text-3xl md:text-4xl font-bold transition-colors"
              >
                {t('about')}
              </Link>
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="bg-white text-black px-12 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              {t('getInTouch')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
