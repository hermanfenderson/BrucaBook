//Un blocco fisso nella main
//Gli devo dare una posizione top, una sinistra, una width, una height, una  style eventuale... 
import React from 'react';
import Spinner from './Spinner'

const FixBlock = (props) =>  {
let width = props.width ? props.width : 100;
let height = props.height ? props.height : 100;
let top = props.top ? props.top : 0;
let left = props.left ? props.left : 0;
//Se però ho coors fa override di tutto...
if (props.coors) 
	{
	width = props.coors.width;
	height = props.coors.height;
	top = props.coors.top;
	left = props.coors.left;
	
	}
let spinning = (props.spinning) ? true : false;	

let style = {...props.style, position:'absolute', top: top, left: left, width: width,  height: height}
    return (
     <div className={props.className} style={style}>
    <Spinner spinning={spinning}>	
    	{props.children}
    </Spinner>	
    </div>
    
    );
 }

export default FixBlock;
/*
 <React.Fragment>
     <div className={props.className} style={style}>{props.children}</div>
      { (spinning) ? <div className={'spinner'} style={style}></div> : null}
     </React.Fragment>
     */
     
//   <Spin spinning={spinning}>
//<div className={classNames({'spinner': spinning})} style={style}> </div>
      
     
      
   