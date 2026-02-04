'use client';

import { useState, useEffect, useLayoutEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAnnouncement } from './AnnouncementContext';

interface DropdownItem {
  title: string;
  description: string;
  href: string;
}

export default function Navigation() {
  const t = useTranslations('navigation');
  const { isVisible: isAnnouncementVisible } = useAnnouncement();
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

  // Announcement bar height for positioning - only offset when visible AND not scrolled
  const announcementBarHeight = (isAnnouncementVisible && !hasScrolled) ? 'top-[38px] sm:top-[42px]' : 'top-0';
  // Slightly more offset for dropdowns to fully clear the announcement bar
  const dropdownTopOffset = (isAnnouncementVisible && !hasScrolled) ? 'top-[46px] sm:top-[50px]' : 'top-0';

  return (
    <>
    <div 
      className={`fixed left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ${announcementBarHeight} ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        hasScrolled ? 'pt-2 sm:pt-3' : 'pt-4 sm:pt-6'
      }`}
    >
      <nav 
        className={`mx-auto max-w-[1400px] rounded-2xl transition-all duration-300 ${
          hasScrolled 
            ? 'bg-white/80 backdrop-blur-sm shadow-md shadow-black/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="px-6 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10">
            <Image 
              src="/assets/logo/pluscode-black-logo.svg"
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
              <button className="text-black/90 hover:text-black transition-all duration-200 font-normal text-sm tracking-wide flex items-center gap-1 px-3 py-1.5 relative group cursor-pointer">
                <span className="relative">
                  {t('aiData')}
                  <span className={`absolute left-0 bottom-0 h-px bg-black transition-all duration-300 ease-out ${
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
              <button className="text-black/90 hover:text-black transition-all duration-200 font-normal text-sm tracking-wide flex items-center gap-1 px-3 py-1.5 relative group cursor-pointer">
                <span className="relative">
                  {t('services')}
                  <span className={`absolute left-0 bottom-0 h-px bg-black transition-all duration-300 ease-out ${
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
              className="text-black/90 hover:text-black transition-all duration-200 font-normal text-sm tracking-wide px-3 py-1.5 relative group cursor-pointer"
            >
              <span className="relative">
                {t('insights')}
                <span className="absolute left-0 bottom-0 h-px bg-black transition-all duration-300 ease-out w-0 group-hover:w-full" />
              </span>
            </Link>

            {/* About us */}
            <Link
              href="/about"
              className="text-black/90 hover:text-black transition-all duration-200 font-normal text-sm tracking-wide px-3 py-1.5 relative group cursor-pointer"
            >
              <span className="relative">
                {t('about')}
                <span className="absolute left-0 bottom-0 h-px bg-black transition-all duration-300 ease-out w-0 group-hover:w-full" />
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
              <button className={`cursor-pointer text-black px-2 py-1 rounded-xl text-xs font-normal transition-all duration-200 flex items-center gap-1 ${
                isLangDropdownOpen 
                  ? 'bg-black/10'
                  : 'hover:bg-black/5'
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
              className={`hidden lg:flex items-center justify-center bg-black text-white hover:bg-gray-900 hover:shadow-md hover:shadow-purple-500/20 px-5 h-9 rounded-2xl text-xs font-normal tracking-wide transition-all duration-300 ${
                hasScrolled ? '-translate-x-2' : 'translate-x-0'
              }`}
            >
              <span className="mt-px">{t('getInTouch')}</span>
            </Link>

            {/* Menu button - always visible on mobile/tablet, shows on scroll for desktop */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`text-black hover:text-black/70 hover:cursor-pointer text-sm font-medium transition-all duration-300 ${
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
      className={`fixed left-0 right-0 w-full bg-white z-40 transition-all duration-300 ${dropdownTopOffset} ${
        activeDropdown === 'ai-data'
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
      }`}
      onMouseEnter={() => setActiveDropdown('ai-data')}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full px-4 sm:px-6 pt-16 pb-10">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <h3 className="text-black text-xs font-semibold uppercase tracking-wider mb-6">{t('aiData')}</h3>
          <div className="space-y-4">
            {aiDataItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block cursor-pointer"
              >
                <div className="text-black text-sm uppercase tracking-wide">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Services Dropdown Panel - Full width, behind nav */}
    <div
      className={`fixed left-0 right-0 w-full bg-white z-40 transition-all duration-300 ${dropdownTopOffset} ${
        activeDropdown === 'services'
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
      }`}
      onMouseEnter={() => setActiveDropdown('services')}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full px-4 sm:px-6 pt-16 pb-10">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <h3 className="text-black text-xs font-semibold uppercase tracking-wider mb-6">{t('services')}</h3>
          <div className="space-y-4">
            {servicesItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block cursor-pointer"
              >
                <div className="text-black text-sm uppercase tracking-wide">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Full-screen Menu - Outside nav wrapper to avoid stacking context issues */}
    <div
      className={`fixed inset-0 bg-black z-100 transition-all duration-700 ease-out ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className={`h-full w-full overflow-y-auto overscroll-contain transition-transform duration-700 ease-out ${
        isMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Header with Get in touch (mobile) and Close button */}
        <div className="flex justify-between items-center p-4 sm:p-6 sticky top-0 bg-linear-to-b from-black via-black to-transparent z-10">
          {/* Get in touch button - visible on mobile/tablet */}
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="lg:hidden bg-white text-black px-5 py-2 rounded-full font-medium text-sm transition-all duration-150 hover:bg-white/90 cursor-pointer"
          >
            {t('getInTouch')}
          </Link>
          {/* Spacer for desktop to push close button to the right */}
          <div className="hidden lg:block" />
          
          <button
            onClick={() => setIsMenuOpen(false)}
            className="group relative px-4 py-2 overflow-hidden rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
          >
            <span className="relative z-10 text-white text-sm font-medium tracking-wide">Close</span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-20 transition-all duration-500 ease-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '150ms' }}>
            
            {/* AI & Data Section */}
            <div className="space-y-6">
              <h3 className="text-white/40 text-xs sm:text-sm font-medium tracking-wider uppercase">{t('aiData')}</h3>
              <nav className="space-y-10">
                {aiDataItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block group cursor-pointer"
                  >
                    <div className="text-white text-xl sm:text-2xl lg:text-3xl font-medium transition-colors duration-200 group-hover:text-white/60">
                      {item.title}
                    </div>
                    <div className="text-white/50 text-sm sm:text-base mt-1 transition-all duration-300 ease-out opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-20">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services Section */}
            <div className="space-y-6">
              <h3 className="text-white/40 text-xs sm:text-sm font-medium tracking-wider uppercase">{t('services')}</h3>
              <nav className="space-y-10">
                {servicesItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block group cursor-pointer"
                  >
                    <div className="text-white text-xl sm:text-2xl lg:text-3xl font-medium transition-colors duration-200 group-hover:text-white/60">
                      {item.title}
                    </div>
                    <div className="text-white/50 text-sm sm:text-base mt-1 transition-all duration-300 ease-out opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-20">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Other Links Section */}
            <div className="space-y-6">
              <h3 className="text-white/40 text-xs sm:text-sm font-medium tracking-wider uppercase">Quick Links</h3>
              <nav className="space-y-10">
                <Link
                  href="/insights"
                  onClick={() => setIsMenuOpen(false)}
                  className="block group cursor-pointer"
                >
                  <div className="text-white text-xl sm:text-2xl lg:text-3xl font-medium transition-colors duration-200 group-hover:text-white/60">
                    {t('insights')}
                  </div>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block group cursor-pointer"
                >
                  <div className="text-white text-xl sm:text-2xl lg:text-3xl font-medium transition-colors duration-200 group-hover:text-white/60">
                    {t('about')}
                  </div>
                </Link>
              </nav>
            </div>
          </div>

          {/* Bottom Section - Language & CTA */}
          <div className={`mt-16 sm:mt-20 lg:mt-24 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8 transition-all duration-500 ease-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '300ms' }}>
            
            {/* Language switcher */}
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-sm">{t('language')}:</span>
              <button
                onClick={() => changeLocale('en')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  currentLocale === 'en'
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLocale('pl')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  currentLocale === 'pl'
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Polski
              </button>
            </div>

            {/* CTA Button - hidden on mobile/tablet since it's in the header */}
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="hidden lg:block bg-white text-black px-8 py-3.5 rounded-full font-medium text-base transition-all duration-150 hover:bg-white/90 hover:scale-105 cursor-pointer"
            >
              {t('getInTouch')}
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
