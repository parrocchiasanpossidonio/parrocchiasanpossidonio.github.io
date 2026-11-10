import { ElencoAvvisi } from "../components/Bacheca";
import { Stella } from "../components/Icone";
import { Edicola } from "../components/Messe";
import { FrecciaLink, Onda, Sezione } from "../components/ui";
import { Link } from "../lib/router";
export default function Home() { return <>
<section aria-labelledby="home-titolo" className="contenitore pb-12 pt-6 md:pt-12 lg:pb-16 lg:pt-10"><div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-y-7">
<div className="md:col-span-2 lg:col-span-7 lg:col-start-1 lg:row-start-1"><p className="rubrica flex items-center gap-2.5"><Stella className="size-4 text-minio-vivo"/>San Possidonio</p><h1 id="home-titolo" tabIndex={-1} className="mt-4"><span className="block text-[clamp(1.75rem,6.4vw,3rem)] font-normal italic leading-none text-indaco">Parrocchia di</span><span className="mt-2 block text-[clamp(3rem,11.8vw,7.5rem)] leading-[0.92] tracking-[-0.045em]"><span className="block">San</span><span className="block">Possidonio</span></span></h1><Onda className="mt-5 w-36 md:mt-6"/></div>
<Edicola className="md:row-span-2 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:self-start"/>
<div className="lg:col-span-7 lg:col-start-1 lg:row-start-2"><p className="rubrica">La parrocchia</p><p className="lead mt-3 max-w-[36ch]">Qui trovi gli orari delle Messe, gli avvisi, i volantini e i contatti.</p></div>
<div className="grid content-start gap-x-8 gap-y-7 lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:grid-cols-2">{[{to:'/volantini',rub:'Materiali',title:'Volantini'},{to:'/contatti',rub:'Recapiti',title:'Contatti'}].map(x=><article key={x.to} className="group relative border-t-2 border-ink pt-4"><p className="rubrica">{x.rub}</p><h2 className="mt-2 text-[1.55rem]"><Link to={x.to} className="after:absolute after:inset-0">{x.title}</Link></h2><p className="freccia mt-2" aria-hidden="true">Vai alla pagina →</p></article>)}</div></div></section>
<Sezione id="home-avvisi" rubrica="Avvisi" titolo="Dalla bacheca" azione={<FrecciaLink to="/avvisi">Tutti gli avvisi</FrecciaLink>}><ElencoAvvisi limite={2}/></Sezione>
</>; }
