import mani from "../assets/img/mani.webp";
import { contenuti } from "../data/site";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { IconaFreccia, Stella } from "./Icone";
export function OrariCompatti({className}:{className?:string}) {
 if (!contenuti.messe.length) return <p className={className}>Orari non ancora disponibili.</p>;
 return <dl className={className}>{contenuti.messe.map((m,i)=><div key={i} className="flex flex-wrap justify-between gap-x-4 border-b border-current/20 py-2"><dt>{m.giorno} · {m.luogo}</dt><dd className="orario text-[1.35rem]">{m.ora}</dd></div>)}</dl>;
}
export function Edicola({className}:{className?:string}) { return <section aria-labelledby="edicola-titolo" className={cn("su-indaco arco bg-indaco p-2.5 text-carta shadow-[7px_7px_0_var(--color-minio-vivo)]",className)}>
<img src={mani} alt="Illustrazione di mani che condividono il pane" width="960" height="640" className="arco block aspect-[2/1] w-full object-cover object-[50%_42%] sm:aspect-[3/2]" />
<div className="px-3.5 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5"><h2 id="edicola-titolo" className="flex items-center gap-3 text-[1.75rem] sm:text-[1.95rem]"><Stella className="size-4 shrink-0 text-ocra" />Orari delle Messe</h2><OrariCompatti className="mt-4 border-y border-carta/25 py-3"/><Link to="/orari-messe" className="btn btn-ocra mt-5 w-full">Dettagli sugli orari <IconaFreccia className="size-5" /></Link><p className="mt-5 text-center text-[0.8rem] text-carta/80">Illustrazione simbolica</p></div></section>; }
