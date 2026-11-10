import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { identita, NOTA_DEMO, rotte } from "../data/site";
import { Link, usePath } from "../lib/router";
import { cn } from "../utils/cn";
import { Emblema, IconaArco, IconaBusta, IconaCampana, IconaChiudi, IconaCuore, IconaMenu } from "./Icone";
import { OrariCompatti } from "./Messe";
import { Onda } from "./ui";

/** Le tre destinazioni principali: sempre visibili da tablet in su e nella barra su smartphone. */
const PRIORITARIE = ["/orari-messe", "/avvisi", "/contatti"];

const voceBarra =
  "group relative flex min-h-[3.75rem] w-full flex-col items-center justify-center gap-1 px-1 text-[0.8125rem] font-bold leading-none aria-[current=page]:text-minio";

function Indicatore() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-0 h-1 w-9 bg-minio-vivo opacity-0 group-aria-[current=page]:opacity-100"
    />
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const path = usePath();
  const menu = useRef<HTMLDialogElement>(null);
  const [menuAperto, setMenuAperto] = useState(false);

  function apriMenu() {
    const d = menu.current;
    if (!d || d.open) return;
    d.showModal();
    setMenuAperto(true);
    document.documentElement.classList.add("blocca-scorrimento");
  }

  function chiudiMenu() {
    menu.current?.close();
  }

  function alChiudere() {
    setMenuAperto(false);
    document.documentElement.classList.remove("blocca-scorrimento");
  }

  // A ogni cambio di pagina il menu si chiude.
  useEffect(() => {
    if (menu.current?.open) menu.current.close();
  }, [path]);

  function saltaAlContenuto(evento: MouseEvent<HTMLAnchorElement>) {
    // Con la navigazione ad hash l'ancora non deve modificare l'indirizzo.
    evento.preventDefault();
    const principale = document.getElementById("contenuto");
    principale?.focus({ preventScroll: true });
    principale?.scrollIntoView();
  }

  function clicSulFondo(evento: MouseEvent<HTMLDialogElement>) {
    if (evento.target === evento.currentTarget) chiudiMenu();
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#contenuto"
        onClick={saltaAlContenuto}
        className="btn fixed left-3 top-3 z-50 -translate-y-[300%] focus:translate-y-0 print:hidden"
      >
        Vai al contenuto
      </a>

      {/* Avvertenza: discreta ma sempre leggibile, anche in stampa */}
      <aside
        aria-label="Avvertenza"
        className="border-b border-ink/25 bg-carta-2 px-4 py-1.5 text-center text-[0.8125rem] leading-snug text-ink"
      >
        <p>{NOTA_DEMO}</p>
      </aside>

      <header className="z-30 border-b-2 border-ink bg-carta md:sticky md:top-0 print:hidden">
        <div className="contenitore flex items-center justify-between gap-4 py-2.5 md:py-3">
          {/* Il nome accessibile coincide con il testo visibile, più una precisazione per i lettori di schermo */}
          <Link to="/" className="flex min-h-11 items-center gap-3">
            <Emblema className="h-11 w-11 shrink-0 text-indaco" />
            <span className="leading-none">
              <span className="rubrica block text-[0.6875rem]">Parrocchia di</span>{" "}
              <span className="mt-0.5 block font-display text-[1.6rem] font-semibold leading-none tracking-[-0.02em]">
                {identita.nomeBreve}
              </span>
              <span className="sr-only">: pagina iniziale</span>
            </span>
          </Link>

          <nav aria-label="Principale" className="hidden md:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {rotte.map((r) => (
                <li key={r.path} className={cn(!PRIORITARIE.includes(r.path) && "hidden xl:block")}>
                  <Link to={r.path} className="voce-nav">
                    {r.breve}
                  </Link>
                </li>
              ))}
              <li className="ml-3 xl:hidden">
                <button
                  type="button"
                  onClick={apriMenu}
                  aria-haspopup="dialog"
                  aria-expanded={menuAperto}
                  className="btn btn-chiaro min-h-11 px-4 py-2"
                >
                  <IconaMenu className="size-5" />
                  Menu
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="contenuto" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      {/* Su smartphone il piè di pagina lascia spazio alla barra fissa in basso */}
      <footer className="su-indaco bg-indaco pb-[calc(3.75rem+env(safe-area-inset-bottom))] text-carta md:pb-0 print:hidden">
        <Onda chiara className="mt-5" />
        <div className="contenitore grid gap-x-10 gap-y-12 pb-12 pt-10 md:grid-cols-2 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="flex items-center gap-3">
              <Emblema className="h-12 w-12 shrink-0 text-carta" />
              <p className="font-display text-[1.6rem] font-medium leading-[1.05]">{identita.nome}</p>
            </div>
            <Link to="/contatti" className="link mt-3 inline-flex min-h-11 items-center">
              Tutti i contatti
            </Link>
          </div>

          <div className="xl:col-span-4">
            <h2 className="rubrica">Orari delle Messe</h2>
            <OrariCompatti className="mt-3" />

          </div>

          <nav aria-label="Piè di pagina" className="md:col-span-2 xl:col-span-4">
            <h2 className="rubrica">Tutte le pagine</h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-6">
              <li>
                <Link to="/" className="flex min-h-11 items-center hover:text-ocra aria-[current=page]:text-ocra">
                  Home
                </Link>
              </li>
              {rotte.map((r) => (
                <li key={r.path}>
                  <Link to={r.path} className="flex min-h-11 items-center hover:text-ocra aria-[current=page]:text-ocra">
                    {r.breve}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>

      {/* Smartphone: barra fissa a portata di pollice con le destinazioni principali */}
      <nav
        aria-label="Accesso rapido"
        className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-carta pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
      >
        <ul className="grid grid-cols-5">
          <li>
            <Link to="/" className={voceBarra}>
              <Indicatore />
              <IconaArco />
              Home
            </Link>
          </li>
          <li>
            <Link to="/orari-messe" className={voceBarra}>
              <Indicatore />
              <IconaCampana />
              Messe
            </Link>
          </li>
          <li>
            <Link to="/avvisi" className={voceBarra}>
              <Indicatore />
              <IconaCuore />
              Avvisi
            </Link>
          </li>
          <li>
            <Link to="/contatti" className={voceBarra}>
              <Indicatore />
              <IconaBusta />
              Contatti
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={apriMenu}
              aria-haspopup="dialog"
              aria-expanded={menuAperto}
              className={voceBarra}
            >
              <IconaMenu />
              Menu
            </button>
          </li>
        </ul>
      </nav>

      {/* Menu completo: schermo intero su smartphone, pannello laterale su tablet */}
      <dialog
        ref={menu}
        className="menu-dialog su-indaco"
        aria-labelledby="menu-titolo"
        onClose={alChiudere}
        onClick={clicSulFondo}
      >
        <div className="flex h-full flex-col bg-indaco">
          <div className="flex items-center justify-between gap-4 border-b border-carta/25 px-5 py-3">
            <h2 id="menu-titolo" className="rubrica">
              Menu · tutte le pagine
            </h2>
            <button
              type="button"
              onClick={chiudiMenu}
              className="inline-flex min-h-12 items-center gap-2 border-2 border-carta px-4 font-bold hover:bg-carta hover:text-ink"
            >
              <IconaChiudi className="size-5" />
              Chiudi
            </button>
          </div>

          <nav aria-label="Tutte le pagine" className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
            <ul>
              <li className="border-b border-carta/20">
                <Link
                  to="/"
                  onClick={chiudiMenu}
                  className="grid min-h-14 grid-cols-[2.75rem_1fr] items-baseline gap-x-2 py-3 hover:text-ocra aria-[current=page]:text-ocra"
                >
                  <Emblema className="h-6 w-6 self-center text-carta" />
                  <span className="font-display text-[1.45rem] font-medium leading-tight">Home</span>
                </Link>
              </li>
              {rotte.map((r) => (
                <li key={r.path} className="border-b border-carta/20">
                  <Link
                    to={r.path}
                    onClick={chiudiMenu}
                    className="grid min-h-14 grid-cols-[2.75rem_1fr] items-baseline gap-x-2 py-2.5 hover:text-ocra aria-[current=page]:text-ocra"
                  >
                    <span className="rubrica">{r.numero}</span>
                    <span>
                      <span className="block font-display text-[1.45rem] font-medium leading-tight">{r.titolo}</span>
                      <span className="block text-[0.9rem] leading-snug text-carta/80">{r.sommario}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>


        </div>
      </dialog>
    </div>
  );
}
