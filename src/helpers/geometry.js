//Coalcola le dimensioni di form e tabelle tramite parametri
//colParams è un array 
//Esempio
/*
[
{min: 100, max: 200, name: 'nome'}
]

*/

export const calcFormCols = (colParams, minGutter, width) =>
{
	let numCol = colParams.length;
	let minTot = 0;
	for (let i=0; i<numCol; i++) minTot += colParams[i].min; //Calcolo la somma dei minimi
	//Vedo se ho spazio a disposizione per allargarmi
	let spread = width - minGutter * (numCol - 1) - minTot;
	let cols = {};
	if (spread > 0)
		{
		//calcolo le richieste...
		let wants = [];
		let totWant = 0;
		for (let i=0; i<numCol; i++) 
			{wants[i] = colParams[i].max ?  colParams[i].max - colParams[i].min : spread;
			totWant += wants[i];
			}
		//Se posso soddisfare tutte le richieste	
		if (totWant <= spread)	
			{
			//Aggiusto il gutter...
			let gutter = minGutter + (spread - totWant) / (numCol - 1); //Assegno quello che avanza...al gutter
			cols = {gutter: gutter};
			for (let i=0; i<numCol; i++) cols[colParams[i].name] = colParams[i].min + wants[i];
			}
		else 
			{
			cols = {gutter: minGutter};
			for (let i=0; i<numCol; i++) cols[colParams[i].name] = colParams[i].min + spread * wants[i] / totWant; //A ognuno secondo le proprie necessità...
			}
		
		}
	//Se non ho spazio ritorno un oggetto con i nomi e i minimi
	else 	
		{
			cols = {gutter: minGutter}
			for (let i=0; i<numCol; i++) cols[colParams[i].name] = colParams[i].min;
		}
    return cols;
			
}

//Coalcola le dimensioni di form e tabelle tramite parametri
//colParams è un array 
//Esempio
/*
[
{min: 100, max: 200, name: 'nome'}
]
Ritorna un oggetto con top, left, width, height. Offset è un integer che dice a quale riga sto...
*/

export const calcFormColsFix = (colParams, minGutter, width, height=60, offset=0) =>
{
	
	let cols = calcFormCols(colParams, minGutter, width);
	let colsObj = {};
	let left = 0;
	for (let i=0; i<colParams.length; i++)
		{   let name = colParams[i].name;
			let width = cols[name];
			colsObj[name] = {width: width, height: height, top: offset, left: left};
			left += width + cols.gutter; //Sommo la larghezza
		}
    return colsObj;
			
}

export const calcGeneralError = (width,  offset=0, height=40,) =>
{
return ({width: width, height: height, top: offset, left: 0})
}
//Calcolatore di coordinate per generalError


//colParams è un array un po' diverso
//Esempio
/*
[
{min: 100, max: 200, name: 'nome', label: 'label', shortLabel: 'sh.', shortBreak: 50}
]

*/
export const calcHeader = (colParams, width) =>
{
		let numCol = colParams.length;
	let minTot = 0;
	for (let i=0; i<numCol; i++) minTot += colParams[i].min; //Calcolo la somma dei minimi
	//Vedo se ho spazio a disposizione per allargarmi
	let spread = width  - minTot;
	let cols = [];

	for (let i=0; i<numCol; i++) 
		{cols.push({dataField: colParams[i].name});
		 if (colParams[i].sort) cols[i].sort = colParams[i].sort;
		if (colParams[i].ellipsis) cols[i].ellipsis = colParams[i].ellipsis;
			
		} //Inizio a mettere il nome e altri operatori se ci sono
	if (spread > 0)
		{
		//calcolo le richieste...
		let wants = [];
		let totWant = 0;
		for (let i=0; i<numCol; i++) 
			{wants[i] = colParams[i].max ?  colParams[i].max - colParams[i].min : spread;
			totWant += wants[i];
			}
		//Se posso soddisfare tutte le richieste	
		if (totWant <= spread)	
			{
			//Aggiusto il gutter...
			for (let i=0; i<numCol; i++) cols[i].width = colParams[i].min + wants[i];
			}
		else 
			{
			for (let i=0; i<numCol; i++) cols[i].width = colParams[i].min + spread * wants[i] / totWant; //A ognuno secondo le proprie necessità...
			}
		
		}
	//Se non ho spazio ritorno  i minimi
	else 	
		{
			
			for (let i=0; i<numCol; i++) cols[i].width = colParams[i].min;
		}
	//Adesso devo sistemare le label
	        for (let i=0; i<numCol; i++) cols[i].label = (!colParams[i].shortBreak || cols[i].width > colParams[i].shortBreak) ? colParams[i].label : colParams[i].shortLabel;
    return cols;
}