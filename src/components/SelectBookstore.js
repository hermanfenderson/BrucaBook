//Riceve in ingresso un albero con catene e librerie... e genera una select fatta e finita...
//Ricevo anche l'azione da scatenare...
//Devo dare anche il valore di default...
//Le props sono bookstoresList, defaultCatena, defaultLibreria, handleChange

import React from 'react';
import { Select } from 'antd';
const { Option, OptGroup } = Select;
 

class SelectBookstore extends React.Component 
{
	
optGroups = ((list)	=> {
	let phrase = [];
	for (var propt in list)
		{let phrase2 = [];
		 for (var propt2 in list[propt].librerie) phrase2.push(<Option key={propt2} value={propt+'/'+propt2}>{list[propt].librerie[propt2]}</Option>)
			phrase.push(<OptGroup key={propt} label={list[propt].nome}>
			        {phrase2}
						</OptGroup>);
			//for (var propt2 in list[propt].librerie) phrase.push(<Option value={propt+'/'+propt}>{list[propt].librerie[propt]}</Option>)
			//phrase.push(</OptGroup>)
		}
	return(phrase);	
})(this.props.bookstoresList);



defaultValue = this.props.defaultCatena+'/'+this.props.defaultLibreria;
	render()
  {	
  return (<Select
    defaultValue={this.defaultValue}
    onChange={this.props.onChange}
  >
  {this.optGroups}
  </Select>
  );
 }
}

export default SelectBookstore;
