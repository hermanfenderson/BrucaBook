//estende input con la funzionalità di lookup in un altro componente
//Premendo la lente di ingrandimento si apre il componente richiamato con LookupComponent 
//Ad esso viene passata una function selectedCallback a cui il componente passa il valore...

import React from 'react';
import { Input,Icon} from 'antd';
//import ReactModal from 'react-modal';
import ReactModal from 'react-responsive-modal';

let textInput = null;

class InputLookup extends React.Component 
{
constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.state = {
    value: null,
    showModal: false
  }
     
    this.setTextInputRef = element => {
     
     if (element) textInput = element.input;
    };

    this.focus = () => {
      // Focus the text input using the raw DOM API
    
      if (textInput) textInput.focus();
    };
  }

  
 
	     	      
   
    selectedCallback = (value) =>
    {
    	let newState = {...this.state, value: value, showModal:false};
    	this.setState(newState);
    	this.props.onChange(value);
    }
    
    lookupElementDecorator = (lookupElement) => 
	{
		let element = React.cloneElement(lookupElement, {selectedCallback: this.selectedCallback})
    	return element;
	}
    
    onCloseModal = () => {
    		let newState = {...this.state, value: '', showModal:false};
    this.setState(newState);
    	this.props.onChange('');
    }
    
	render()
  {
 // ReactModal.setAppElement('#app');	
  //{this.LookupComponentDecorator(Modal)}	
  let {lookupElement, value, ...otherProps} = this.props;
  let inputValue = value;
    return (
    	<div>
    	 {!this.state.showModal ?	<Input ref={this.setTextInputRef} 
    	
   
    	{...otherProps} 
        
    	value={inputValue}
    	addonAfter={<Icon type="search"
      onClick={value => {if (!this.props.disabled) {let newState = {...this.state, showModal:true}; this.setState(newState); }}} />}
    	> 
    	
    
    </Input> : null}
   	 <ReactModal open={this.state.showModal} onClose={this.onCloseModal}>
    	   {this.lookupElementDecorator(this.props.lookupElement)}
    	</ReactModal>
    
    </div>	
  );
 }
}

export default InputLookup;
