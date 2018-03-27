//Di cortesia... una matrice di colori
//Due livelli colori tratti da https://ant.design/docs/spec/colors ho scelto livello 8 e livello 4 del medesimo colore per 12 colori primari. Sto a posto per 12 anni... poi si vedrà
import moment from 'moment';
export const colors = 
[
['#0050b3','#69c0ff'],
['#5b8c00','#d3f261'],
['#ad4e00','#ffc069'],
['#9e1068','#ff85c0'],
['#006d75','#5cdbd3'],
['#ad8b00','#fff566'],
['#ad2102','#ff9c6e'],
['#391085','#b37feb'],
['#237804','#95de64'],
['#ad6800','#ffd666'],
['#a8071a','#ff7875'],
['#10239e','#85a5ff'],
];

export const year2color = (year, level=0) =>
{
	let yearInt = parseInt(year,10);
	let todayInt = parseInt(moment().format('YYYY'),10)
	let index = (todayInt - yearInt) % 12;
	return(colors[index][level]);
};


