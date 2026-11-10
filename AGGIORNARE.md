# Aggiornare l'anteprima di San Possidonio

Questa è una **proposta locale da presentare e validare**, non il sito ufficiale pubblicato. Non è un CMS: non ci sono account, pannello online, upload remoto, statistiche o collegamenti WhatsApp automatici.

## Aprire il sito

Apri `output/san-possidonio-v2.html` con un browser. Il file attuale è autonomo, funziona offline e non richiede installazioni. Menu mobile, collegamenti interni e apertura della nota privacy funzionano senza JavaScript.

Il titolo «Ci ritroviamo qui.», i colori e il segno grafico sono proposte. Non sono presenti foto di repertorio o immagini inventate della chiesa. Il file precedente `output/san-possidonio-v1.html` resta conservato nel progetto locale.

## Un aggiornamento in tre passi

1. Apri `contenuti.json` in un editor di testo e inserisci **soltanto dati confermati e pubblicabili**.
2. Dalla cartella del progetto esegui, con Python 3.10 o successivo già installato:
   ```sh
   python build.py
   ```
   Su sistemi dove l'interprete si chiama `python3`, usa `python3 build.py`. Non servono pacchetti aggiuntivi.
3. Riapri o ricarica `output/san-possidonio-v2.html` e controlla il risultato. La rigenerazione è locale: **non pubblica nulla**.

Il file JSON attuale contiene liste vuote e recapiti vuoti perché non sono ancora arrivati contenuti reali. Il compilatore mantiene stati vuoti espliciti, senza inventare appuntamenti o collegamenti.

## Campi disponibili

- `schema_version`: lasciare `1`.
- `messe`: lista di oggetti con le tre stringhe `giorno`, `ora`, `luogo`. Inserire una voce per ogni celebrazione o fascia desiderata. L'ordine nel file è quello mostrato.
- `avvisi`: lista di oggetti con `titolo` e `testo`. È facoltativo `data`, nel formato `AAAA-MM-GG`, con una data effettivamente valida. Se non serve, omettere il campo invece di lasciare una data inventata. Le righe a capo del testo vengono conservate; in JSON si scrivono con `\n`.
- `volantini`: lista di oggetti con `titolo` e `file`. `file` è un percorso relativo alla cartella `output/`; ad esempio una cartella `documenti/` può ospitare PDF e immagini approvati. Non inserire il prefisso `output/` nel valore.
- `contatti`: `email`, `telefono`, `instagram`, `facebook`, `whatsapp`. Lasciare `""` per un recapito non ancora confermato. I campi vuoti non diventano collegamenti.

Per evitare di scambiare esempi per contenuti veri, questa guida non include orari, eventi, numeri telefonici o URL di canali inventati. I test usano fixture sintetiche in cartelle temporanee, separate dall'anteprima da condividere.

## Documenti e collegamenti

Sono ammessi soltanto file locali esistenti con estensione `.pdf`, `.png`, `.jpg`, `.jpeg` o `.webp`. Non vengono scaricati file da internet. Sono rifiutati percorsi assoluti, `..`, cartelle nascoste, link simbolici e file mancanti. I nomi con spazi vengono codificati nei link.

Quando inserirai documenti, per condividere il sito completo dovrai conservare **l'HTML e quei file nelle rispettive posizioni**: un HTML inviato da solo non incorpora i PDF. Le immagini dei volantini sono collegate come documenti, non caricate come risorse di pagina.

Per i canali social sono accettati solo URL `https` dei domini esatti `instagram.com`, `facebook.com` e `whatsapp.com`, anche con `www`. Per WhatsApp questa prima versione accetta il link al canale su `whatsapp.com`, non inviti di domini diversi o link `wa.me`. Non vengono aperti o contattati servizi durante la generazione. Un clic del visitatore sul recapito confermato può invece aprire il sito esterno o l'app di telefono/email.

## Errori e controlli

Il compilatore verifica struttura e tipi del JSON, date, destinazioni dei contatti, documenti e segnaposto del template. I dati vengono convertiti in testo HTML, non interpretati come codice. Un input non valido produce un errore e lascia intatto l'HTML precedente; il salvataggio valido avviene sostituendo atomicamente il file di destinazione. Non usare percorsi di output con link simbolici o cartelle condivise non fidate: questo script non è una sandbox multiutente.

Controlli Python senza dipendenze:

```sh
python -m unittest discover -s tests -p test_build.py -v
python -m unittest discover -s tests -p test_v2.py -v
```

Opzioni avanzate, tutte locali:

```sh
python build.py --data contenuti.json --template templates/site-v2.html --output output/san-possidonio-v2.html
```

Con un output alternativo, la cartella di destinazione deve esistere; i file dei volantini continuano a essere cercati sotto `output/` e i collegamenti vengono adattati al percorso dell'HTML.

La suite Chromium del progetto è stata eseguita sul VPS con il browser già presente; lo script browser fa riferimento a quell'installazione e non è un requisito per aprire o rigenerare il sito su un altro computer. I test non sono una certificazione di accessibilità o sicurezza.

## Prima di andare online

Servono contenuti e recapiti approvati, conferma della direzione visiva, definizione del titolare e completamento dell'informativa in base a hosting e servizi effettivi. Il testo privacy incluso è ancora una bozza incompleta, non una certificazione di conformità.

Questo incarico **non** include Git init, commit, push, attivazione di GitHub Pages, tunnel o pubblicazione. L'autore Git concordato è `Pico — AI Agent`; l'email è ancora da concordare e non va ereditata da altri progetti. Gli aggiornamenti automatici WhatsApp restano una fase separata.
