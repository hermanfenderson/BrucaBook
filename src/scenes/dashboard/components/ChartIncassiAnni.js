import React, {Component} from 'react'
import {XAxis, YAxis, Tooltip, Legend, Bar, BarChart, LabelList, ResponsiveContainer, Label} from 'recharts';
import {year2color} from '../colors';
import TooltipComponentYTD from './TooltipComponentYTD';


class ChartIncassiAnni extends Component {
render()
	{
	let years = {};
	let elencoAnni = [];
	let legend = [];
	let leng = this.props.serieIncassiAnni ? this.props.serieIncassiAnni.length : 0;
 	for (let i=0; i <leng; i++)
				{
				let anno = this.props.serieIncassiAnni[i].anno;
				years[anno] = { value: anno, type: 'square', id: anno, color: year2color(anno,0) };
				elencoAnni.push(anno); 
				}
		elencoAnni.sort(); //Ordino per anno
		for (let k=0; k<elencoAnni.length; k++) legend.push(years[elencoAnni[k]]); 
	return(	
	<ResponsiveContainer width={'100%'} height={this.props.height} >	
	<BarChart  data={this.props.serieIncassiAnni}
	            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
	       <XAxis dataKey="anno"/>
	       <YAxis/>
	       <Label value='Confronto incassi annui' position='top'/>
       
	       <Legend payload={legend}/>
	        <Tooltip content={<TooltipComponentYTD span={'year'}/>}/>
	      
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'ytd'} dataKey={currentValue+'ytd'} stackId={0} fill={year2color(currentValue,0)} /> )})}
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'dty'} dataKey={currentValue+'dty'} stackId={0} fill={year2color(currentValue,1)}> <LabelList dataKey={currentValue} position="top" /> </Bar> )})}
	</BarChart>
	</ResponsiveContainer>
	) 
 }
}
export default ChartIncassiAnni;