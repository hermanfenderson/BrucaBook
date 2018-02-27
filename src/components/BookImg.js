//Questo funziona con quattro proprietà...
//eanState che mi dice se devo mostrare l'immagine
//ean che mi consente di cercare se esiste una immagine associata
//I primi due sono propt

//imgFullName che punta al path
//path2url che mi gestisce l'andata all'immagine
//Questi vengono valorizzati richiamando due action...
//Quindi i parametri sono sei in tutto...

import React from 'react';
import { Card } from 'antd';

const BookImg = (props) =>
{  let url = null;
   if (props.eanState === 'COMPLETE' )
		{
	   if (!props.ean2path[props.ean]) props.getPathFromEAN(props.ean);
	   else if (!props.path2url[props.ean2path[props.ean]]) props.getUrlFromPath(props.ean2path[props.ean]);
	   else url = props.path2url[props.ean2path[props.ean]];
		}
	return(
  <Card className='book-img'
    hoverable
    cover={(props.eanState === 'COMPLETE' && url)? <img alt="notAvailable" src={url} /> : (props.eanState === 'COMPLETE') ? <img alt="notAvailable" src="/image.png" /> : ''}
  >
   
  </Card>
		)
}

export default BookImg
