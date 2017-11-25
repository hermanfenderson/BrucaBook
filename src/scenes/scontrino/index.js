/*E' solo per comodità futura di lettura...
Questa scena fonde due scene: CASSA e SCONTRINO
Base di dati quindi elencoScontrini e scontrini
Testata di CASSA in elencoCasse
Item di CASSA in scontrini (su di uno in gerarchia)

Testata di SCONTRINO in elencoScontrini
Itemi di SCONTRINO in scontrini (giu' di uno in gerachia)

Contiene:
1. un form "nascosto" fatto solo di un bottone e di campi read-only per mostrare i totali di tutta la cassa
2. Un bottone per mostrare/nascondere i dettagli (tabella di cassa)
3. Una tabella fatta di righe di testata per ogni scontrino, elenco degli oggetti delo scontrino, una riga di coda per ogni scontrino
4. Form per inserire una riga in scontrino
5. Totali dello scontrino
6. Form per cambiare il numero dello scontrino e calcolare il resto...
7. Tabella con lo scontrino corrente

1 + 2 | 4 | 5
3     | 7 | 6

Ho tre colonne suddivise ciascuna in due righe (altezze variabili?)
*/

import Scontrino from './components/Scontrino'; //Contenuto statico per ora...
export default Scontrino;
