///Spinner... che funziona (?)
import React from 'react';
import classNames from 'classnames';

const Spinner = (props) =>  {
//Se però ho coors fa override di tutto...

let spinning = (props.spinning) ? true : false;	
let width = (props.width) ? props.width : 'inherit';
let height = (props.height) ? props.height : 'inherit';

let style = {position:'relative', top: 0, left: 0, width: width,  height:  height}
    return (
       <div className={classNames({'spinner': spinning})} style={style}>
       {(props.children) ? props.children : null}
       </div> 
    )
 }

export default Spinner;