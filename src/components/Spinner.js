///Spinner... che funziona (?)
import React from 'react';

const Spinner = (props) =>  {
//Se però ho coors fa override di tutto...

let spinning = (props.spinning) ? true : false;	
let width = (props.width) ? props.width : 'inherit';
let height = (props.height) ? props.height : 'inherit';

let style = {position:'absolute', top: 0, left: 0, width: width,  height:  height}
if (spinning)
    return (
       <div className={'spinner'} style={style}>
       {props.children}
       </div> 
    )
else return (
	(props.children) ? props.children : null
	)   
 }

export default Spinner;