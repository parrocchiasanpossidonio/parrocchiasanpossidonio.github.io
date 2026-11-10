import { Intestazione } from "../components/ui";
import { rotte } from "../data/site";
import { Link } from "../lib/router";

export default function NonTrovata() {
  return (
    <>
      <Intestazione numero="?" sezione="Indirizzo non riconosciuto" titolo="Pagina non trovata">
        <p>L'indirizzo aperto non corrisponde a nessuna pagina del prototipo.</p>
      </Intestazione>

      <section aria-labelledby="dove-andare" className="contenitore">
        <div className="border-t-2 border-ink pt-6">
          <h2 id="dove-andare" className="text-[clamp(1.85rem,4vw,2.25rem)]">
            Da dove ripartire
          </h2>
          <Link to="/" className="btn mt-6">
            Torna alla home
          </Link>
          <ul className="mt-9 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {rotte.map((r) => (
              <li key={r.path} className="border-b border-ink/30">
                <Link to={r.path} className="flex min-h-12 items-baseline gap-3 py-2.5 hover:text-minio">
                  <span className="rubrica w-8 shrink-0">{r.numero}</span>
                  <span className="font-bold">{r.titolo}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
