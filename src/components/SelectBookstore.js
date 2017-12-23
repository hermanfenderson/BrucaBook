//Riceve in ingresso un albero con catene e librerie... e genera una select fatta e finita...
//Ricevo anche l'azione da scatenare...
//Devo dare anche il valore di default...
//Le props sono bookstoresList, defaultCatena, defaultLibreria, handleChange

import React from 'react';
import { Select } from 'antd';
const { Option, OptGroup } = Select;
 /*
 <OptGroup label="Manager">
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
    </OptGroup>
    <OptGroup label="Engineer">
      <Option value="Yiminghe">yiminghe</Option>
    </OptGroup>
*/

const SelectBookstore = (props) =>
{
	
let optGroups = ((list)	=> {
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
})(props.bookstoresList);



let defaultValue = props.defaultCatena+'/'+props.defaultLibreria;
	return(
  <Select
    defaultValue={defaultValue}
    style={{ width: 200 }}
    onChange={props.handleChange}
  >
  {optGroups}
  </Select>
  
		)
}

export default SelectBookstore;
