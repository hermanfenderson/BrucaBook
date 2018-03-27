import React, {Component} from 'react'
import moment from 'moment'
import {XAxis, YAxis, Tooltip, Legend, Bar, BarChart} from 'recharts';
import {year2color} from '../colors';

const TooltipComponent = (props) =>
{   
    const { active } = props;
    if (active && props.payload.length > 0) {
      let values={};
       const { payload, label } = props;
     
      for (let i=0; i<payload.length; i++)
    	{
    	 	let year=payload[i].name.substring(0, 4);
    	 	let sub = (payload[i].name.length > 4) ? payload[i].name.substring(4, 8) : 'full';
    	 	if (!values[year]) values[year] = {'full': 0.0,'ytd': 0.0,'dty': 0.0}; //Totale anno,ytd e dty
    	 	values[year][sub] = payload[i].value;
    	 	values[year].full = payload[i].payload[year];
    	}
      for (let j in values) values[j].label = (values[j].ytd > 0 && values[j].dty > 0) ? j+': '+values[j].full+' ('+values[j].ytd+' / '+values[j].dty+')' : j+': '+values[j].full;
      return (
        <div className="custom-tooltip">
        {moment(label,'MM').format('MMMM')} 
         {Object.keys(values).map((element) => {return( <div key={element}>{values[element].label}</div> )})}
	      
           </div>
      );
    }

    return null;
};


class ChartIncassiMesi extends Component {
render()
	{
	let years = {};
	let legend = [];
 	for (let i=0; i<this.props.serieIncassiMesi.length; i++)
		for (let j in this.props.serieIncassiMesi[i]) 
		if (j!=='mese') 
			{
			var anno = j.substring(0, 4);
			
			if (years[anno]!=='') legend.push({ value: anno, type: 'square', id: anno, color: year2color(anno,0) });
			years[anno] = '';
			}
	return(	
	<BarChart width={600} height={300} data={this.props.serieIncassiMesi}
	            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
	       <XAxis dataKey="mese"/>
	       <YAxis/>
	       <Legend payload={legend}/>
	        <Tooltip content={<TooltipComponent/>}/>
	      
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'ytd'} dataKey={currentValue+'ytd'} stackId={index} fill={year2color(currentValue,0)} /> )})}
	       {Object.keys(years).map((currentValue, index, arr) => {return( <Bar key={currentValue+'dty'} dataKey={currentValue+'dty'} stackId={index} fill={year2color(currentValue,1)} /> )})}
	</BarChart>) 
 }
}
export default ChartIncassiMesi;