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

Passo a ogni singolo componente...
*/

import React, {Component} from 'react'
import {Form, Alert, Button, Input, Checkbox, DatePicker, Row,Col, Spin} from 'antd';
import moment from 'moment';
import 'moment/locale/it';


moment.locale("it");



const FormItem = Form.Item; //Per semplicità


//Gestisco pmChange separatamente per consentire l'over-ride della funzione onChange...
const renderChildren = (props, hasColumns) => {
let children = React.Children.map(props.children, child => {
	    if (hasColumns)
	         return <Col span={child.props.width} >
	                {React.cloneElement(child, {onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues})}
			        </Col>
	    else return React.cloneElement(child, {onChange: props.onChange, errorMessages: props.errorMessages, readOnlyForm: props.readOnlyForm, formValues: props.formValues})
				}); 
   return(children);
}

const GeneralError = (props) => {
		const { errorMessages, ...otherProps } = props;
		if (errorMessages['form']) return <Alert {...otherProps} message={errorMessages['form']} type='error'/>
		else return null
		}


const FormButton =  (props) => 
				{ 
				   const {formValues, field, readOnly, errorMessages, readOnlyForm, onChangeAction, buttonItemLayout,...otherProps} = props;
                   return <FormItem {...buttonItemLayout}> <Button  {...otherProps} /> </FormItem>
				}
             	
  const InputDecorator = (InputComponent) => {return (props) => {
  	     const {formValues, field, readOnly, errorMessages, readOnlyForm, onChange, formItemLayout, ...otherProps} = props;
	    const onChangeInput=(input) => {
	    	const value = input.target ? input.target.value : input;
	    	onChange(field,value)
	    	
	    };
	     
	     return(
         <FormItem {...formItemLayout}
              	width={props.width} 
        		required={props.required}
        		validateStatus={!(typeof props.errorMessages[props.field] === 'undefined') ? 'error' : ''}
        		help={props.errorMessages[props.field]}
        		label={props.label}>
        	<InputComponent value={props.formValues[field]} 
        	       onChange={onChangeInput} 
        	       readOnly={props.readOnlyForm || props.readOnly}
        	       {...otherProps}
        	       />
         </FormItem>)
         }
  }


const FormGroup = (props) => {
  const hasColumns = true;
    return  <Row>{renderChildren(props, hasColumns)}</Row>
}




class WrappedForm extends Component {
 static Group = FormGroup;
 
    static Input = InputDecorator(Input);
    static Checkbox = InputDecorator(Checkbox);
    static DatePicker = InputDecorator(DatePicker);
    static Button = FormButton;
    static GeneralError = GeneralError;
    
 
  
	render ()
	{   
	return <Spin spinning={this.props.loading}>
    		<Form 
    			layout={this.props.layout}  
    			hideRequiredMark={this.props.hideRequiredMark}
    			onSubmit={this.props.onSubmit}>
    			{renderChildren(this.props, null)}
    		</Form>
    	</Spin>	
	}
	
}




export default WrappedForm;


