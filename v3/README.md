# San Possidonio — versione basata sul riferimento illustrato

Proposta locale, non sito ufficiale pubblicato. Sono stati mantenuti i caratteri Fraunces e Atkinson Hyperlegible Next, carta/indaco/minio, composizione editoriale, illustrazione e pannello Messe ad arco del riferimento scelto. Il nome e le sezioni sono adattati a San Possidonio; non sono state trasferite le storie, le tradizioni o i recapiti della parrocchia immaginaria.

## Aprire e condividere

Apri `../output/san-possidonio-v3.html` nel browser. L'HTML è autonomo: codice, stili, caratteri e illustrazione sono incorporati, e funziona senza connessione. **JavaScript deve essere abilitato per mostrare le pagine e navigare**, come nel riferimento originale; senza JavaScript appare soltanto un messaggio esplicativo. Le precedenti v1 e v2 restano disponibili nel progetto locale e non sono state modificate.

Il file è pronto per valutare il design e il funzionamento, non per una pubblicazione definitiva: orari, avvisi, documenti e recapiti reali mancano, mentre la privacy resta una bozza incompleta. L'illustrazione delle mani è simbolica, non è una fotografia della parrocchia né una veduta del paese. Anche il piccolo segno grafico è una proposta, non un logo ufficiale confermato.

## Aggiornare i contenuti

L'unica fonte dei dati operativi è **`../contenuti.json`**. I campi e la disciplina dei contenuti sono descritti anche nella guida `../AGGIORNARE.md` della base statica; per la v3 usare il comando di build qui sotto, non il comando v2 di quella guida.

- `messe`: lista di oggetti con stringhe `giorno`, `ora`, `luogo`.
- `avvisi`: lista con `titolo`, `testo`, eventuale `data` valida nel formato `AAAA-MM-GG`. Gli a capo del testo si scrivono con `\n`.
- `volantini`: lista con `titolo` e `file`; il percorso è relativo a `../output/` e il documento deve esistere. Sono ammessi PDF, PNG, JPG/JPEG e WebP, non URL remoti, percorsi assoluti, cartelle nascoste o collegamenti simbolici. I documenti non vengono incorporati nell'HTML: quando saranno aggiunti, condividere anche i file nelle posizioni corrette.
- `contatti`: mantenere i cinque campi `email`, `telefono`, `instagram`, `facebook`, `whatsapp`; lasciare `""` se un valore è sconosciuto. I link social richiedono `https` sul dominio esatto del servizio, anche con `www`. Per WhatsApp questa versione accetta `whatsapp.com`, non `wa.me` o altri domini.
- Lasciare `schema_version` a `1`. Non aggiungere campi o dati inventati. Il testo viene reso come testo, non eseguito come HTML.

Servono Python 3.10 o successivo, Node compatibile con Vite 7.3.2 e npm. Collaudo eseguito con Node 26.12.1 e npm 12.0.2; non occorre aggiornarli se è già presente una versione compatibile.

Prima installazione, dalla cartella `v3`:

```sh
npm ci --ignore-scripts --no-audit --no-fund
```

Dopo avere modificato e confermato i dati, dalla cartella principale del progetto:

```sh
python build_v3.py
```

In alternativa, dalla cartella `v3`:

```sh
npm run build
```

I due comandi eseguono la stessa pipeline: validazione Python di schema/recapiti/documenti, esecuzione dell'adattatore frontend sui dati effettivi, controllo TypeScript, build Vite, infine sostituzione atomica del solo `output/san-possidonio-v3.html`. Se un controllo fallisce, l'HTML condivisibile precedente resta intatto. Nessun comando pubblica, invia dati o configura GitHub. Su sistemi dove Python si chiama soltanto `python3`, dalla cartella principale usare `python3 build_v3.py`.

Per la sola esplorazione del codice è disponibile `npm run dev` nella cartella `v3`; non è necessario per aprire l'HTML costruito, e non sostituisce la pipeline di validazione o il test del file offline.

## Test

Dalla cartella principale:

```sh
node --test v3/tests/adapter.test.mjs
python -m unittest discover -s tests -v
```

Nel pacchetto sorgenti condivisibile sono inclusi i test del compilatore e della v3, non la vecchia anteprima v1 con i suoi test. La suite browser del VPS dipende dall'installazione Chromium/Playwright già presente su quel server e non è necessaria per aprire o rigenerare l'HTML su un altro computer.

Le fixture sintetiche usate nel collaudo sono separate dai contenuti canonici; non sono appuntamenti o recapiti della parrocchia. Il collaudo Chromium non è una certificazione di accessibilità o una verifica su tutti i browser.

## Limiti prima della pubblicazione

Confermare dati e materiali pubblicabili, identità del titolare, recapiti privacy, hosting e trattamenti effettivi. Non sono attivi tracciamento, statistiche, cookie impostati dal codice, moduli, archiviazione locale, importazioni o bot WhatsApp. I soli collegamenti esterni eventualmente confermati si aprono su azione del visitatore.

Nessuna pubblicazione, push, attivazione Pages o tunnel è compresa. L'autore Git concordato è `Pico — AI Agent`; l'email resta da concordare. Le licenze dei font e di React sono conservate in `THIRD_PARTY_NOTICES.txt` e nei metadati dell'HTML autonomo. Le immagini provengono dal riferimento generato fornito da Alle; non sono presentate come materiale autentico della parrocchia.
