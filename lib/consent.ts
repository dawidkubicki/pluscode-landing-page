/**
 * localStorage key holding the visitor's cookie choice, "granted" or
 * "denied". Shared by the GA snippet, which reads it before gtag's first
 * command so a returning visitor's choice applies from the first hit, and by
 * the client banner, which writes it.
 */
export const CONSENT_KEY = "pc-consent";

export type ConsentChoice = "granted" | "denied";

/** Window event the footer's "Cookie settings" link fires to reopen the banner. */
export const CONSENT_OPEN_EVENT = "pc:cookie-settings";
