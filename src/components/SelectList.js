//Riceve in ingresso un albero con catene e librerie... e genera una select fatta e finita...
//Ricevo anche l'azione da scatenare...
//Devo dare anche il valore di default...
//Le props sono bookstoresList, defaultCatena, defaultLibreria, handleChange

import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
 

class SelectList extends React.Component 
{
	



defaultValue = this.props.defaultValue
	render()
  {	
  let options = ((list)	=> {
	let phrase2 = [];
	let key = 0;
    for (var propt2 in list) phrase2.push(<Option key={key++} value={propt2}>{list[propt2]}</Option>)
	return(phrase2);	
})(this.props.list);
	
  const {onChange, value, ...otherProps } = this.props;
  return (<Select
  
    defaultValue={this.defaultValue}
    onChange={onChange}
    value={value}
    {...otherProps}
  >
  {options}
  </Select>
  );
 }
}

export default SelectList;
