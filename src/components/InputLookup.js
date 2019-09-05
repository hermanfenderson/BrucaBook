//estende input con la funzionalità di lookup in un altro componente
//Premendo la lente di ingrandimento si apre il componente richiamato con LookupComponent 
//Ad esso viene passata una function selectedCallback a cui il componente passa il valore...
//Aggiunte 2 props onCloseModal e onOpenModal per fornire info al chiamante...

import React from 'react';
import { Input,Icon, Modal} from 'antd';
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
    
    onCloseModalInner = () => {
    
    		let newState = {...this.state, value: '', showModal:false};
    this.setState(newState);
    	this.props.onChange('');
    	if (this.props.onCloseModal) this.props.onCloseModal();
    }
    
	render()
  {
 // ReactModal.setAppElement('#app');	
  //{this.LookupComponentDecorator(Modal)}	
  let {lookupElement, value, onOpenModal, onCloseModal,...otherProps} = this.props;
  let inputValue = value;
    return (
    	<div>
    	 {!this.state.showModal ?	<Input ref={this.setTextInputRef} 
    	
   
    	{...otherProps} 
        
    	value={inputValue}
    	addonAfter={<Icon type="search"
      onClick={value => {if (!this.props.disabled) {if (onOpenModal) onOpenModal(); let newState = {...this.state, showModal:true}; this.setState(newState); }}} />}
    	> 
    	
    
    </Input> : null}
   	 <Modal   style={{top: 44}} width={this.props.width} footer={null} visible={this.state.showModal} onCancel={this.onCloseModalInner}>
    	   {this.lookupElementDecorator(this.props.lookupElement)}
    	</Modal>
    
    </div>	
  );
 }
}

export default InputLookup;
/*
<ReactModal open={this.state.showModal} onClose={this.onCloseModalInner}>
    	   {this.lookupElementDecorator(this.props.lookupElement)}
    	</ReactModal>
 */   