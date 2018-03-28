import React, {Component} from 'react'
import {XAxis, YAxis, Tooltip, Legend, Bar, BarChart, ResponsiveContainer} from 'recharts';
import {year2color} from '../colors';
import TooltipComponentYTD from './TooltipComponentYTD';


class ChartIncassiMesi extends Component {
render()
	{
	let years = {};
	let elencoAnni = [];
	let legend = [];
 	for (let i=0; i<this.props.serieIncassiMesi.length; i++)
		for (let j in this.props.serieIncassiMesi[i]) 
		  if (j!=='mese') 
			{
			var anno = j.substring(0, 4);
			if (years[anno]===undefined) 
				{
				years[anno] = { value: anno, type: 'square', id: anno, color: year2color(anno,0) };
				elencoAnni.push(anno); 
				}
			}
		elencoAnni.sort(); //Ordino per anno
		for (let k=0; k<elencoAnni.length; k++) legend.push(years[elencoAnni[k]]); 
		
	return(	
	<ResponsiveContainer width={this.props.width} height={this.props.height} >	
		
	<BarChart  data={this.props.serieIncassiMesi}
	            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
	       <XAxis dataKey="mese"/>
	       <YAxis/>
	       <Legend payload={legend}/>
	        <Tooltip content={<TooltipComponentYTD span={'month'}/>}/>
	      
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'ytd'} dataKey={currentValue+'ytd'} stackId={index} fill={year2color(currentValue,0)} /> )})}
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'dty'} dataKey={currentValue+'dty'} stackId={index} fill={year2color(currentValue,1)} /> )})}
	</BarChart>
</ResponsiveContainer>

	) 
 }
}
export default ChartIncassiMesi;