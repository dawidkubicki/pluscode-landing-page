import Script from "next/script";

const GA_ID = "G-RWFFH3SG1N";

/**
 * Google Analytics 4 (gtag.js). next/script dedupes by `id` and `src`, so the
 * layout remounting on a locale switch does not load or configure it twice.
 * Client-side navigations are counted by GA4's own history-change page views
 * (Enhanced measurement), not by anything here.
 */
export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
