import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm'

class FormBolla extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedBolla(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//Qui devo fare reload della pagina verso la riga bolla...
	if (this.props.readOnlyForm) {
		
		this.props.gotoBolla();
	}
	//Elemento radice: il parametro del punto di destinazione è oggetto vuoto...
	else this.props.submitEditedBolla(this.props.editedBolla.isValid, this.props.editedBolla.selectedItem, {}, this.props.editedBolla.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedBolla();
}



  render() {
  	const formValues = this.props.editedBolla.values;
  	const errorMessages = this.props.editedBolla.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedBolla.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
  	const destination = selectedItem ? '/bolla/' + selectedItem.key : '';
    return (
    
     this.props.willGotoBolla ? <Redirect to={destination} /> : 	 
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group >
        <WrappedForm.Input field='riferimento' label='Riferimento'  required={true} width={8} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.Input field='fornitore' label='Fornitore'  required={true} width={8} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.DatePicker field='dataDocumento' label='Data Documento'  format = 'DD/MM/YYYY' width={4} />
        <WrappedForm.DatePicker field='dataCarico' label='Data Carico'  format = 'DD/MM/YYYY' width={4} />
       </WrappedForm.Group>
        
     
       <WrappedForm.Group >
        <WrappedForm.Button buttonItemLayout={{wrapperCol: { span: 4, offset: 20 }}} htmlType="button"  width={21} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button type="primary" width={3} htmlType="submit" >{submitLabel}</WrappedForm.Button>
        
       	 <WrappedForm.GeneralError rows={1} width={8} error readOnly/>	 
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormBolla;