import React from 'react';
//style={{color: '#DCDCDC', position: 'relative', top: (this.props.height - 40 -130) / 2}}
const Empty = (props) =>  {
	return (
<div style={{color: '#DCDCDC', position: 'relative', top: (props.height -60) /2, left: (props.width-60) / 2 }}  >
<svg width="60" height="60">       
     <image href="/download.svg"  width="60" height="60"/>    
</svg>
<p style={{position: 'relative', top: -10, left: -10}}> Nessun dato</p>
</div>
)
}

export default Empty;