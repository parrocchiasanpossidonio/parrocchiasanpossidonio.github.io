# Parrocchia di San Possidonio — anteprima non ufficiale

Proposta grafica e funzionale in italiano. **Contenuti operativi ancora da confermare e informativa privacy incompleta: non è il sito ufficiale della parrocchia.** Non usare l'anteprima per ricavare orari, appuntamenti o recapiti non presenti.

La pagina pubblicabile è `index.html`, autonoma con stili, font e illustrazione simbolica incorporati. Richiede JavaScript. Non imposta cookie dal proprio codice, non usa statistiche, moduli o contenuti incorporati di altri servizi. La configurazione e le informazioni relative all'hosting vanno completate prima di promuoverla a sito ufficiale.

## Aggiornamenti leggeri, senza modificare la grafica

1. Modificare `contenuti.json` con soli dati approvati: Messe, avvisi, volantini, contatti. I campi vuoti rimangono inattivi.
2. Aggiungere gli eventuali documenti sotto `output/`, usando nel JSON percorsi relativi a quella cartella. Non inserire URL remoti o dati privati.
3. Prima installazione, da `v3/`: `npm ci --ignore-scripts --no-audit --no-fund`. Servono Node compatibile con Vite 7.3.2, npm e Python 3.10+.
4. Dalla radice eseguire `python build_v3.py`: validazione, controllo TypeScript, build e aggiornamento dell'HTML locale. Errori nei dati non sostituiscono il precedente HTML generato.
5. Copiare `output/san-possidonio-v3.html` in `index.html`. Se sono stati aggiunti documenti in `output/`, copiare anche quelle cartelle documenti nella radice, mantenendo gli stessi percorsi relativi dell'HTML. Controllare localmente, poi commit e push delle modifiche concordate.

Per ora non è presente un CMS né un workflow che rigenera il sito modificando soltanto il JSON nell'interfaccia GitHub: modifica dati, rigenerazione e push sono passaggi distinti. Nessuna importazione o automazione WhatsApp attiva. I dettagli tecnici sono in `v3/README.md`.

## Hosting

Questa repository è predisposta per GitHub Pages con pubblicazione del ramo `main`, cartella `/ (root)`. La presenza dei file non dimostra che Pages sia stato attivato: la disponibilità pubblica deve essere verificata separatamente. Nessun dominio personalizzato è configurato da questa consegna.

## Identità delle modifiche

Autore scelto per questo lavoro: `Pico — AI Agent <pico@example.invalid>`. L'indirizzo è dichiaratamente fittizio e non è un recapito della parrocchia.

Le illustrazioni provengono dal riferimento di design fornito per il prototipo e sono simboliche, non fotografie della parrocchia. I font e React mantengono le rispettive licenze in `v3/THIRD_PARTY_NOTICES.txt` e nei metadati dell'HTML.
