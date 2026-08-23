/**
 * localStorage key under which a dismissed announcement is remembered.
 * Unique-ish per text so dismissing one announcement doesn't hide a future
 * one. Shared by the layout's pre-hydration script and the client bar so
 * both sides agree on the key.
 */
export function announcementStorageKey(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return `pc-announcement-${hash}`;
}
