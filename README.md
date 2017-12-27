BrucaBook è un gestionale (tutto da costruire) per librerie indipendenti.
Utilizza React e Firebase.

Versione 0.3.2 
Bug fixing: Il form di change della testata andava disabilitato se non avevo uno scontrino selezionato (#115)
Feature: Ho reso più evidenti le sezioni di scontrino
Refactoring codice: Alcuni richiami a getMeasures... non servivano a niente (#116)

Versione 0.3.1
Due miglioramenti in gestione tabelle... click in qualsiasi punto della riga e riga tutta evidenziata.


Versione 0.3.0
Bug fixing: elenco giornale cassa perdeva i listeners saltando da uno scontrino all'altro (#112)
Bug fixing: Se cancellavo uno scontrino vuoto... il totale della cassa andava in clessidra (#113)
Bug fixing: Magazzino non veniva resettato quando cambiovo libreria (#111)


Versione 0.2.4 
GLi utenti che si registrano vanno in una sandbox in cui possono giocare senza fare danni.
La catena è "sandbox", la libreria è "sandbox".
Ho inserito una nuova sezione in database e ho creato una select specifica che legge la fetta di sezione abilitata per un utente.
Aggiunta gestione nome, cognome e nickname in fase di creazione utente e associazione del profilo a default libreria e catena...

Gestione corretta numeri scontrino

Versione 0.2.3
Inserito un concetto di "messageBuffer" nel formHelper... se è pieno... mostro un messaggio...
Con esso mostro le giacenze a ogni inserimento in bolla e scontrino!
Bug fixing: le altezze non venivano più calcolate bene in bolla e scontrino...


Versione 0.2.2
Gestione cambio password e password dimenticata:
- ho una sola scene per tutto lo userMgmt (ho eliminato la scene login e ridenominato quella signup)
- gestisco correttamente il reset della password, il cambio password e tutto il resto... 


Versione 0.2.1
Bug fixing: Cancellare uno scontrino non aggiornava i totali di cassa.
Bug fixing: Cancellare uno scontrino non eliminava lo scontrino dalla sezione di dettaglio
Bug fixing: Non veniva controllato che il numero scontrino è intero positivo
Bug fixing: In fase di reload non veniva caricata la riga dello scontrino nello stato
Bug fixing: Non consento di cancellare le maschere con date o ore



Versione 0.2.0
Cambiato il paradigma... Dettagli sotto... totali sopra. In questo modo da sinistra a destra e da sopra a sotto si procede sempre
in maggior dettaglio....
Creato uno "stub" bookImg... da richiamare per mostrare l'immagine di un EAN...
Eliminato il campo gratis dall'elenco casse e inserito il calcolo del totale degli scontrini...


Versione 0.1.4 
Ultimo rilascio 0.1.x Parto con implementazione inventario. Ho fatto hammering dei bachi più ovvi... Ci torno in seguito.

Versione 0.1.3
Rilasciata in pre-collaudo una versione (con grafica molto rozza) che gestisce un giornale di cassa.
Va fatto debugging... prima di mettere mano a una grafica più appealing...
Ho fatto upgrade a React 16 e antd 3.0.


Versione 0.1.2
Bug fixing: rimanevano appesi alcuni listener. 

