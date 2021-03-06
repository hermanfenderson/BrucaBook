/*
Qui metto la famiglia di componenti per i form che saranno ospitati nelle varie scenes (e forse non solo)
Passo alla form nel suo complesso:

- formValues (un oggetto a coppie campo, valore) (viene dallo stato)
- errorMessages (oggetto a coppie campo, valore con un testo di errore da visualizzare più un campo 'form' con gli errori generici)
- loading (se la form sta caricando dati)
- readOnlyForm (se voglio che tutta la form sia readonly)
- funzione da chiamare al cambiamento di un campo (due parametri: campo e valore)
- funzione da chiamare alla submit di un form

. e tutte le altre props...

Propago formValues,errorMessages al formGroup. 

Formattazione
WrappedForm mappa uno a uno le caratteristiche di Form di antd.
Se uso un elemento WrappedForm.Group viene inseria una row (con eventuale gutter...) e tante col per quante servono...

La formattazione dell'elemento è a carico del chiamante. Utilizzando tre insiemi di oggetti
formColumnLayout nel caso di definzione di formGroup consente di formattare la colonna che contiene l'elemento..
Variante! Se passo una prop width all'elemento... non viene più creata una col ma una FixCol e formColumnLayout viene overridato...
formItemLayout per definire il layout del singolo item (che a seconda se verticale o orizzontale è fatto di una o due colonne)
buttonItemLayout idem per il bottone 
Questi ultimi due props li posso arricchire con style= e con wrappedCol ecc... Secondo quanto specificato da antd per il formItem

Infine posso agire direttamente sul componente dentro formItem. Ma devo capire bene come usare itemStyle

Ogni elemento ha la sua ref. In questo modo posso fare cose sul DOM.
Primo superpotere... posso mettere a fuoco un campo... con la prop willFocus
e la action focusSet che la resetta.
*/

import React, {Component} from 'react'
import {Form, Alert, Button, Input, Checkbox, DatePicker, TimePicker, InputNumber, Row,Col, Spin} from 'antd';
import SelectBookstore from './SelectBookstore'; 
import SelectList from './SelectList';
import AutoCompleteList from './AutoCompleteList';
import ImageUploaderWrapper from './ImageUploaderWrapper';
import InputLookup from './InputLookup';
import FixCol from './FixCol';

import moment from 'moment';
import 'moment/locale/it';



moment.locale("it");


const FormItem = Form.Item; //Per semplicità


//Gestisco pmChange separatamente per consentire l'over-ride della funzione onChange...
const renderChildren = (props, hasColumns) => {
let children = React.Children.map(props.children, child => {
	    if(child) 
	      if (hasColumns)
	    	 {
	    	 if (child.props.formColumnLayout && child.props.formColumnLayout.width)
	    	 {
	    	 	let width=(props.formGroupLayout.gutter) ? props.formGroupLayout.gutter + child.props.formColumnLayout.width : child.props.formColumnLayout.width;
	    	    let style = (props.formGroupLayout.gutter) ? {verticalAlign: 'bottom', paddingLeft: props.formGroupLayout.gutter/2, paddingRight: props.formGroupLayout.gutter/2} :{verticalAlign: 'bottom'};
	    	 return <FixCol style={style} width={width}  >
	                {React.cloneElement(child, {disableAllColon: props.disableAllColon, onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues, setFocus: props.setFocus})}
			        </FixCol>
	    	 }       
	    	 else
	         return <Col {...child.props.formColumnLayout} style={{verticalAlign: 'bottom'}} >
	                {React.cloneElement(child, {disableAllColon: props.disableAllColon, onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues, setFocus: props.setFocus})}
			        </Col>
	    	 }       
	      else return React.cloneElement(child, {disableAllColon: props.disableAllColon, onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues, setFocus: props.setFocus})
				}); 
   return(children);
}

const GeneralError = (props) => {
		const { errorMessages, setFocus, ...otherProps } = props;
		if (errorMessages['form']) return <Alert {...otherProps} message={errorMessages['form']} type='error'/>
		else return null
		}


const FormButton =  (props) => 
				{ 
				   const {disableAllColon, formValues, field, readOnly, errorMessages, readOnlyForm, onChangeAction, buttonItemLayout, formColumnLayout, setFocus,...otherProps} = props;
                   return <FormItem  {...{style:{verticalAlign: 'bottom'},...buttonItemLayout}}> <Button  style={{width: '100%'}} {...otherProps} /> </FormItem>
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
              	width={props.width} 
        		required={props.required}
        		validateStatus={(typeof props.errorMessages[props.field] !== 'undefined') ? 'error' : ''}
        		help={props.errorMessages[props.field]}
        		label={props.label}
        		colon={disableAllColon ? false : disableColon ? false : true }
        	>
        	<InputComponent {...inputProps}
        	       />
         </FormItem>)
         
         }
  }

//formGroupLayout ha le props di row
const FormGroup = (props) => {
  const hasColumns = true;
    const {formGroupLayout} = props
    return  <Row {...formGroupLayout}>{renderChildren(props, hasColumns)}</Row>
}




class WrappedForm extends Component {
    static Group = FormGroup;
 
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
   	return <Spin spinning={this.props.loading}>
   	        	
    
    		<Form className={this.props.formClass}
    			layout={this.props.layout}  
    			hideRequiredMark={this.props.hideRequiredMark}
    			onSubmit={this.props.onSubmit}>
    			{renderChildren({...this.props, setFocus: this.setFocus}, null)}
    		</Form>
    	</Spin>	
	}
	
}




export default WrappedForm;


