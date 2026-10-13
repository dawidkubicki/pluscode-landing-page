"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A modal built on the native `<dialog>`. `showModal()` puts it in the top
 * layer, so it covers the page whatever its ancestors do (a transformed
 * header cannot clip it), makes the rest of the document inert, closes on
 * Escape and hands focus back to the control that opened it.
 *
 * What the platform leaves out is added here: the page behind does not
 * scroll, Tab cycles inside the dialog instead of leaving for the browser's
 * own controls, and a click on the backdrop closes it.
 *
 * The dialog's markup is in the server HTML whether it is open or not, so
 * what it holds (a biography, the menu's links) is there for a crawler.
 *
 * The dialogs fade with CSS (`transition-discrete` and `starting:`). A
 * browser that cannot keep a closing dialog in the top layer for the length
 * of the fade paints it in the page for those 300ms, which is why each one
 * also carries a z-index above the header.
 */
export function useModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const unlock = useRef<(() => void) | null>(null);

  const release = useCallback(() => {
    unlock.current?.();
    unlock.current = null;
  }, []);

  const open = useCallback(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    const root = document.documentElement;
    const previous = { overflow: root.style.overflow, pad: root.style.paddingRight };
    // A classic scrollbar takes width; keep the page from shifting under the
    // backdrop when it goes.
    const gap = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    unlock.current = () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.pad;
    };
    dialog.showModal();
  }, []);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  // Leaving the page with the dialog open (a link inside it) must not leave
  // the document locked.
  useEffect(() => release, [release]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => el.offsetParent !== null);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === event.currentTarget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  // A click that lands on the dialog itself, or on a wrapper marked
  // `data-modal-dismiss`, missed the panel: it was meant for the backdrop.
  const onClick = useCallback((event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.hasAttribute("data-modal-dismiss")) {
      event.currentTarget.close();
    }
  }, []);

  return {
    ref,
    open,
    close,
    /** Spread onto the `<dialog>`. */
    dialogProps: { ref, onKeyDown, onClick, onClose: release },
  };
}
