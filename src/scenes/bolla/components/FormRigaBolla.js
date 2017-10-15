import React, {Component} from 'react'
import {Form} from 'semantic-ui-react'
import WrappedForm from '../../../components/WrappedForm'

class FormRigaBolla extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedRigaBolla(name, value)};
		
onSubmit = () => {
	this.props.submitEditedRigaBolla(this.props.editedRigaBolla.isValid, this.props.idBolla, this.props.editedRigaBolla.values); //Per sapere cosa fare... dopo
  }



  render() {
  	const formValues = this.props.editedRigaBolla.values;
  	const errorMessages = this.props.editedRigaBolla.errorMessages;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaBolla.loading;

  	return (
      <WrappedForm loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group >
        <WrappedForm.Input field='ean' label='EAN' width={4}/>
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
        
        <WrappedForm.Button width={4}>Submit</WrappedForm.Button>
       	 <WrappedForm.GeneralError rows={1} width={10} error readOnly value='La paranza è una danza'
       	 
			 />	 
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaBolla;