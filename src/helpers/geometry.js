//Coalcola le dimensioni di form e tabelle tramite parametri
//colParams è un array 
//Esempio
/*
[
{min: 100, max: 200, name: 'nome'}
]

*/
const MIN_GUT=8;
export const FORM_COL_H=60;
const SEL_W=60;
const SCROLL_W=10;
const FORM_MARGIN=25;
export const GE_H = 40;
export const FMH = 10; //Form margin Height
export const FMW = 10; //Form margin Width

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

export const calcFormColsFix = (params) =>
{
	let colParams = params.colParams;
	let minGutter= (params.minGutter) ? params.minGutter : MIN_GUT;
	let width = params.width - FORM_MARGIN; 
	let height = (params.height) ? params.height : FORM_COL_H;
	let offset = params.offset;
	let cols = calcFormCols(colParams, minGutter, width);
	let colsObj = {};
	let left = 0;
	for (let i=0; i<colParams.length; i++)
		{   let name = colParams[i].name;
			let width = cols[name];
			colsObj[name] = {width: width, height: height, top: offset*height, left: left};
			left += width + cols.gutter; //Sommo la larghezza
		}
    return colsObj;
			
}

export const calcGeneralError = (params) =>
{
let width = params.width - FORM_MARGIN;
let height = (params.height) ? params.height : GE_H;
let offset = params.offset;
return ({width: width, height: height, top: offset*FORM_COL_H, left: 0})
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

export const calcHeaderFix = (params) =>
{
	let colParams = params.colParams;
	let width = params.width - SEL_W - SCROLL_W;
	return(calcHeader(colParams,width));
}
//I Params dovrebbero essere
//width (con default)
//height (con default)
//un array tbc (in modo da garantire l'ordine) di costanti e funzioni da valutare in modo da generare un oggetto di valori calcolati che passa in input in fase di costruzione...
//Ad esempio...
//[{formHeight: 200}, {tableHeight: (calc) => {return(calc.width - calc.formHeight)}}]
//In questo modo calc viene generato dinamicamente nella forma: calc = {tableHeight: 200}
//un array che contiene i vari elementi della geometria (sempre una function eventualmente dipendente dai valori calcolati) e cosa cambia al cambiare di w e di h
//ad esempio geo =[	formCols1:  (cal) => {return(calcFormColsFix(cal.colParams1,8,cal.formWidth -25,60,0)}] 
    				
//la geometry in ingresso
//Se lavora "full" o per differenza (per una variazione su w o una su h)... ma forse è davvero del tutto inutile...
// fornisce una geometry in uscita.
export function initCalcGeometry(params) {
//Closure attorno a params
return (
	function calcGeometry(wh={})  
	{
	let cal = (params.cal) ? params.cal : {};
	cal.w = (wh.w) ? wh.w : 960;
	cal.h = (wh.h) ? wh.h : 720;
	for (let i=0; i<params.tbc.length; i++)
		{
		let [name, val] = Object.entries(params.tbc[i])[0];
		cal[name] =  val(cal) ;
		}
	let geometry = (params.geometry) ? params.geometry : {};
	
	let newGeo = {...geometry}; //Creo una copia della geometry in input	
	for (let i=0; i<params.geo.length; i++)
		{
			 let [name, val] = Object.entries(params.geo[i])[0];
          
		newGeo[name] = val(cal);
		}
	return newGeo;
	})
}