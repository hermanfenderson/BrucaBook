//Campo autocomplete!
//RIceve una key e un valore da visualizzare (eventualmente filtrato con objSelector). Filtra per inizio parola

import React from 'react';
import { AutoComplete } from 'antd';
const { Option } = AutoComplete;
var lastValue = null;



class AutoCompleteList extends React.Component 
{
 state = {
    options: [],
    value: null,
 
  }
	
 componentDidUpdate = () => {
  var {options} = this.state;
   
 	
 if (this.props.value !== lastValue)
   		{
		lastValue = this.props.value;
	    let value = this.props.list[lastValue];
	    this.setState({
    		 options: options,
    		value: value
    	});
		}	
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
      options: options,
      value: value
       });
  }

handleSelect = (value, option) => {
 this.props.onChange(value);
 let label = option.props.children;
 this.setState({value: label, options: []})
}

//Gestione del valore nullo
onChange = (value) => {
 if (value===undefined || value.length===0) this.props.onChange('');
 /*
 
 if (false) 
	{this.props.onChange(value);
	let label = option.props.children;
	this.setState({value: label, options: []})
	}
	*/
}
  
  render()
  {
   var {options, value} = this.state;
   
    return (<AutoComplete 
     onSelect={this.handleSelect}
     onSearch={this.handleSearch}
     onChange={this.onChange}
     allowClear={true}
     value={value}
  >
  {options}
  </AutoComplete>
  );
 }
}

export default AutoCompleteList;
