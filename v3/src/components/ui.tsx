import type { ReactNode } from "react";
import type { Immagine } from "../data/site";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { IconaClessidra, IconaFreccia } from "./Icone";

const ROMANI = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Numero romano per elenchi e capitoli (1 → I). */
export const romano = (n: number) => ROMANI[n - 1] ?? String(n);

/* ------------------------------------------------------------------ Intestazione di pagina */

export function Intestazione({
  numero,
  sezione,
  titolo,
  children,
}: {
  numero: string;
  sezione: string;
  titolo: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="contenitore pb-9 pt-9 md:pt-12 lg:pb-12 lg:pt-16">
      <p className="rubrica flex items-center gap-3">
        <span aria-hidden="true">{numero}</span>
        <span aria-hidden="true" className="h-0.5 w-8 bg-minio-vivo" />
        <span>{sezione}</span>
      </p>
      <div className="mt-5 grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
        <h1
          tabIndex={-1}
          className="text-[clamp(2.75rem,9vw,6.25rem)] leading-[0.94] tracking-[-0.035em] lg:col-span-7"
        >
          {titolo}
        </h1>
        {children ? <div className="lead max-w-[40ch] lg:col-span-5 lg:pb-2">{children}</div> : null}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ Sezione con colonna di margine
   Su desktop la rubrica e il titolo stanno a margine, come le glosse di un libro;
   su smartphone tutto rifluisce in un'unica colonna. */

export function Sezione({
  id,
  rubrica,
  titolo,
  nota,
  azione,
  children,
  className,
}: {
  id: string;
  rubrica?: string;
  titolo: ReactNode;
  nota?: ReactNode;
  azione?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn("contenitore py-8 lg:py-12", className)}>
      <div className="grid gap-x-10 gap-y-7 border-t-2 border-ink pt-6 lg:grid-cols-12 lg:pt-8">
        <div className="lg:col-span-4 xl:col-span-3">
          {rubrica ? <p className="rubrica">{rubrica}</p> : null}
          <h2 id={id} className="mt-2 text-[clamp(1.85rem,4vw,2.25rem)]">
            {titolo}
          </h2>
          {nota ? <div className="mt-3 max-w-[34ch] text-[0.975rem] leading-normal text-ink-2">{nota}</div> : null}
          {azione ? <div className="mt-3">{azione}</div> : null}
        </div>
        <div className="min-w-0 lg:col-span-8 xl:col-span-9">{children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Stato esplicito
   Per informazioni volutamente non disponibili nel prototipo. */

export function Stato({ titolo, children, className }: { titolo: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex border-2 border-dashed border-ink/70 bg-carta", className)}>
      <span aria-hidden="true" className="tratteggio w-4 shrink-0 border-r-2 border-dashed border-ink/70 sm:w-6" />
      <div className="flex items-start gap-3.5 px-4 py-4 sm:px-5 sm:py-5">
        <IconaClessidra className="mt-0.5 size-6 shrink-0 text-minio" />
        <div className="min-w-0">
          <p className="font-display text-[1.3rem] font-semibold leading-tight text-ink">{titolo}</p>
          {children ? <div className="mt-1.5 text-[0.975rem] leading-normal text-ink-2">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Spazio editoriale predisposto */

export function SpazioEditoriale({ titolo }: { titolo: string }) {
  return (
    <div className="flex min-h-44 flex-col justify-between gap-6 border-2 border-dashed border-ink/60 p-5">
      <p className="rubrica text-ink-2">Spazio editoriale</p>
      <div>
        <h3 className="text-[1.45rem]">{titolo}</h3>
        <p className="mt-1.5 text-[0.95rem] text-ink-2">Contenuto da predisporre.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Tavola illustrata */

export function Tavola({
  immagine,
  forma = "rettangolo",
  nota = "Illustrazione dimostrativa",
  className,
}: {
  immagine: Immagine;
  forma?: "rettangolo" | "lunetta" | "tondo";
  nota?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div
        className={cn(
          "border-2 border-ink bg-carta p-1.5",
          forma === "lunetta" && "arco",
          forma === "tondo" && "rounded-full",
        )}
      >
        <img
          src={immagine.src}
          alt={immagine.alt}
          width={immagine.larghezza}
          height={immagine.altezza}
          className={cn(
            "block w-full object-cover",
            forma === "rettangolo" && "aspect-[3/2]",
            forma === "lunetta" && "arco aspect-[3/2]",
            forma === "tondo" && "aspect-square rounded-full",
          )}
        />
      </div>
      <figcaption
        className={cn(
          "mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[0.9rem] leading-snug",
          forma === "tondo" && "justify-center text-center",
        )}
      >
        <span className="font-bold">{immagine.didascalia}</span>
        <span className="text-ink-2">{nota}</span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ Segnaposto intenzionale per immagini */

export function Segnaposto({ etichetta = "Spazio per immagini", className }: { etichetta?: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`${etichetta}: nessuna immagine caricata`}
      className={cn(
        "tratteggio flex aspect-[3/2] items-center justify-center border-2 border-dashed border-ink/60 p-4 text-center",
        className,
      )}
    >
      <p className="rubrica bg-carta px-3 py-1.5 text-ink-2">{etichetta}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ Piccoli elementi */

export function FrecciaLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn("freccia link", className)}>
      {children}
      <IconaFreccia className="size-5" />
    </Link>
  );
}

export function Etichetta({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-ink/50 px-2 py-0.5 text-[0.75rem] font-bold uppercase leading-normal tracking-[0.08em] text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Filetto d'acqua: separatore decorativo ispirato alle «fonti» del borgo. */
export function Onda({ chiara = false, className }: { chiara?: boolean; className?: string }) {
  return <div aria-hidden="true" className={cn(chiara ? "onda-chiara" : "onda", className)} />;
}
