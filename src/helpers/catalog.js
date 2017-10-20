//Helpers che utilizzano Firebase e altre fonti dati per restuire come promise dati parziali o totali...
//Li isolo qui rispetto al container catalog...
import {isAmount} from './validators';
export const isComplete = (item) =>
{
	return((item.titolo.length > 0) && (item.autore.length > 0) && (item.editore.length > 0) && isAmount(item.prezzoListino) && item.prezzoListino > 0);
}

export const isCompleteWithImage = (item) =>
{
	return(isComplete(item) && item.autore.imageUrl.length > 0)
}