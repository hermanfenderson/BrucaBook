import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormCatalogo extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedCatalogItem(name, value)};
		
onSubmit = () => {
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values); //Per sapere cosa fare... dopo
  }

  render() {
  	const formValues = this.props.editedCatalogItem.values;
  	const errorMessages = this.props.editedCatalogItem.errorMessages;
  	const loading = this.props.editedCatalogItem.loading;
  	const formInitialValues = this.props.formInitialValues;
  	return (
      <WrappedForm loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
          <WrappedForm.Input field='ean' label='EAN'/>
        <WrappedForm.Input field='titolo' label='Titolo'/>
        <WrappedForm.Input field='autore' label='Autore' />
        <WrappedForm.Input field='editore' label='Editore'  />
        <WrappedForm.Input field='prezzoListino' label='Listino' />
     
        <WrappedForm.Button>Submit</WrappedForm.Button>
       	 <WrappedForm.GeneralError rows={1} error readOnly/>	 
       </WrappedForm>
    )
  }
}
export default FormCatalogo;