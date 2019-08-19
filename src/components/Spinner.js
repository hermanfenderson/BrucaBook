///Spinner... che funziona (?)
import React from 'react';

const Spinner = (props) =>  {
//Se però ho coors fa override di tutto...

let spinning = (props.spinning) ? true : false;	
let style = {position:'absolute', top: 0, left: 0, width: 'inherit',  height:  'inherit'}
if (spinning)
    return (
       <div className={'spinner'} style={style}>
       {props.children}
       </div> 
    )
else return (
	props.children
	)   
 }

export default Spinner;