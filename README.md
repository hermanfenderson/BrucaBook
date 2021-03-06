BrucaBook V.0.13.8
==================

Gestionale per librerie indipendenti. Utilizza React e Firebase. Rilasciato in licenza MIT. [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

Thankfully using BrowserStack to perform multi-browser testing and iPad development.


<a href="https://www.browserstack.com">
<img src="https://p14.zdusercontent.com/attachment/1015988/C3cHxb8CAg8Xmb25NraQ2aiIa?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..kxhtZ0EE4kT_hC87TfxU9Q.iGFLETTw4WN9hGbTi_1K-9IvghTHDCTZalKPFjRP82i3QUT38LVUH4d_-hAHB38ma4jxi3BzZGJ0nt1d6AIYA04n5iIsC0qTU3riIxDMtzNkyqH3JCYbj-SJlHpQCXBNoNz0D6QwxCYa84w_t9nYNP0t88B-SWDVr6RunBI6ul9gWf8V_pophEAx55zjqwF5-pMAKnIgGRHG2Q7NTtkRtKUDZd4Bu6j8uzJmT6zgzSh3YQ5_uNuuatFuyH3vvqdOcCugk6QptXZBD1E_BG0KePm8eL5lcFx9SWLtc6PhAk0.T3RdhNv0KLUZnc0IULD9PQ" width="200" heigth="50"> </a>

Storia delle versioni
---------------------
### Versione 0.13.8
* Campo editore in rese e reselibere
* Export in excel per bolle
* Alpha version di rese (da collaudare e NON usare per ora)

### Versione 0.13.7
* Bugfixing: non cambiava il mese nella vista rese (le rese non libere sono ancora "guaste")

### Versione 0.13.6
* Eliminato il concetto di catalogoLocale (solo due livelli di catalogo, la cache generale e quella della specifica libreria che coincide con il magazzino)

### Versione 0.13.5
* Bugfixing: avevo "rotto" resa libera con un copia-incolla sbagliato!

### Versione 0.13.4
* Bugfixing: impossibile creare nuove bolle e nuove rese! (esito del cambiamento della gestione totali)

### Versione 0.13.3
* Riscritta con nuove form e tabelle resaLibera

### Versione 0.13.2
* Bugfixing: lo scontrino rimane valorizzato quando si esce e si rientra con un'altra cassa
* Eliminato spin per tableScontrino
* Versioni mostrate direttamente in pagina principale
* Fix dettagli libro (non scrollava oltre il bordo inferiore)
* Fix su spin nuovo (rimaneva non selezionabile il resto del menu...)

### Versione 0.13.1
* Fix di recod errati in catalogo (ritorni carrello)
* Modifca a cassa per usare nuovo tipo form
* Baco: errato calcolo totali
* Maggiore leggibilità campi disabilitati
* Eliminazione warning 


### Versione 0.13.0
* Release candidate per la versione 1.0.0
* Rivisitazione di tutta la grafica 
* Riscrittura completa della gestione dello storico magazzino
* Riscrittura completa delle rese aperte
* Riscrittura completa dell'inventario

### Versione 0.12.1
* In inventario in automatico si viene portati alla riga del codice che si sta lavorando
* Fix di un piccolo baco su incolonnamento tabelle


### Versione 0.12.0
* Bug fixing catalogo (non mostrava l'iva)
* Aggiornate librerie a ultime versioni (in particolare antd a 3.20)
* Migrata tabella inventario a react-window
* Campo IVA in magazzino
* Riscritta routine aggiornamento magazzino e storico magazzino
* Porting da react-virtualized a react-window delle tabelle magazzino e inventario

### Versione 0.11.2
* Bug fixing inventario (campo ricerca, selezione libri controllati)

### Versione 0.11.1
* Gestione ordini clienti (in beta utente)

### Versione 0.10.3
* Gestione righe ordini clienti (alpha! non usare) 
* Risolto baco update testate
* Inserito editore nelle rese libere, filtri e ordinamenti

### Versione 0.10.2
* Inserimento testata ordini clienti

### Versione 0.10.1
* Anagrafica clienti
* Aggiunto campo editore nel magazzino


### Versione 0.9.45
* Gestione categorie in anagrafica libri

### Versione 0.9.44
* Export magazzino in excel

### Versione 0.9.43
* Workaround: modifica in catalogo non aggiornava il magazzino (basta creare una riga a zero in un inventario )
* Magazzino e inventario veloci, sortabili e cercabili...

### Versione 0.9.42
* Form inventario non veniva ridimensionata per stare nello schermo
* Ottimizzazione prestazioni inventario (inefficiente fare loop nelle propt!)
* Nuova libreria per gestione tabelle grandi (react-virtualized)
* Il tutto rilasciato in alpha (devo verificare parecchie cose ancora)

### Versione 0.9.41
* Prima patch per performance

### Versione 0.9.40
* Possibilità di esportare in excel l'inventario

### Versione 0.9.39
* Altro piccolo ritocco a dimensione scontrino
* Passaggio di rese a gestione react 16 (con i metodi mount e unmount)
* Bug fixing per props mandate erroneamente in giro 

### Versione 0.9.38
* Ridotta leggermente dimensione form di sinistra scontrino (spaginava su chrome per windows)
* Inserita licenza MIT

### Versione 0.9.37
* Bottone nuovo scontrino anche in seconda colonna 
* Hotkey 'n' per generare un nuovo scontrino
* Immagine libro spostata
* Risolto baco: crash su cancellazione scontrino
* Risolto baco: totale stale in scontrino creando nuovo scontrino dopo cancellazione
* Risolto baco: crash inserendo riga in nuovo scontrino dopo cancellazione

### Versione 0.9.36
* Shrink delle maschere (seconda versione: scontrino)

### Versione 0.9.35
* Shrink di tutte le maschere (prima versione: scontrino)
* Introdotta libreria per gestione più fluida delle classi

### Versione 0.9.34
* Fix di errori da deepscan 
* Catalogo e catalogolocale ora viaggiano con le return corrette...
* Sistematizzato inventario (per realizzare nuova versione resa)
* Sort per EAN, titolo e funzione ricerca in bolla...

### Versione 0.9.33
* Nuovo rilascio inventari (collaudata)
* Nuova strategia di calcolo magazzino (compreso storico...ragiona delta ed effettua correzioni postume)
* Functions sistemate per terminare correttamente (tranne catalogo)
* Risolto un baco che non sganciava i listener in tableCassa (#282)

### Versione 0.9.32
* Refactoring della function (DRY)
* Eliminazione del vecchio metodo di gestione autenticazione

### Versione 0.9.31
* Fix dello scroll (aggiungendo visualizzazione specifica per chiave)
* Fix righe fantasma cancellando (#270)
* Aggiornato scontrino e cassa a react 17 (in prospettiva)
* Bug fixing complessivo in ambito scontrino e casse (#248)
* Eliminazione di rimbalzi in caricamenti di pagine (in corso)
* Migrazione a lifecycle di react 17 (in corso)

### Versione 0.9.30
* A prima chiamata dashboard si prende comunque i dati del giorno prima...
* Sistemato calcolo stock nei messaggi (#256)
* Aggiornato magazzino anche al refresh (sia per messaggi che per visualizzazione modal)

### Versione 0.9.29
* Sistemate le chiamate in partenza per la reportistica 
* Bolla in modalità "fast" (senza clessidra)

### Versione 0.9.28
* Inventario non conta le righe a zero tra quelle da inventariare (#260)
* Dashboard, elencobolle e bolle caricano con nuovo requireAuth
* Correzione routine caricamento dei report (#262)

### Versione 0.9.27
* Messo a posto e reingegnerizzato inventario: utilizza un magazzino storicizzato lato server
* Report ordinati per data crescente 
* Sperimentata estrazione da firebase per timestamp (diventa lo standard per le tabelle senza una chiave tempo)
* Aggiornamenti magazzino per timestamp
* Funzionalità di aggiornamento massivo (amministratore) magazzino (per ora con link brutale)
* Aggiunto indice su data creazione per magazzino e storicoMagazzino

### Versione 0.9.26
* Calcolo totali "anticipato" in locale (continua a comandare il calcolo sul server) per scontrino e cassa
* Generalizzata la funzionalità di calcolo nell'helper
* Sanato un problema del calcolo totali scontrino

### Versione 0.9.25
* Sconto in testata scontrino (improvement): ora con calcolo sul front-end (molto più veloce) e memorizzazione del default sconto per righe successive

### Versione 0.9.24
* Sconto in testata scontrino

### Versione 0.9.23
* Sconto manuale in scontrino azzera lo sconto percentuale
* Video youtube inseriti nel menu aiuto

### Versione 0.9.22
* Bug fixing crash in caso di scontrino cancellato durante il caricamento (#240)
* Ricerca inserita in tutte le componenti del software (tranne catalogo)
* Bug fixing: inventario rimesso a posto (righe doppie in fase di visualizzazione e calcolo totali sbagliato)
* Bug fixing: lente di ingrandimento disabilitata se campo EAN disabilitato

### Versione 0.9.21
* Aggiornato React a versione 16.3
* Aggiornato Antd a versione 3.4
* Campo per ricerca libera in bolle e scontrini (#213)!
* Bug fixing: da magazzino non si accedeva ai dettagli scontrino e bolla

### Versione 0.9.20
* Errori nella compilazione del form catalogo per campi mancanti

### Versione 0.9.19
* Cassa scrolla automaticamente a ultimo scontrino modificato...

### Versione 0.9.18
* Patch nella funzione per il calcolo nel backend
* Introdotta resa libera (non legata a una bolla)

### Versione 0.9.17
* Correzione in function calcolaTotaleCassa
* Abilitata architettura per calcolo report nel backend
* Rilasciati report con calcolo nel backend. Sono più lenti per piccoli volumi ma scalano meglio...

### Versione 0.9.16
* Update alla versione 1.0 di firebase functions 
* File di configurazione... in sicurezza

### Versione 0.9.15
* Selezionare tipo assoluto in un documento di acquisti cancella la data rendiconto (#229)
* Selezionare Man.Sconto in bolla cancella gli sconti inseriti 

### Versione 0.9.14
* Tasto refresh per i report
* Richiesta vecchia password al cambio password
* Stringhe errore localizzate (italiano... in corso)

### Versione 0.9.13
* Elenco casse... parte dalla fine
* Classifica libri anno corrente, anno precedente, mese precedente

### Versione 0.9.12
* Resizing dei report funziona (#221)
* Report responsive! (#222)

### Versione 0.9.11
* Ordinate per anno le label del report mese
* Aggiunto un report anno (con gli stessi criteri)
* Organizzato lo spazio del dashboard per gestire i report 
* Allargato lo spazio del report giornaliero

### Versione 0.9.10
* Separati report da magazzino. Ora homepage va ai report...(#218)
* Dashboard viene ricaricato al cambio della configurazione utente (#217)
* Bugfixing: ultima riga di una tabella viene caricata per prima
* Dashboard: report mensile

### Versione 0.9.9
* Range di date nella estrazione delle serie storiche nella reportistica
* Ripristinato recharts come strumento per i report
* Bug fixing: non visualizzava nuove righe in tutto meno che nelle casse!

### Versione 0.9.8
* Performance: risolto problema caricamento lento delle tabelle (esclusa cassa)
* Piccolo miglioramento grafica report

### Versione 0.9.7
* Bug fixing: il form scontrini rimaneva attivo anche senza uno scontrino selezionato
* Sostituita libreria per grafici (bizchart)

### Versione 0.9.6
* Primo rilascio grafici vendite (dashboard da disegnare)

### Versione 0.9.5
* Richiesta utente: inversione di campo data e campo cassa in elenco casse

### Versione 0.9.4
* Bug fixing: l'immagine del profilo non sopravviveva a un cambio di configurazione (#209)
* Bug fixing: cambio di configurazione non sgancia l'elenco casse...(#210)

### Versione 0.9.3
* Attivata funzione calcolo resto

### Versione 0.9.2
* Evidenziata testata scontrino in elenco cassa
* Cambiata dicitura e icona da vendite a cassa
* Individuata libreria per salvataggio docx (non attivo)
* Inseriti campi per calcolo resto (non attivi)

### Versione 0.9.1
* Aggiunta funzione in elencoCasse per salvare in excel una giornata di cassa (icona "dischetto")

### Versione 0.9.0
* Velocizzato upload delle immagini in catalogo
* Bug fixing: catalogo locale, non veniva caricato il titolo del libro
* Inizio collaudo utente

### Versione 0.8.5
* Impossibile salvare due inventari nella stessa giornata (#206)
* Ripristinato il modal standard di antd per le rese

### Versione 0.8.4
* Velocizzato radicalmente il caricamento delle immagini persistendo il link nel database
* Ripensata la persistenza dei dati nel database (cambiamento in catalogo scatena modifiche su tutti i record impattati)

### Versione 0.8.3
* Immagine di copertina anche nei dettagli (sia in inventario che in rese)
* Bugfixing: resa non veniva gestita correttamente al reload (vari crash)
* Necessario installare un componente aggiuntivo per la gestione del Modal delle rese...

### Versione 0.8.2
* Bug fixing: immagine in catalogo non veniva aggiornata correttamente (#203)
* Resizing immagine nel form configurazione utente e sistemazione scroll
* Resizing immagine nel form catalogo e sistemazione scroll
* Aggiornamento antd all'ultima versione (3.2.2)
* Aggiornamento firebase all'ultima versione (4.10.1)
* Aggiornamento react e react-dom all'ultima versione (16.2.0)

### Versione 0.8.1
* Upload di immagini nel catalogo locale
* Ridimensionamento automatico
* Upload di immagini da cloud... automatico!

### Versione 0.8.0
* Upload di avatar personalizzato 
* Fix di un baco nel segno delle rese nella reportistica (#201)
 
### Versione 0.7.4
* Dalle rese è possibile visualizzare lo storico dell'inventario per ciascun EAN per anno, mese e giorno
* Versione finale 0.7.x

### Versione 0.7.3
* La data inventario era sbagliata (#198)
* Baco nella data delle righe autogenerate in inventario
* La tabella dettagli adesso consente di navigare per anno, mese, giorno

### Versione 0.7.2
* Rese non venivano salvate correttamente nel registro per codice EAN (mancava la data)
* Inventario adesso ragiona alla data per il calcolo dei pezzi in stock e degli oggetti a stock non zero...

### Versione 0.7.1
* Mettere a zero una riga mandava in crash la resa
* Corretto un warning su deepscan 

### Versione 0.7.0
* Crash salvando una modifica in rese
* Calcolo di max rese e max gratis corretto

### Versione 0.6.6
* Versione finale 0.6.x
* La resa carica solo le bolle con dataCarico bolla < dataScarico resa
* Il totale stock è calcolato prima della data scarico
* I totali restavano "in clessidra" (#188) 
* In mancanza di almeno un fornitore andava in crash la bolla (#176)
* La lista fornitori non veniva aggiornata a cambio di configurazione (#177)
* Baco in calcolo totali magazzino (funzione sbagliata in firebase #193)
* Convenzionalmente tutti gli eventi avvengono alle 12.00 GMT+1 (le vendit, in prospettiva... secondo orascontrino)

### Versione 0.6.5
* Rese più chiare le scritte di errore
* Le modifiche nella form prima del salvataggio sono evidenziate in blu (#186)

### Versione 0.6.4
* I messaggi di errore sono visualizzati; i campi in errore sono valorizzati in rosso
* Modificati i metodi submit per salvare le informazioni giuste dalle varie componenti della resa (bolla, resa e testata resa) 
* Corretto l'update di riga (che non funzionava e generava doppi)
* Corretta la delete di riga (che non funzionava #187)

### Versione 0.6.3
* Refactoring del codice della gestione resa (#184)
* Eliminati warning 
* Il form non salva se ci sono errori (ma ancora non li sa evidenziare)

### Versione 0.6.2
* Rilascio pre-alpha delle funzionalità rese (dimostratore). Le cose più ovvie funzionano. Non ci sono controlli sui form!
* Il toggle resa aperta - resa chiusa funziona
* funziona correttamente update del valore delle rese (in modo coerente tra lo stato aperto e lo stato chiuso in insert, update e delete). 
* Bug fixing: ElencoRese non selezionava il mese
* Anche nelle rese chiuse si possono cambiare le quantità...

### Versione 0.6.1
* Nella modalità "aperta" si possono salvare le righe della resa...(per il momento senza controlli).
* La modalità chiusa mostra le righe di dettaglio.

### Versione 0.6.0
* Primo rilascio per una funzione rese (per ora NON funziona... ma si può avere un'idea di come sarà).
* Risolto un baco di visualizzazione (ridimensionamento form con immagine dentro) (#173)

### Versione 0.5.7
* Bug fixing: il menu utente lasciava in disordine il menu principale (#170)
* Bug fixing: ancora qualche scostamento nei form (scontrini)
* Avviato il test applicativo con Jest (per ora, solo unit)
* Prima gestione anagrafica fornitori

### Versione 0.5.6
* Fatto spazio tra form e tabelle (in modo migliore)
* Colorata in modo diverso la sezione degli inserimenti

### Versione 0.5.5
* Refactoring: pulitura del codice utilizzando il tool deepscan. Si conferma la necessità di ripulire wrappedForm.
* Refactoring: miglioramento del codice utilizzando il tool better code hub.
* Inserito il concetto di tipo bolla (Assoluto, Deposito e Rendiconto che è un deposito che si trasforma in assoluto a una data)

### Versione 0.5.4
* Feature: Salvataggio codice IVA in catalogo articoli e sua propagazione nelle righe
* Gestione delle anagrafiche generali e locali con persistenza nello stato utente

### Versione 0.5.3
* Fatto spazio tra form e tabelle
* Ridisegnato il posizionamento dei form e dei bottoni (#162, #163). Dovrò, probabilmente, fare un refactoring
* Refactoring: riscritto catalog per non usare un proprio action e un proprio reducer.
* Refactoring: inserito un catalogo locale alla libreria. Adesso ogni libreria ha un proprio catalogo libri 
con un catalogo condiviso che fa da memoria comune da cui pescare libri "noti". Così posso gestire codici privati. Ed evitare di sporcare le anagrafiche altrui.
Il primo che censisce un libro con codice 9... comunque lo fa per tutti. (#161)

### Versione 0.5.2
* Inserite note nella tabella elencoInventari
* Inseriti totali nella tabella elencoInventari
* Feature: fare click su una riga di elenco ti porta direttamente nel dettaglio. Questo risolve anche il quesito se avesse senso una diversa visualizzazione tra select e edit (#150)
* Invertito manuale e sconti in acquisti e vendite (#127)
* Premere su una riga in elenco magazzino ti porta al dettaglio anche senza premere sulla lente
* Bug fixing: il tasto "nuovo scontrino" non portava più al nuovo scontrino
* Bug fixing: cancellare uno scontrino non cancellava più il numero in scontrino nei dettagli
* Refactoring: ripensato il modo in cui cambia la URL degli scontrini

### Versione 0.5.1
* Ripristinata la gestione inputNumber sostituita in 0.4.6 (correzione suggerita in antd #8846)
* Sistemata la visibilità di README.md (messa in una modal)
* Messa in redux la selezione del menu in modo da sanare due bachi in visualizzazione insiti nel modo in cui avevo scritto il codice (#153, #159). Ogni voce di menu andrà aggiornata sia nel sider che nell'header.
* Eliminato il component userMenu che faceva casino e non consentiva la chiusura del menu in dropdown (#154)

### Versione 0.5.0  
* Feature... Rendo visibile README.md  (piccola modifica al processo di build) in una voce di menu
* README.md in formato markdown
  
### Versione 0.4.7  
* Portato antd a versione 3.1.0
* Feature: calcolati i totali occorrenze in creazione di inventario e aggiornati i totali...(nel modo corretto #158)
* Bug fixing: consentiva cancellazione di inventari non vuoti (#156)
   
  
### Versione 0.4.6
* Feature: più evidenti le righe disabilitate nei form
* Bug fixing: alcune anomalie nel form inventario (crash e focus che non torna se cambio i delta). Sono stato costretto a togliere InputNumber (più brutto... ma funziona) (#155)
* Bug fixing: rimbalzo in loop scegliendo il periodo (#147)
* Feature: totali inventario compara le righe caricate con le righe a magazzino

### Versione 0.4.5
* Bug fixing: Da inventario non puntava allo scontrino giusto se avevo già aperto quello scontrino (#146)
* Bug fixing: Non consentiva di modificare le note di una testata inventario (#143)
* Bug fixing: Crash in caricamento inventario su lastActionKey, correggendo in realtà tutto formReducer (#133)
* Bug fixing: Cancellando in sequenza più righe...si creava una riga vuota (#142)
* Bug fixing: Non gestiva il valore 0 negli input! Tutti.... (#151)
* Bug fixing: SetHeaderInfo chiamato a sproposito (#152)


### Versione 0.4.4 
* Gestione RegistroEAN per data 

### Versione 0.4.3
* Prima versione di un component che mostra i dettagli di un EAN (storico)
* Gestione di un bottone per tornare indietro in header
* Tasto specifico nel form del magazzino per vedere i dettagli...

### Versione 0.4.2 
* Creata funzione in table per evidenziare una riga (Pinned)...
* Aggiunta gestione dei pin in inventario...
* Inserito tasto in inventario per inserire righe automatiche (tutte pinned)
* Aggiunto il prezzo nel magazzino
* La chiave in registroEAN e registroData è stata allungata (idInventario+EAN)
* Bug fixing: inventario sforava le dimensioni (#135)
* Feature: solo le righe non a zero vengono caricate in inventario (#136)
* Feature: inserito un campo note in elencoInventari (#132)
* Bug fixing: crash spostandosi da un campo svalido (#134)
* Disabilitato per ora il calcolo totali in inventario (devo decidere cosa visualizzare)


### Versione 0.4.1
* Creo ElencoInventario per copia di ElencoBolle e Inventario per copia di Bolle.
* Inventario ragiona con chiave EAN. Rilascio in alpha! E solo per la componente manuale.
* Bug fixing: Non venivano resettati i filtri in magazzino (#130)
* Feature: Inserito un mini-tasto reset nella ricerca cassa (#131)

### Versione 0.4.0
* Comincio a lavorare all'inventario.
* Feature (nascosta): Rendo wrappedtable capace di filtrare per regex. A questo fine passo una prop a wrappedtable che è un oggetto.
					I valori dell'oggetto li metto in input fields nello stato di ogni form che usa form helper...
* Abilitata la ricerca in magazzino e nella tabella cassa
* Modificata la wrappedtable di tabella cassa per stesse caratteristiche di wrappedtable generica...


### Versione 0.3.3
* Bug fixing: Eliminato il bounce fastidioso sulle pagine (#121)
* Refactoring: Ripulito il foglio di stile con commenti...
* Refactoring: Eliminate immagini inutili
* Bug fixing: In reload non ricaricava lo scontrino (questa era tricky... zero vale false ) (#118) 
* Feature: Resa parametrica in foglio di stile la dimensione della tabella cassa (il font) (#122)
* Feature: Spazio per l'immagine del libro in foglio di stile (#123)

### Versione 0.3.2 
* Bug fixing: Il form di change della testata andava disabilitato se non avevo uno scontrino selezionato (#115)
* Feature: Ho reso più evidenti le sezioni di scontrino sistemando le lunghezze delle colonne
* Refactoring codice: Alcuni richiami a getMeasures... non servivano a niente (#116)

### Versione 0.3.1
* Due miglioramenti in gestione tabelle... click in qualsiasi punto della riga e riga tutta evidenziata.


### Versione 0.3.0
* Bug fixing: elenco giornale cassa perdeva i listeners saltando da uno scontrino all'altro (#112)
* Bug fixing: Se cancellavo uno scontrino vuoto... il totale della cassa andava in clessidra (#113)
* Bug fixing: Magazzino non veniva resettato quando cambiovo libreria (#111)


### Versione 0.2.4 
* GLi utenti che si registrano vanno in una sandbox in cui possono giocare senza fare danni.
* La catena è "sandbox", la libreria è "sandbox".
* Ho inserito una nuova sezione in database e ho creato una select specifica che legge la fetta di sezione abilitata per un utente.
* Aggiunta gestione nome, cognome e nickname in fase di creazione utente e associazione del profilo a default libreria e catena...
* Gestione corretta numeri scontrino

### Versione 0.2.3
* Inserito un concetto di "messageBuffer" nel formHelper... se è pieno... mostro un messaggio...
Con esso mostro le giacenze a ogni inserimento in bolla e scontrino!
* Bug fixing: le altezze non venivano più calcolate bene in bolla e scontrino...


### Versione 0.2.2
Gestione cambio password e password dimenticata:  
- ho una sola scene per tutto lo userMgmt (ho eliminato la scene login e ridenominato quella signup)
- gestisco correttamente il reset della password, il cambio password e tutto il resto... 


### Versione 0.2.1
* Bug fixing: Cancellare uno scontrino non aggiornava i totali di cassa.
* Bug fixing: Cancellare uno scontrino non eliminava lo scontrino dalla sezione di dettaglio
* Bug fixing: Non veniva controllato che il numero scontrino è intero positivo
* Bug fixing: In fase di reload non veniva caricata la riga dello scontrino nello stato
* Bug fixing: Non consento di cancellare le maschere con date o ore



### Versione 0.2.0
* Cambiato il paradigma... Dettagli sotto... totali sopra. In questo modo da sinistra a destra e da sopra a sotto si procede sempre
in maggior dettaglio....
* Creato uno "stub" bookImg... da richiamare per mostrare l'immagine di un EAN...
* Eliminato il campo gratis dall'elenco casse e inserito il calcolo del totale degli scontrini...


### Versione 0.1.4 
* Ultimo rilascio 0.1.x Parto con implementazione inventario. Ho fatto hammering dei bachi più ovvi... Ci torno in seguito.

### Versione 0.1.3
* Rilasciata in pre-collaudo una versione (con grafica molto rozza) che gestisce un giornale di cassa.
* Va fatto debugging... prima di mettere mano a una grafica più appealing...
* Ho fatto upgrade a React 16 e antd 3.0.


### Versione 0.1.2
* Bug fixing: rimanevano appesi alcuni listener. 

