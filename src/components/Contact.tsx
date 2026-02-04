'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const t = useTranslations('contact');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!formCardRef.current) return;
    const rect = formCardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return t('validation.nameRequired');
    }
    if (name.trim().length < 2) {
      return t('validation.nameMinLength');
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return t('validation.emailRequired');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('validation.emailInvalid');
    }
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (!message.trim()) {
      return t('validation.messageRequired');
    }
    if (message.trim().length < 10) {
      return t('validation.messageMinLength');
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      message: validateMessage(formData.message),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (touched[name]) {
      let error: string | undefined;
      if (name === 'name') error = validateName(value);
      else if (name === 'email') error = validateEmail(value);
      else if (name === 'message') error = validateMessage(value);

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    // Validate on blur
    let error: string | undefined;
    if (fieldName === 'name') error = validateName(formData.name);
    else if (fieldName === 'email') error = validateEmail(formData.email);
    else if (fieldName === 'message') error = validateMessage(formData.message);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      message: true,
    });

    if (!validateForm()) {
      return;
    }

    if (!executeRecaptcha) {
      setSubmitError('reCAPTCHA not loaded. Please refresh the page.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Execute reCAPTCHA v3 and get token
      const captchaToken = await executeRecaptcha('contact_form');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitSuccess(true);

      // Reset form
      setFormData({ name: '', email: '', company: '', message: '' });
      setTouched({});
      setErrors({});

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full px-0 py-4 bg-transparent border-0 border-b
    text-white placeholder:text-white/40 text-base
    focus:outline-none transition-colors duration-300
    ${errors[fieldName as keyof FormErrors] && touched[fieldName] ? 'border-red-400' : ''}
    ${focusedField === fieldName || formData[fieldName as keyof typeof formData] ? 'border-white/60' : 'border-white/20'}
  `;

  const labelClasses = (fieldName: string) => `
    absolute left-0 transition-all duration-300 pointer-events-none
    ${errors[fieldName as keyof FormErrors] && touched[fieldName] ? 'text-red-400' : ''}
    ${
      focusedField === fieldName || formData[fieldName as keyof typeof formData]
        ? `-top-2 text-xs ${errors[fieldName as keyof FormErrors] && touched[fieldName] ? 'text-red-400' : 'text-white/60'}`
        : 'top-4 text-base text-white/40'
    }
  `;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 px-6 sm:px-12 md:px-16 bg-neutral-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-linear-to-br from-violet-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-linear-to-tr from-blue-500/10 to-transparent blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left Column - Info */}
          <div className="flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/40 mb-4"
            >
              {t('label')}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6"
            >
              {t('title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-lg text-white/60 leading-relaxed mb-10 max-w-md"
            >
              {t('subtitle')}
            </motion.p>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="space-y-6"
            >
              {/* Email */}
              <a
                href="mailto:contact@pluscode.io"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                  <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/40">{t('info.email')}</p>
                  <p className="text-white font-medium group-hover:text-white/80 transition-colors duration-300">
                    contact@pluscode.io
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white/40">{t('info.location')}</p>
                  <p className="text-white font-medium">Poznan, Poland</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            <div
              ref={formCardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative bg-white/3 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 overflow-hidden"
            >
              {/* Cursor gradient effect */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{
                  opacity: isHovering ? 1 : 0,
                  background: `radial-gradient(450px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.07), transparent 50%)`,
                }}
              />
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{t('success.title')}</h3>
                  <p className="text-white/60">{t('success.message')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                  {/* Name Field */}
                  <div className="relative">
                    <label className={labelClasses('name')}>
                      {t('form.name')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => handleBlur('name')}
                      className={inputClasses('name')}
                      aria-invalid={!!errors.name && touched.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && touched.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        id="name-error"
                        className="text-red-400 text-xs mt-2"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label className={labelClasses('email')}>
                      {t('form.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => handleBlur('email')}
                      className={inputClasses('email')}
                      aria-invalid={!!errors.email && touched.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && touched.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        id="email-error"
                        className="text-red-400 text-xs mt-2"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Company Field */}
                  <div className="relative">
                    <label className={labelClasses('company')}>
                      {t('form.company')}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClasses('company')}
                    />
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <label className={labelClasses('message')}>
                      {t('form.message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => handleBlur('message')}
                      rows={4}
                      className={`${inputClasses('message')} resize-none`}
                      aria-invalid={!!errors.message && touched.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && touched.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        id="message-error"
                        className="text-red-400 text-xs mt-2"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <p className="text-red-400 text-sm text-center">{submitError}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      group relative w-full mt-4
                      px-8 py-5
                      bg-white text-neutral-900
                      rounded-full
                      font-medium text-base
                      transition-all duration-300
                      hover:bg-white/90 hover:shadow-xl hover:shadow-white/10
                      active:scale-[0.98]
                      flex items-center justify-center gap-3
                      disabled:opacity-70 disabled:cursor-not-allowed
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('form.sending')}
                      </>
                    ) : (
                      <>
                        {t('form.submit')}
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Privacy Note with reCAPTCHA info */}
                  <p className="text-center text-sm text-white/30 mt-6">
                    {t('form.privacyPrefix')}{' '}
                    <a
                      href="/privacy-policy"
                      className="text-white/50 hover:text-white/70 underline underline-offset-2 transition-colors duration-200"
                    >
                      {t('form.privacyLink')}
                    </a>
                    {t('form.privacySuffix')}
                    <br />
                    <span className="text-white/20 text-xs mt-2 block">
                      Protected by reCAPTCHA
                    </span>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
