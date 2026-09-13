import Script from "next/script";
import { CONSENT_KEY } from "@/lib/consent";

const GA_ID = "G-RWFFH3SG1N";

/**
 * Google Analytics 4 (gtag.js) under Consent Mode v2. next/script dedupes by
 * `id` and `src`, so the layout remounting on a locale switch does not load or
 * configure it twice. Client-side navigations are counted by GA4's own
 * history-change page views (Enhanced measurement), not by anything here.
 *
 * CONSENT. Every storage type starts denied, so GA writes no cookie until the
 * visitor accepts in the cookie banner. The one exception is a returning
 * visitor who already accepted: the stored choice is read in the same inline
 * script, before `config`, so their first page view is a normal one instead
 * of a cookieless ping followed by an update. Ads storage stays denied for
 * everyone; the site runs no advertising.
 */
export default function GoogleAnalytics() {
  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var c;try{c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})}catch(e){}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='granted'?'granted':'denied'});gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
