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
formColumnLayout nel caso di definzione di formGroup consente di formattare la colonna che contiene l'elemento.
formItemLayout per definire il layout del singolo item (che a seconda se verticale o orizzontale è fatto di una o due colonne)
buttonItemLayout idem per il bottone

Ogni elemento ha la sua ref. In questo modo posso fare cose sul DOM.
Primo superpotere... posso mettere a fuoco un campo... con la prop willFocus
e la action focusSet che la resetta.
*/

import React, {Component} from 'react'
import {Form, Alert, Button, Input, Checkbox, DatePicker, TimePicker, InputNumber, Row,Col, Spin} from 'antd';
import moment from 'moment';
import 'moment/locale/it';



moment.locale("it");


const FormItem = Form.Item; //Per semplicità


//Gestisco pmChange separatamente per consentire l'over-ride della funzione onChange...
const renderChildren = (props, hasColumns) => {
let children = React.Children.map(props.children, child => {
	    if (hasColumns)
	         return <Col {...child.props.formColumnLayout} >
	                {React.cloneElement(child, {onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues, setFocus: props.setFocus})}
			        </Col>
	    else return React.cloneElement(child, {onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues, setFocus: props.setFocus})
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
				   const {itemStyle, formValues, field, readOnly, errorMessages, readOnlyForm, onChangeAction, buttonItemLayout, formColumnLayout, setFocus,...otherProps} = props;
                   return <FormItem style={itemStyle}  {...buttonItemLayout}> <Button  {...otherProps} /> </FormItem>
				}
				
const WrapGeneric = (props) =>
				{ 
					const {formValues, field, readOnly, errorMessages, readOnlyForm, onChange, formItemLayout, formColumnLayout, setFocus, ...otherProps} = props;
					return(React.cloneElement(props.children, {...otherProps}));
				}
					
             	
  const InputDecorator = (InputComponent) => {return (props) => {
  	     const {itemStyle, formValues, field, readOnly, errorMessages, readOnlyForm, onChange, formItemLayout, formColumnLayout, setFocus, ...otherProps} = props;
	    const onChangeInput=(input) => {
	    	//const value = input.target ? (('checked' in input.target) ? input.target.checked : input.target.value) : input;
	    	const value = input.target ? (input.target.type ==='checkbox' ? input.target.checked : input.target.value) : input;
	    	
	    	onChange(field,value)
	    };
	      return(
         <FormItem {...formItemLayout}
              	width={props.width} 
        		required={props.required}
        		validateStatus={!(typeof props.errorMessages[props.field] === 'undefined') ? 'error' : ''}
        		help={props.errorMessages[props.field]}
        		label={props.label}
        		style={itemStyle}>
        	<InputComponent value={props.formValues[field]} 
        	       onChange={onChangeInput} 
        	       disabled={props.readOnlyForm || props.readOnly}
        	       ref={input => { input && setFocus && setFocus(input,props.field)}}
        	       {...otherProps}
        	       />
         </FormItem>)
         }
  }

//formGroupLayout ha le props di row
const FormGroup = (props) => {
  const hasColumns = true;
    const {formGroupLayout, ...otherProps} = props
    return  <Row {...formGroupLayout}>{renderChildren(otherProps, hasColumns)}</Row>
}




class WrappedForm extends Component {
    static Group = FormGroup;
 
    static Input = InputDecorator(Input);
    static InputNumber = InputDecorator(InputNumber);
    static Checkbox = InputDecorator(Checkbox);
    static DatePicker = InputDecorator(DatePicker);
    static TimePicker = InputDecorator(TimePicker);
    static Button = FormButton;
    static GeneralError = GeneralError;
    static WrapGeneric = WrapGeneric;
    
    setFocus = (input, field) => {
    
    	if (this.props.willFocus === field)
    		{   
    			input.focus();
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


