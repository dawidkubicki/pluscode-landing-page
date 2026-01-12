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
    <>
    <div 
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        hasScrolled ? 'pt-2 sm:pt-3' : 'pt-4 sm:pt-6'
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
              src={hasScrolled ? "/assets/logo/pluscode-logo.svg" : "/assets/logo/pluscode-black-logo.svg"}
              alt="PLUSCODE" 
              width={80} 
              height={20}
              className="h-6 w-auto"
            />
          </Link>

          {/* Center Menu - Absolutely positioned to stay centered */}
          <div className={`absolute left-1/2 -translate-x-1/2 items-center space-x-4 ${
            hasScrolled ? 'hidden' : 'hidden lg:flex'
          }`}>
            {/* AI & Data with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('ai-data')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`${hasScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'} transition-all duration-200 font-normal text-sm tracking-wide flex items-center gap-1 px-3 py-1.5 relative group`}>
                <span className="relative">
                  {t('aiData')}
                  <span className={`absolute left-0 bottom-0 h-px ${hasScrolled ? 'bg-white' : 'bg-black'} transition-all duration-300 ease-out ${
                    activeDropdown === 'ai-data' ? 'w-full' : 'w-0'
                  }`} />
                </span>
                <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {/* Invisible bridge to dropdown */}
              <div className="absolute left-0 right-0 h-20 top-full" />
            </div>

            {/* Services with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`${hasScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'} transition-all duration-200 font-normal text-sm tracking-wide flex items-center gap-1 px-3 py-1.5 relative group`}>
                <span className="relative">
                  {t('services')}
                  <span className={`absolute left-0 bottom-0 h-px ${hasScrolled ? 'bg-white' : 'bg-black'} transition-all duration-300 ease-out ${
                    activeDropdown === 'services' ? 'w-full' : 'w-0'
                  }`} />
                </span>
                <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {/* Invisible bridge to dropdown */}
              <div className="absolute left-0 right-0 h-20 top-full" />
            </div>

            {/* Insights */}
            <Link
              href="/insights"
              className={`${hasScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'} transition-all duration-200 font-normal text-sm tracking-wide px-3 py-1.5 relative group`}
            >
              <span className="relative">
                {t('insights')}
                <span className={`absolute left-0 bottom-0 h-px ${hasScrolled ? 'bg-white' : 'bg-black'} transition-all duration-300 ease-out w-0 group-hover:w-full`} />
              </span>
            </Link>

            {/* About us */}
            <Link
              href="/about"
              className={`${hasScrolled ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'} transition-all duration-200 font-normal text-sm tracking-wide px-3 py-1.5 relative group`}
            >
              <span className="relative">
                {t('about')}
                <span className={`absolute left-0 bottom-0 h-px ${hasScrolled ? 'bg-white' : 'bg-black'} transition-all duration-300 ease-out w-0 group-hover:w-full`} />
              </span>
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3 z-10">
            {/* Language switcher dropdown */}
            <div 
              className="hidden lg:block relative"
              onMouseEnter={() => setIsLangDropdownOpen(true)}
              onMouseLeave={() => setIsLangDropdownOpen(false)}
            >
              <button className={`cursor-pointer ${hasScrolled ? 'text-white' : 'text-black'} px-2 py-1 rounded-xl text-xs font-normal transition-all duration-200 flex items-center gap-1 ${
                isLangDropdownOpen 
                  ? hasScrolled ? 'bg-white/10 backdrop-blur-sm' : 'bg-black/10'
                  : hasScrolled ? 'hover:bg-white/5' : 'hover:bg-black/5'
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
              className={`hidden lg:flex items-center justify-center ${hasScrolled ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'} px-5 h-9 rounded-2xl text-xs font-normal tracking-wide transition-all duration-300 ${
                hasScrolled ? '-translate-x-2' : 'translate-x-0'
              }`}
            >
              <span className="mt-px">{t('getInTouch')}</span>
            </Link>

            {/* Menu button - always visible on mobile/tablet, shows on scroll for desktop */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`${hasScrolled ? 'text-white hover:text-white/80' : 'text-black hover:text-black/70'} hover:cursor-pointer text-sm font-medium transition-all duration-300 ${
                hasScrolled 
                  ? '' 
                  : 'lg:opacity-0 lg:pointer-events-none'
              }`}
            >
              Menu
            </button>
          </div>
        </div>
        </div>
      </nav>
    </div>

    {/* AI & Data Dropdown Panel - Full width, behind nav */}
    <div
      className={`fixed top-0 left-0 right-0 w-full bg-white z-40 transition-all duration-300 ${
        activeDropdown === 'ai-data'
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
      }`}
      onMouseEnter={() => setActiveDropdown('ai-data')}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full px-8 lg:px-16 pt-20 pb-10">
        <div className="py-8">
          <h3 className="text-black text-xs font-semibold uppercase tracking-wider mb-6">{t('aiData')}</h3>
          <div className="space-y-4">
            {aiDataItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-black text-sm uppercase tracking-wide hover:opacity-60 transition-opacity"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Services Dropdown Panel - Full width, behind nav */}
    <div
      className={`fixed top-0 left-0 right-0 w-full bg-white z-40 transition-all duration-300 ${
        activeDropdown === 'services'
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
      }`}
      onMouseEnter={() => setActiveDropdown('services')}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full px-8 lg:px-16 pt-20 pb-10">
        <div className="py-8">
          <h3 className="text-black text-xs font-semibold uppercase tracking-wider mb-6">{t('services')}</h3>
          <div className="space-y-4">
            {servicesItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-black text-sm uppercase tracking-wide hover:opacity-60 transition-opacity"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Full-screen Menu - Outside nav wrapper to avoid stacking context issues */}
    <div
      className={`fixed inset-0 bg-black z-100 transition-all duration-500 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="h-full w-full overflow-y-auto overscroll-contain">
        {/* Close button */}
        <div className="flex justify-end p-4 sm:p-6 sticky top-0 bg-black z-10">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col items-center px-4 sm:px-6 pb-12 pt-2 space-y-5 sm:space-y-8 md:space-y-10">
          {/* Language switcher for mobile */}
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-white/60 text-xs sm:text-sm font-medium">Language</div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => changeLocale('en')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  currentLocale === 'en'
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLocale('pl')}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
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
          <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
            <h3 className="text-white text-lg sm:text-xl md:text-3xl font-bold">{t('aiData')}</h3>
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              {aiDataItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block group"
                >
                  <div className="text-white/90 hover:text-white text-sm sm:text-base md:text-xl font-medium transition-colors">
                    {item.title}
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm hidden sm:block mt-0.5">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
            <h3 className="text-white text-lg sm:text-xl md:text-3xl font-bold">{t('services')}</h3>
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              {servicesItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block group"
                >
                  <div className="text-white/90 hover:text-white text-sm sm:text-base md:text-xl font-medium transition-colors">
                    {item.title}
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm hidden sm:block mt-0.5">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Other Links */}
          <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4">
            <Link
              href="/insights"
              onClick={() => setIsMenuOpen(false)}
              className="text-white/90 hover:text-white text-lg sm:text-xl md:text-3xl font-bold transition-colors"
            >
              {t('insights')}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-white/90 hover:text-white text-lg sm:text-xl md:text-3xl font-bold transition-colors"
            >
              {t('about')}
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="bg-white text-black px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-all duration-200"
          >
            {t('getInTouch')}
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
