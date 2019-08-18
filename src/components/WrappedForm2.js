/*
Descrizione da riscrivere ma in generale funziona così...
gli devo passare coord generate usando un helper... 
la form deve essere 25 px più stretta in larghezza dello spazio che la contiene in modo da lasciare spazio per un padding a sx di 5 px e uno a destra di 5px e altrettanto spazio fuori che ottengo facendola 10px più piccola e 10px meno alta... quindi chiedo 25 in meno all'helper..
Ogni riga occupa 60px
*/

import React, {Component} from 'react'
import {Form,  Button, Input, Checkbox, DatePicker, TimePicker, InputNumber, Spin} from 'antd';
import SelectBookstore from './SelectBookstore'; 
import SelectList from './SelectList';
import AutoCompleteList from './AutoCompleteList';
import ImageUploaderWrapper from './ImageUploaderWrapper';
import InputLookup from './InputLookup';
import FixBlock from './FixBlock';

import moment from 'moment';
import 'moment/locale/it';



moment.locale("it");


const FormItem = Form.Item; //Per semplicità


//Gestisco pmChange separatamente per consentire l'over-ride della funzione onChange...
const renderChildren = (props) => {
let children = React.Children.map(props.children, child => {
	    	   let childProps = child.props;
	    	   let top = childProps.coord.top;
	    	 return <FixBlock width={childProps.coord.width} top={top} left={childProps.coord.left} height={childProps.coord.height}  >
	                {React.cloneElement(child, {disableAllColon: props.disableAllColon, onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues, setFocus: props.setFocus})}
			        </FixBlock> })
   return(children);
}

const GeneralError = (props) => {
		const { errorMessages, setFocus, ...otherProps } = props;
		if (errorMessages['form']) return <div className={'generalError'} {...otherProps}> {errorMessages['form']} </div>
		else return null
		}


const FormButton =  (props) => 
				{ 
				   const {disableAllColon, formValues, field, readOnly, errorMessages, readOnlyForm, onChangeAction, buttonItemLayout, formColumnLayout, setFocus,...otherProps} = props;
                   return <div style={{position: 'absolute', bottom: 0, paddingBottom: 8}} > <Button  style={{width: props.coord.width}} {...otherProps} /> </div>
				}
				
const WrapGeneric = (props) =>
				{ 
					const {disableAllColon, formValues, field, readOnly, errorMessages, readOnlyForm, onChange, formItemLayout, formColumnLayout, setFocus,  ...otherProps} = props;
					return(React.cloneElement(props.children, {...otherProps}));
				}
					
             	
  const InputDecorator = (InputComponent) => {return (props) => {
  	     const {disableAllColon, disableColon, formValues, field, readOnly, errorMessages, readOnlyForm, onChange, formItemLayout, formColumnLayout, setFocus, lookupElement, disabled, ...otherProps} = props;
	    const onChangeInput=(input) => {
	    	//const value = input.target ? (('checked' in input.target) ? input.target.checked : input.target.value) : input;
	    	const value = (input !==null) ? (input.target ? (input.target.type ==='checkbox' ? input.target.checked : input.target.value) : input) : null;
	    	
	    	onChange(field,value)
	    };
	    //Sporchissima!
	    let inputProps = 
				{value: props.formValues[field],
					 onChange: onChangeInput, 
        	       ref: input => { input && setFocus && setFocus(input,props.field)},
        	       disabled: (props.readOnlyForm || props.readOnly || props.disabled),
				};
		inputProps = {...inputProps, ...otherProps};
		
	    if (InputComponent === InputLookup) inputProps.lookupElement = lookupElement;
	    if (InputComponent === Checkbox) inputProps.checked = inputProps.value;
	    return (
         <FormItem {...formItemLayout}
                style={{position: 'relative', height: props.coord.height, width: props.coord.width}}
              	width={props.coord.width} 
        		required={props.required}
        		validateStatus={(typeof props.errorMessages[props.field] !== 'undefined') ? 'error' : ''}
        		help={props.errorMessages[props.field]}
        		label={props.label}
        		colon={disableAllColon ? false : disableColon ? false : true }
        	>
        	<InputComponent {...inputProps} style={{width: props.coord.width}}
        	       />
         </FormItem>)
         
         }
  }





class WrappedForm extends Component {
    static Input = InputDecorator(Input);
    static InputNumber = InputDecorator(InputNumber);
    static Checkbox = InputDecorator(Checkbox);
    static DatePicker = InputDecorator(DatePicker);
    static TimePicker = InputDecorator(TimePicker);
    static SelectBookstore = InputDecorator(SelectBookstore);
    static SelectList = InputDecorator(SelectList);
      static AutoCompleteList = InputDecorator(AutoCompleteList);
     static ImageUploader = InputDecorator(ImageUploaderWrapper);
     static InputLookup = InputDecorator(InputLookup);
 
    static Button = FormButton;
    static GeneralError = GeneralError;
    static WrapGeneric = WrapGeneric;
    
    setFocus = (input, field) => {
    
    	if (this.props.willFocus === field)
    		{   setTimeout(() => {
    			if ((input.input) || !(input.hasOwnProperty('input'))) input.focus(); //Su suggerimento antd #8846
    				}, 0);
    			
    			this.props.focusSet();
    		}
    	
    }

 
  
	render ()
	{  
   	return 	<Spin spinning={this.props.loading} style={{height: this.props.height, width: this.props.width, minHeight: this.props.height, minWidth: this.props.width}}>
   	         
   			<div style={{height: this.props.height, width: this.props.width, minHeight: this.props.height, minWidth: this.props.width}}>
   	         <Form className={this.props.formClass}
    			layout={this.props.layout}  
    			hideRequiredMark={this.props.hideRequiredMark}
    			onSubmit={this.props.onSubmit}>
    			{renderChildren({...this.props, setFocus: this.setFocus})}
    		</Form>
    	    </div>	
    		
    	</Spin>	
    
	}
	
}




export default WrappedForm;


