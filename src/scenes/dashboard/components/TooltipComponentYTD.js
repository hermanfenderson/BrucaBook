import React from 'react'
import moment from 'moment'

//Componente capace di gestire 

const TooltipComponentYTD = (props) =>
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
        {(props.span === 'month')?moment(label,'MM').format('MMMM'): (props.span === 'year')? null : label} 
         {Object.keys(values).map((element) => {return( <div key={element}>{values[element].label}</div> )})}
	      
           </div>
      );
    }

    return null;
};

export default TooltipComponentYTD


