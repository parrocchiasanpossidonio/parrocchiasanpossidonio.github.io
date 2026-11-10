# Parrocchia di San Possidonio — anteprima non ufficiale

Proposta grafica e funzionale in italiano. **Contenuti operativi ancora da confermare e informativa privacy incompleta: non è il sito ufficiale della parrocchia.** Non usare l'anteprima per ricavare orari, appuntamenti o recapiti non presenti.

La pagina pubblicabile è `index.html`, autonoma con stili, font e illustrazione simbolica incorporati. Richiede JavaScript. Non imposta cookie dal proprio codice, non usa statistiche, moduli o contenuti incorporati di altri servizi. La configurazione e le informazioni relative all'hosting vanno completate prima di promuoverla a sito ufficiale.

## Aggiornamenti automatici, senza modificare la grafica

Dopo l'attivazione del workflow indicata sotto, per aggiornare bastano questi passaggi, anche dall'interfaccia web di GitHub:

1. Modificare `contenuti.json` con soli dati approvati: Messe, avvisi, volantini, contatti. I campi vuoti rimangono inattivi. Questo JSON nella repository è la fonte dei contenuti pubblicati.
2. Caricare i documenti in `output/`, preferibilmente in una sottocartella come `output/volantini/`. Nel JSON usare il percorso relativo, per esempio `volantini/avviso.pdf`. Sono consentiti PDF, PNG, JPG/JPEG e WebP locali, non URL remoti, cartelle nascoste o collegamenti simbolici. Non caricare documenti riservati: la repository è pubblica anche per i file non pubblicati nel sito.
3. Salvare insieme le modifiche nel ramo `main`, oppure proporle tramite pull request e unirle dopo i controlli. Aggiungere il file prima o nello stesso commit del suo riferimento nel JSON; un riferimento a un file mancante viene respinto. Elencare ciascun percorso di file una sola volta; `index.html`, `.nojekyll` e `build-info.json` sono nomi riservati nella radice del sito, anche come nomi di cartelle.
4. Controllare in **Actions → Build and publish parish preview**. Il workflow esegue test Python e frontend, installa le dipendenze bloccate senza lifecycle script, valida i dati, controlla TypeScript, rigenera e prepara il sito. La pubblicazione parte soltanto se il job di build riesce e soltanto da `main`, mai dalle pull request.

Non serve rigenerare o copiare manualmente `index.html`. Il file omonimo nella repository resta la copia storica di emergenza e non viene riscritto dal workflow. Sono pubblicati esclusivamente il nuovo HTML, `.nojekyll`, i documenti effettivamente elencati nel JSON e `build-info.json` con la SHA pubblica del commit. Non vengono pubblicati sorgenti, test o file non referenziati. I controlli tecnici non approvano veridicità, privacy o opportunità dei contenuti: servono comunque documenti approvati.

Un aggiornamento non valido non arriva al job di deploy e non sostituisce la versione online. Correggere il dato o aggiungere il file mancante, poi salvare di nuovo; per un ripristino usare un commit che ripristini i dati/file approvati precedenti. `workflow_dispatch` permette anche una nuova esecuzione manuale da Actions.

Non è ancora un CMS con campi e pulsante di caricamento: si modificano JSON e file su GitHub. Nessuna importazione o automazione WhatsApp attiva. I dettagli della build locale restano in `v3/README.md`.

## Hosting e attivazione una tantum

Un amministratore deve selezionare **Settings → Pages → Build and deployment → Source: GitHub Actions**. La deploy key SSH per i push non può modificare questa impostazione; non occorre consegnare credenziali o token personali al workflow. Il workflow usa soltanto il token temporaneo fornito da GitHub, con lettura dei contenuti nel build e permessi Pages/identità limitati al job di deploy.

Non lasciare attiva la vecchia pubblicazione dal ramo `main`/root insieme al nuovo flusso: potrebbe pubblicare l'HTML storico dopo una build nuova. Per una prova su branch, i push `ci/**` eseguono il build senza pubblicare; le pull request verso `main` vengono controllate e non pubblicate. L'HTML online contiene ancora l'avvertenza di anteprima non ufficiale. Nessun dominio personalizzato è configurato.

La presenza del workflow non dimostra un deploy riuscito: verificare il run in Actions e confrontare `build-info.json` pubblico con la SHA del commit atteso.

## Identità delle modifiche

Autore scelto per questo lavoro: `Pico — AI Agent <pico@example.invalid>`. L'indirizzo è dichiaratamente fittizio e non è un recapito della parrocchia.

Le illustrazioni provengono dal riferimento di design fornito per il prototipo e sono simboliche, non fotografie della parrocchia. I font e React mantengono le rispettive licenze in `v3/THIRD_PARTY_NOTICES.txt` e nei metadati dell'HTML.
