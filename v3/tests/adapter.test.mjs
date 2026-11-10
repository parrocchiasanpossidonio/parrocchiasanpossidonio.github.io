import test from "node:test";
import assert from "node:assert/strict";
import { adapt } from "../src/data/adapter.mjs";
test("schema vuoto resta vuoto", () => {
  const d = {schema_version:1, messe:[], avvisi:[], volantini:[], contatti:{email:"",telefono:"",instagram:"",facebook:"",whatsapp:""}};
  assert.deepEqual(adapt(d).messe, []);
});
test("rifiuta chiavi sconosciute e tipi errati", () => {
  assert.throws(() => adapt({schema_version:1, messe:"", avvisi:[], volantini:[], contatti:{email:"",telefono:"",instagram:"",facebook:"",whatsapp:""}, extra:1}));
});
test("mappa dati autentici e rifiuta collegamenti pericolosi", () => {
 const base = {schema_version:1,messe:[{giorno:'Domenica',ora:'10:00',luogo:'Chiesa'}],avvisi:[{titolo:'Notizia',testo:'Testo'}],volantini:[{titolo:'Foglio',file:'documenti/foglio.pdf'}],contatti:{email:'a@example.org',telefono:'+39 123456789',instagram:'https://www.instagram.com/profilo/',facebook:'',whatsapp:''}};
 assert.equal(adapt(base).messe[0].ora, '10:00');
 assert.throws(() => adapt({...base, volantini:[{titolo:'X',file:'../segreto'}]}));
 assert.throws(() => adapt({...base, contatti:{...base.contatti,instagram:'javascript:alert(1)'}}));
});

test("allinea file e domini al validatore canonico", () => {
 const d={schema_version:1,messe:[],avvisi:[],volantini:[],contatti:{email:'',telefono:'',instagram:'',facebook:'',whatsapp:''}};
 for(const file of ['documenti/pagina.html','documenti/.private/foglio.pdf','documenti/foglio\u007f.pdf']) {
  assert.throws(()=>adapt({...d,volantini:[{titolo:'Documento sintetico',file}]}),file);
 }
 for(const whatsapp of ['https://wa.me/000','https://chat.whatsapp.com/esempio']) {
  assert.throws(()=>adapt({...d,contatti:{...d.contatti,whatsapp}}),whatsapp);
 }
 assert.throws(()=>adapt({...d,contatti:{...d.contatti,instagram:'https://instagram.com/\nprofilo'}}));
 assert.equal(adapt({...d,volantini:[{titolo:'Documento',file:'documenti/foglio.PDF'}]}).volantini.length,1);
});

test("schema canonico attuale e varianti non sicure", async () => {
 const {readFile} = await import('node:fs/promises');
 const d = JSON.parse(await readFile(new URL('../../contenuti.json', import.meta.url),'utf8'));
 assert.deepEqual(adapt(d), d);
 for (const file of ['/assoluto.pdf','cartella/../file.pdf','cartella\\file.pdf','https://example.org/a.pdf','%2e%2e/x']) assert.throws(() => adapt({...d,volantini:[{titolo:'X',file}]}));
 for (const url of ['http://instagram.com/a','https://instagram.com.evil.test/a','javascript:alert(1)','https://user@instagram.com/a']) assert.throws(() => adapt({...d,contatti:{...d.contatti,instagram:url}}));
 assert.throws(() => adapt({...d,contatti:{...d.contatti,email:42}}));
 assert.throws(() => adapt({...d,messe:[{giorno:'X',ora:'X',luogo:'X',extra:true}]}));
});
