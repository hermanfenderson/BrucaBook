import React, {Component} from 'react'
import {XAxis, YAxis, Tooltip, Legend, Bar, BarChart, LabelList} from 'recharts';
import {year2color} from '../colors';
import TooltipComponentYTD from './TooltipComponentYTD';


class ChartIncassiAnni extends Component {
render()
	{
	let years = {};
	let elencoAnni = [];
	let legend = [];
 	for (let i=0; i <this.props.serieIncassiAnni.length; i++)
				{
				let anno = this.props.serieIncassiAnni[i].anno;
				years[anno] = { value: anno, type: 'square', id: anno, color: year2color(anno,0) };
				elencoAnni.push(anno); 
				}
		elencoAnni.sort(); //Ordino per anno
		for (let k=0; k<elencoAnni.length; k++) legend.push(years[elencoAnni[k]]); 
		console.log(years);
	return(	
	<BarChart width={this.props.width} height={this.props.height} data={this.props.serieIncassiAnni}
	            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
	       <XAxis dataKey="anno"/>
	       <YAxis/>
	       <Legend payload={legend}/>
	        <Tooltip content={<TooltipComponentYTD span={'year'}/>}/>
	      
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'ytd'} dataKey={currentValue+'ytd'} stackId={0} fill={year2color(currentValue,0)} /> )})}
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'dty'} dataKey={currentValue+'dty'} stackId={0} fill={year2color(currentValue,1)}> <LabelList dataKey={currentValue} position="top" /> </Bar> )})}
	</BarChart>) 
 }
}
export default ChartIncassiAnni;