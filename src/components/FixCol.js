import React from 'react';

const FixCol = (props) =>  {
let width = props.width ? props.width : 'auto';
    return (
     <div style={{display: 'table-cell', width:width}}>
      {props.children}
     </div>
    );
 }

export default FixCol;

