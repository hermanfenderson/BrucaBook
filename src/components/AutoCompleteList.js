//Campo autocomplete!
//RIceve una key e un valore da visualizzare (eventualmente filtrato con objSelector). Filtra per inizio parola

import React from 'react';
import { Select, AutoComplete } from 'antd';
const { Option } = Select;
 

class AutoCompleteList extends React.Component 
{
 state = {
    options: [],
  }
	

 handleSearch = (value) => {
 	let options = ((list)	=> {
	let phrase2 = [];
	let key = 0;
	let regex = new RegExp("^"+value,'i'); //Stringhe che iniziano per... value case insensitive
    for (var propt2 in list) if (value.length > 0 && list[propt2].match(regex)) phrase2.push(<Option key={key++} value={propt2}>{list[propt2]}</Option>)
	return(phrase2);	
})(this.props.list);

    this.setState({
      options: options
       });
  }


  
  render()
  {	
  const {options} = this.state;	
  return (<AutoComplete
     onSelect={this.props.onChange}
     onSearch={this.handleSearch}
  >
  {options}
  </AutoComplete>
  );
 }
}

export default AutoCompleteList;
