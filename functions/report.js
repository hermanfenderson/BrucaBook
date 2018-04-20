var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
const moment = require('moment');

const generateTop5thisYear = (matrixVendite, year) => {return matrixVendite.anno[year] ? firstX(topList(matrixVendite.anno[year].ean),5) : []};

const generateTop5lastYear  = (matrixVendite, lastYear) => {return matrixVendite.anno[lastYear] ? firstX(topList(matrixVendite.anno[lastYear].ean),5) : [];}

const generateTop5lastMonth  = (matrixVendite, lastMonthArray)  => {return (matrixVendite.anno[lastMonthArray[0]] && matrixVendite.anno[lastMonthArray[0]].mese[lastMonthArray[1]]) ?  firstX(topList(matrixVendite.anno[lastMonthArray[0]].mese[lastMonthArray[1]].ean),5) : []}
								

const setDay = (moment) =>
{
	return(moment.startOf('day').add(12,'hours').valueOf());
}

const generateSerieIncassi = (matrixVendite) => {
		let ts = getTimeSeries(matrixVendite,'anno/mese/giorno',null,null);
		ts.sort((a,b) => {return (moment(a.period, 'YYYY/MM/DD') - moment(b.period, 'YYYY/MM/DD'))});
		for (let i=0; i<ts.length;i++) 
			{
			ts[i].period = moment(ts[i].period, 'YYYY/MM/DD').format('DD/MM/YY');
			ts[i].incasso = ts[i].ricavoTotale;
			}
		console.log(ts);	
		return ts;
};


const generateSerieIncassiAnni = (matrixVendite) => {
		let ts = getTimeSeries(matrixVendite,'anno',null,null);
		let tsOut = [];
		//Poggio totale, ytd e dty per mese e per anno
		for (let j=0; j<ts.length; j++) 
			{   
			    let year = ts[j].period;
			    let ytd = year+'ytd';
			    let dty = year+'dty';
			    let obj = {};
			    obj.anno = year;
			    obj[ytd] = ts[j].ricavoTotaleYTD;
				obj[dty] = ts[j].ricavoTotaleDTY;
				obj[year] = ts[j].ricavoTotale;
			    tsOut.push(_extends({}, obj));
				
			};	
		return tsOut;	
} 


const generateSerieIncassiMesi = (matrixVendite) => {
		let ts = getTimeSeries(matrixVendite,'anno/mese',null,null);
		let tsOut = [];
		//Inizializzo la sequenza dei mesi
		for (let i=1; i<13; i++) tsOut.push({mese: i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) });
		//Poggio totale, ytd e dty per mese e per anno
		for (let j=0; j<ts.length; j++) 
			{   
			     
			    let tag = ts[j].period.split('/');
			    let year = tag[0];
			    let period = parseInt(tag[1],10)-1;
			    let ytd = year+'ytd';
			    let dty = year+'dty';
			   
				tsOut[period][ytd] = ts[j].ricavoTotaleYTD;
				tsOut[period][dty] = ts[j].ricavoTotaleDTY;
				tsOut[period][year] = ts[j].ricavoTotale;
			};	
		return tsOut;	
} 

const getTimeSeries = (matrix, level, from, to) =>
{

let ts = [];
let levels	= level.split('/');
let count = levels.length;
let list = matrix[levels[0]];
let tag = [];
let period = '';
//Array from formato anno/mese/giorno... o comunque i livelli che mi servono
const branchExplorer = (branch, depth) =>
{
	for (let propt in branch)
	   {
	   	tag[depth] = propt;
	    let subbranch = branch[propt];
	   if (depth+1 === count) 
			{
			period = tag.join('/');
			if (((!from) || (period >= from)) && ((!to) || (period <=to))) ts.push(
				{period: period, 
				ricavoTotale: parseFloat(subbranch.ricavoTotale.toFixed(2)), 
				listinoTotale: parseFloat(subbranch.listinoTotale.toFixed(2)),
				tatalePezzi: parseInt(subbranch.totalePezzi,10),
				ricavoTotaleYTD: parseFloat(subbranch.ricavoTotaleYTD.toFixed(2)), 
				listinoTotaleYTD: parseFloat(subbranch.listinoTotaleYTD.toFixed(2)),
				tatalePezziYTD: parseInt(subbranch.totalePezziYTD,10),
				ricavoTotaleDTY: parseFloat(subbranch.ricavoTotaleDTY.toFixed(2)), 
				listinoTotaleDTY: parseFloat(subbranch.listinoTotaleDTY.toFixed(2)),
				tatalePezziDTY: parseInt(subbranch.totalePezziDTY,10),
				});	
				
			}
		else
			{
			branchExplorer(subbranch[levels[depth+1]],depth+1);	
			}
			
	   }
}
branchExplorer(list,0);
return ts;	
}

const getMatrixVenditeFromRegistroData = (registroData, today=setDay(moment())) =>
{
	//Creo una matrice con i dati anno per anno e mese per mese...
	//Stock, deltaStock, bolla, resa, scontrino, inventario...
	const isYTD = (date, today) =>
	{
	//Vero se sto in un mese precedente o nel medesimo mese in un giorno precedente
	let dateMmt = moment(parseInt(date,10));
	let todayMmt = moment(parseInt(today,10)); 
	
    let meseIn = dateMmt.format('MM');
    let mese = todayMmt.format('MM');
    let giornoIn = dateMmt.format('DD');
    let giorno = todayMmt.format('DD');
    let ytd = ((meseIn < mese) || ((meseIn === mese) && (giornoIn < giorno)));
	return (ytd);
	}
	
   	const updateCellSublevel = (submatrix, period, details, ytd) =>
	{
		if (!submatrix[period])  submatrix[period] = {ean: {}, 
													  totalePezzi: 0, 
													  ricavoTotale: parseFloat(0.0), 
													  listinoTotale: parseFloat(0.0),
													  totalePezziYTD: 0, 
													  ricavoTotaleYTD: parseFloat(0.0), 
													  listinoTotaleYTD: parseFloat(0.0),
													  totalePezziDTY: 0, 
													  ricavoTotaleDTY: parseFloat(0.0), 
													  listinoTotaleDTY: parseFloat(0.0),
													 };
													 
		submatrix[period].totalePezzi += details.totalePezzi;
		submatrix[period].ricavoTotale += details.ricavoTotale;
		submatrix[period].listinoTotale += details.listinoTotale;
		if (ytd)
			{
			submatrix[period].totalePezziYTD += details.totalePezzi;
			submatrix[period].ricavoTotaleYTD += details.ricavoTotale;
			submatrix[period].listinoTotaleYTD += details.listinoTotale;
			}
		else 
			{
			submatrix[period].totalePezziDTY += details.totalePezzi;
			submatrix[period].ricavoTotaleDTY += details.ricavoTotale;
			submatrix[period].listinoTotaleDTY += details.listinoTotale;
			}
		if (!submatrix[period].ean[details.ean]) submatrix[period].ean[details.ean] = {totalePezzi: 0, 
													  ricavoTotale: parseFloat(0.0), 
													  listinoTotale: parseFloat(0.0)};
			submatrix[period].ean[details.ean].titolo = details.titolo;
			submatrix[period].ean[details.ean].autore = details.autore;
			submatrix[period].ean[details.ean].editore = details.editore;
			submatrix[period].ean[details.ean].imgFirebaseUrl = details.imgFirebaseUrl;
		
			submatrix[period].ean[details.ean].ean = details.ean;
			submatrix[period].ean[details.ean].totalePezzi += details.totalePezzi;
			submatrix[period].ean[details.ean].ricavoTotale += details.ricavoTotale;
			submatrix[period].ean[details.ean].listinoTotale += details.listinoTotale;
	
	}
	
	const updateCell = (matrix, dataIn, details, ytd) =>
		{ 
	 	let data = (moment(parseInt(dataIn,10)));
		let anno = data.format('YYYY');
		  let mese = data.format('MM');
		  let giorno = data.format('DD');
		   updateCellSublevel(matrix.anno, anno, details, ytd);
		   if (!matrix.anno[anno].mese) matrix.anno[anno].mese = {};
		   updateCellSublevel(matrix.anno[anno].mese, mese, details, ytd);
		   if (!matrix.anno[anno].mese[mese].giorno) matrix.anno[anno].mese[mese].giorno = {};
		   updateCellSublevel(matrix.anno[anno].mese[mese].giorno, giorno, details, ytd);
		 }
		
	let matrix = {anno: {}, totale: {ean: {}, totalePezzi: 0, ricavoTotale: parseFloat(0.0), listinoTotale: parseFloat(0.0) }};
	 
	 let date = registroData;	
            	  for(var propt2 in date)
		  			{
		  			  let righe = date[propt2];
		  				for (var propt in righe)	
		  				{
		  				 	if (righe[propt].tipo === "scontrini")
		  					{
		  					let ean = righe[propt].ean;
		  					let totalePezzi =  parseInt(righe[propt].pezzi,10);
			    		    let ricavoTotale = parseFloat(righe[propt].prezzoTotale);
			    		    let listinoTotale = totalePezzi * (parseFloat(righe[propt].prezzoListino));
			    		     let dettagli = {
			    		    	titolo: righe[propt].titolo, 
			    		    	autore: righe[propt].autore, 
			    		    	editore: righe[propt].editore,
			    		    	imgFirebaseUrl: righe[propt].imgFirebaseUrl,
			    		    	ean: ean,
			    		    	totalePezzi: totalePezzi,
			    		    	ricavoTotale: ricavoTotale,
			    		    	listinoTotale: listinoTotale
			    		    	}
			    		    	updateCell(matrix,propt2, dettagli, isYTD(propt2,today));
		  					}
							
		  				}
		  			}	
    return matrix;		  			
}

//Dato un pezzo di matriceVenditeEAN ritorna un array ordinato secondo totalePezzi decrescente e a paritù di pezzi listinoTotale decrescente
const topList = (eanObj) =>
{  if (eanObj)
		{
		//let eanArray = Object.values(eanObj);
		var eanArray = [];
    	for (const prop in eanObj) {
        	eanArray.push(eanObj[prop]);
    	}
		eanArray.sort((a,b) => {return ((a.totalePezzi !== b.totalePezzi) ? b.totalePezzi - a.totalePezzi : (a.listinoTotale !== b.listinoTotale) ? b.listinoTotale - a.listinoTotale : 0) })
		return eanArray;
		}
	return null;	
}

//Trova i primi in classifica (su array ordinato)
const firstX = (eanSortedArray, number) =>
{
let rank = 0;
let lastPezzi = 0;
let outputArray = [];
for (let i=0; i<eanSortedArray.length; i++)
	{
		if (i===0 || eanSortedArray[i].totalePezzi < lastPezzi) {rank++; lastPezzi = eanSortedArray[i].totalePezzi}
		outputArray.push(_extends({}, eanSortedArray[i], {rank: rank, key: i}));
		if (outputArray.length === number) break;
	}
	
return outputArray;	
}

module.exports = {
 generateTop5thisYear: generateTop5thisYear,
 generateTop5lastYear: generateTop5lastYear,
 generateTop5lastMonth: generateTop5lastMonth,
getMatrixVenditeFromRegistroData:getMatrixVenditeFromRegistroData,
generateSerieIncassi:generateSerieIncassi, 
generateSerieIncassiMesi:generateSerieIncassiMesi, 
generateSerieIncassiAnni:generateSerieIncassiAnni
	
}


