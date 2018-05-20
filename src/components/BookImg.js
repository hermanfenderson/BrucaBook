//Questo funziona con quattro proprietà...
//eanState che mi dice se devo mostrare l'immagine
//ean che mi consente di cercare se esiste una immagine associata
//I primi due sono propt

//imgFullName che punta al path
//path2url che mi gestisce l'andata all'immagine
//Questi vengono valorizzati richiamando due action...
//Quindi i parametri sono sei in tutto...

import React from 'react';


class BookImg extends React.Component {


	render()
	{
	//let url = (this.props.ean && this.props.ean2path[this.props.ean] && this.props.path2url[this.props.ean2path[this.props.ean]]) ? this.props.path2url[this.props.ean2path[this.props.ean]] : null;
	let url = this.props.imgUrl ? this.props.imgUrl : null;
	return(
		<div className='book-img' style={this.props.style}>
		{(this.props.eanState === 'COMPLETE' && url) ? <img alt={this.props.ean} src={url} /> : (this.props.eanState === 'COMPLETE') ? <img alt="notAvailable" src="/image.png" /> : ''}
        </div>

 
		)
}

}
export default BookImg
