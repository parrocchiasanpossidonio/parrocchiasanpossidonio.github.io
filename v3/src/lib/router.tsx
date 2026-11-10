import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

/**
 * Router minimale basato sull'hash dell'indirizzo (#/percorso).
 *
 * È una scelta voluta per l'hosting statico: la pagina servita è sempre la stessa
 * `index.html`, quindi aprire direttamente un indirizzo o ricaricare una vista
 * funziona senza regole lato server e senza conoscere la sottocartella di pubblicazione.
 */

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function leggiPercorso(): string {
  const hash = window.location.hash;
  if (!hash.startsWith("#/")) return "/";
  let percorso = hash.slice(1).split("?")[0];
  if (percorso.length > 1) percorso = percorso.replace(/\/+$/, "");
  return percorso || "/";
}

/** Percorso corrente, ad esempio "/orari-messe". */
export function usePath(): string {
  return useSyncExternalStore(subscribe, leggiPercorso, () => "/");
}

/** Converte un percorso interno nell'href corrispondente. */
export const href = (to: string) => `#${to}`;

/** Porta in cima alla pagina e sposta il focus sul titolo principale. */
export function vaiAlTitolo() {
  window.scrollTo(0, 0);
  document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  children: ReactNode;
};

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const path = usePath();
  const corrente = path === to;

  function gestisciClick(evento: MouseEvent<HTMLAnchorElement>) {
    onClick?.(evento);
    // Un collegamento alla pagina già aperta riporta comunque all'inizio.
    if (corrente && !evento.defaultPrevented) vaiAlTitolo();
  }

  return (
    <a href={href(to)} aria-current={corrente ? "page" : undefined} onClick={gestisciClick} {...rest}>
      {children}
    </a>
  );
}
