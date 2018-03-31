//Tabella libri più venduti

import React from 'react';
import WrappedTable from '../../../components/WrappedTable';
const TopBooks = (props) => 
{
	const topBooks = props.topBooks;
/*
	const header = [{dataField: 'rank', label: '#', width: '30px'},
                {dataField: 'titolo', label: 'Titolo', width: '220px'},
			    {dataField: 'autore', label: 'Autore', width: '180px'},
			    {dataField: 'editore', label: 'Editore', width: '150px'},
			    {dataField: 'totalePezzi', label: 'N.', width: '60px'},
			    
			   ];
			   */
	const header = [{dataField: 'rank', label: '#'},
                {dataField: 'titolo', label: 'Titolo'},
			    {dataField: 'autore', label: 'Autore'},
			    {dataField: 'editore', label: 'Editore'},
			    {dataField: 'totalePezzi', label: 'N.'},
			    
			   ]; 		   
	return(
			<WrappedTable className={'tabella-top-books'} rowClassName={'tabella-top-books-row'} size={'small'} data={topBooks} header={header} rowKey = 'key'/>
		
		)
}

export default TopBooks;


