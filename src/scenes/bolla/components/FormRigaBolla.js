import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormRigaBolla extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedRigaBolla(name, value)};
		
onSubmit = () => {
	this.props.submitEditedRigaBolla(this.props.editedRigaBolla.isValid, this.props.idBolla, this.props.editedRigaBolla.values, this.props.editedRigaBolla.selectedItem); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaBolla();
}



  render() {
  	const formValues = this.props.editedRigaBolla.values;
  	const errorMessages = this.props.editedRigaBolla.errorMessages;
  	const formInitialValues = this.props.formInitialValues;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaBolla.loading;
  	const readOnlyEAN = (this.props.editedRigaBolla.selectedRigaBolla !== null)
  	
  	return (
      <WrappedForm loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} formInitialValues={formInitialValues}>
         <WrappedForm.Group >
        <WrappedForm.Input field='ean' label='EAN' type='submit' width={4} readOnly={this.readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  width={6} readOnly/>
        <WrappedForm.Input field='autore' label='Autore'  width={4} readOnly/>
        <WrappedForm.Input field='prezzoListino' label='Listino'  width={2} readOnly/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group >
        <WrappedForm.Input field='sconto1' label='Sc.1' disabled={prezzoMan} width={2}/>
        <WrappedForm.Input field='sconto2' label='Sc.2' disabled={prezzoMan} width={2}/>
        <WrappedForm.Input field='sconto3' label='Sc.3' disabled={prezzoMan} width={2}/>
        <WrappedForm.Input field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' width={3}/>
        <WrappedForm.Input field='pezzi' label='Quantità' width={2}/>
        <WrappedForm.Input field='gratis' label='Gratis' width={2}/>
        <WrappedForm.Input field='prezzoTotale' label='Totale' readOnly width={3}/>
    
      </WrappedForm.Group>
       <WrappedForm.Group >
        <WrappedForm.Checkbox width={2} field='manSconto' label='Man.'/>
        
        <WrappedForm.Button className={'hidden'}>Submit</WrappedForm.Button>
        
        <WrappedForm.Button primary disabled={!this.props.editedRigaBolla.isValid} width={4}>Aggiungi</WrappedForm.Button>
        <WrappedForm.Button type={'button'} width={4} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
       	 <WrappedForm.GeneralError rows={1} width={6} error readOnly
       	 
			 />	 
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaBolla;