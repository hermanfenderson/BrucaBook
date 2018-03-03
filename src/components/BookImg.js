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
setUrl() {
if (this.props.eanState === 'COMPLETE' )
		{
	   if (!this.props.ean2path[this.props.ean]) this.props.getPathFromEAN(this.props.ean);
	   else if (!this.props.path2url[this.props.ean2path[this.props.ean]]) this.props.getUrlFromPath(this.props.ean2path[this.props.ean]);
		}	
}

componentWillMount() {
	this.setUrl();
}

componentWillUpdate() {
	this.setUrl();
}

	render()
	{
	let url = (this.props.ean && this.props.ean2path[this.props.ean] && this.props.path2url[this.props.ean2path[this.props.ean]]) ? this.props.path2url[this.props.ean2path[this.props.ean]] : null;
	return(
		<div className='book-img'>
		{(this.props.eanState === 'COMPLETE' && url) ? <img alt={this.props.ean} src={url} /> : (this.props.eanState === 'COMPLETE') ? <img alt="notAvailable" src="/image.png" /> : ''}
        </div>

 
		)
}

}
export default BookImg
