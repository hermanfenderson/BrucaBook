BrucaBook V.0.5.0
=================
gestionale per librerie indipendenti. Utilizza React e Firebase.  
  
Storia delle versioni
---------------------
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

