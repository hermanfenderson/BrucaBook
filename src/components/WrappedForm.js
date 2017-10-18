/*
Qui metto la famiglia di componenti per i form che saranno ospitati nelle varie scenes (e forse non solo)
Passo alla form nel suo complesso:

- formValues (un oggetto a coppie campo, valore) (viene dallo stato)
- errorMessages (oggetto a coppie campo, valore con un testo di errore da visualizzare più un campo 'form' con gli errori generici)
- loading (se la form sta caricando dati)
- isValid (se la form è valida)
- docContesto (per una bolla è l'id della bolla, per lo scontrino sarà un oggetto documento e scontrino e così via)
- funzione da chiamare al cambiamento di un campo (due parametri: campo e valore)
- funzione da chiamare alla submit di un form (tre parametri: )

Propago formValues e errorMessages al formGroup. 

Passo a ogni singolo componente...
*/

import React, {Component} from 'react'
import {Form, Label, Input} from 'semantic-ui-react'
//Gestoscp pmChange separatamente per consentire l'over-ride della funzione onChange...
const renderChildren = (props, onChange) => {
let children = React.Children.map(props.children, child => {
	    return React.cloneElement(child, {errorMessages: props.errorMessages, formValues: props.formValues, onChange: onChange})
				}); 
   return(children);
}

const GeneralError = (props) => {const { errorMessages, width } = props;
    if (errorMessages['form']) return <Form.TextArea rows={1} width={width} error readOnly value={errorMessages['form']}/>
    else return null }
    
const FormButton =  (props) => { var newProps = {...props}; delete newProps['formValues']; delete newProps['errorMessages']; return <Form.Button {...newProps} /> }
       	
const ErrorLabel = (props) => {const {text} = props;
	if (text) {return (<Label basic color='red' pointing>{props.text}</Label>)}
	else {return(<div></div>)}
}

const InformedInput = (props) => {
	     const onChange=(e) => {props.onChange(e,props.field)};        
         return(
         <Form.Field width={props.width} error={!(typeof props.errorMessages[props.field] === 'undefined')}>
        	<label> {props.label} </label>
        	<Input value={props.formValues[props.field]} placeholder={props.label} onChange={onChange} disabled={props.disabled} readOnly={props.readOnly} />
        	<ErrorLabel  text={props.errorMessages[props.field]}/>
         </Form.Field>)
         } 
         
const Checkbox = (props) => {
	     const onChange=(e,data) => props.onChange(e,props.field,data);        
         return(<Form.Checkbox width={props.width} label={props.label} checked={props.formValues[props.field]} onChange={onChange}/>)
         }           
          
const FormGroup = (props) => {
    return  <Form.Group>{renderChildren(props, props.onChange)}</Form.Group>
}



class WrappedForm extends Component {
    static Group = FormGroup;
    static ErrorLabel = ErrorLabel;
    static Checkbox = Checkbox;
    static Input = InformedInput;
    static Button = FormButton;
    static GeneralError = GeneralError;
    //Per distinguere la chekbox...
    onChange = (event,name, data=undefined) => {
	    const target = event.target; 
	    const value = data ? data.checked : target.value; 
	    this.props.onChange(name,value);
    	}
    render()
    	{return  <Form onSubmit={this.props.onSubmit}> {renderChildren(this.props, this.onChange)}</Form>}
}



export default WrappedForm;

