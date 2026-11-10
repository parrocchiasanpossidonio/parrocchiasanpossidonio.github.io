import dati from "../../../contenuti.json";
import { adapt } from "./adapter.mjs";
export type Immagine = { id:string; src:string; larghezza:number; altezza:number; alt:string; didascalia:string };
export type Dati = { schema_version:number; messe:{giorno:string;ora:string;luogo:string}[]; avvisi:{titolo:string;testo:string;data?:string}[]; volantini:{titolo:string;file:string}[]; contatti:{email:string;telefono:string;instagram:string;facebook:string;whatsapp:string} };
export const contenuti: Dati = adapt(dati);
export const identita = {nome:"Parrocchia di San Possidonio", nomeBreve:"San Possidonio", localita:"San Possidonio"};
export const NOTA_DEMO = "Anteprima locale: contenuti operativi da confermare. Non è il sito ufficiale.";
export const rotte = [
 {path:"/orari-messe",numero:"I",breve:"Orari Messe",titolo:"Orari delle Messe",sommario:"Celebrazioni"},
 {path:"/avvisi",numero:"II",breve:"Avvisi",titolo:"Avvisi",sommario:"La bacheca"},
 {path:"/volantini",numero:"III",breve:"Volantini",titolo:"Volantini",sommario:"Materiali"},
 {path:"/contatti",numero:"IV",breve:"Contatti",titolo:"Contatti",sommario:"Recapiti"},
 {path:"/privacy",numero:"V",breve:"Privacy",titolo:"Privacy",sommario:"Informativa in bozza"}
];
