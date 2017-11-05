import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm'

class FormBolla extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedBolla(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//Qui devo fare reload della pagina verso la riga bolla...
	if (this.props.readOnlyForm) {
		this.props.history.push('/bolla/' + this.props.editedBolla.selectedItem.key);
	}
	//Elemento radice: il parametro del punto di destinazione è oggetto vuoto...
	else this.props.submitEditedBolla(this.props.editedBolla.isValid, this.props.editedBolla.selectedItem, {}, this.props.editedBolla.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedBolla();
}

componentWillMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedBolla.values;
  	const errorMessages = this.props.editedBolla.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedBolla.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
    return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.Input field='riferimento' label='Riferimento'  required={true} formColumnLayout={{span: 8}} />
        <WrappedForm.Input field='fornitore' label='Fornitore'  required={true} formColumnLayout={{span: 8}} />
        <WrappedForm.DatePicker field='dataDocumento' label='Data Documento'  format = 'DD/MM/YYYY' formColumnLayout={{span: 4}} />
        <WrappedForm.DatePicker field='dataCarico' label='Data Carico'  format = 'DD/MM/YYYY' formColumnLayout={{span: 4}} />
       </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:18}}/>
       
        <WrappedForm.Button type={'button'} formColumnLayout={{span:3}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" formColumnLayout={{span:3}}>{submitLabel}</WrappedForm.Button>
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default withRouter(FormBolla);