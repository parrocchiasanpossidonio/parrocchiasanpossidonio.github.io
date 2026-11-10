import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export const IconaArco = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M5.5 20.5v-8a6.5 6.5 0 0 1 13 0v8M3 20.500h18M12 2v3.200M10.400 3.600h3.200" />
  </svg>
);

export const IconaCampana = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M6.500 16.500v-5a5.500 5.500 0 0 1 11 0v5l1.500 2h-14zM10.200 21a1.900 1.900 0 0 0 3.600 0M12 3.500V6" />
  </svg>
);

export const IconaCuore = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 20.500s-7.500-4.600-7.500-10A4.100 4.100 0 0 1 12 8.200a4.100 4.100 0 0 1 7.500 2.300c0 5.400-7.500 10-7.500 10z" />
  </svg>
);

export const IconaBusta = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="3" y="5.500" width="18" height="13" />
    <path d="m3.500 6.500 8.500 6.500 8.500-6.500" />
  </svg>
);

export const IconaMenu = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconaChiudi = (p: Props) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconaFreccia = (p: Props) => (
  <svg {...base} strokeWidth={2.2} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const IconaIndietro = (p: Props) => (
  <svg {...base} strokeWidth={2.2} {...p}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const IconaCopia = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="8.500" y="8.500" width="11.500" height="11.500" />
    <path d="M15.500 8.500V4H4v11.500h4.500" />
  </svg>
);

export const IconaStampa = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M7 8.500V3.500h10v5M7 17.500H4v-9h16v9h-3M7 14h10v6.500H7z" />
  </svg>
);

export const IconaClessidra = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M6.500 3.500h11M6.500 20.500h11M7.500 3.500c0 4.500 4.500 5.500 4.500 8.500s-4.500 4-4.500 8.500M16.500 3.500c0 4.500-4.500 5.500-4.500 8.500s4.500 4 4.500 8.500" />
  </svg>
);

export const IconaLuogo = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 21s6.500-6.200 6.500-11.200a6.500 6.500 0 0 0-13 0C5.500 14.800 12 21 12 21z" />
    <circle cx="12" cy="9.800" r="2.200" />
  </svg>
);

export const IconaTelefono = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l1.500 4.500-2.200 1.500a11 11 0 0 0 5.700 5.700l1.500-2.200L20 15v4a1 1 0 0 1-1 1C10.700 20 4 13.300 4 5a1 1 0 0 1 1-1z" />
  </svg>
);

export const IconaVoci = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 5.500h11v8H9.500L6 16.500v-3H4zM15 9.500h5v7.500h-2v2.500l-3-2.500h-3.500v-3.500" />
  </svg>
);

/** Stella a otto punte: piccolo ornamento ricorrente, ripreso dalle tavole illustrate. */
export const Stella = (p: Props) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M12 1l1.600 7.200 4.100-1.900-1.900 4.100L23 12l-7.200 1.600 1.900 4.100-4.100-1.900L12 23l-1.600-7.200-4.100 1.900 1.900-4.100L1 12l7.200-1.600-1.900-4.100 4.100 1.900z" />
  </svg>
);

/** Emblema del prototipo: un arco, un sole e due fili d'acqua («le fonti»). Disegno originale, non è un logo reale. */
export function Emblema({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path d="M32 2v11M26.500 6.500h11" stroke="var(--color-minio-vivo)" strokeWidth="3.500" fill="none" />
      <path d="M14 61V35a18 18 0 0 1 36 0v26" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="32" cy="34" r="6" fill="var(--color-minio-vivo)" />
      <path
        d="M21 47.500c3.700-3.600 7.300-3.600 11 0s7.300 3.600 11 0M21 55.500c3.700-3.600 7.300-3.600 11 0s7.300 3.600 11 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
