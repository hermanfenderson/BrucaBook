import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
import {Container} from 'semantic-ui-react'

class FormCatalogo extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedCatalogItem(name, value)};
		
onSubmit = () => {
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, this.props.scene); //Per sapere cosa fare... dopo
  }
  
resetForm = () => {
	this.props.resetEditedCatalogItem(this.props.scene);
}
 

  render() {
  	const formValues = this.props.editedCatalogItem.values;
  	const errorMessages = this.props.editedCatalogItem.errorMessages;
  	const loading = this.props.editedCatalogItem.loading;
  	return (
  	<Container>	
      <WrappedForm readOnlyForm={false} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
          <WrappedForm.Input field='ean' label='EAN' readOnly={this.props.readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'/>
        <WrappedForm.Input field='autore' label='Autore' />
        <WrappedForm.Input field='editore' label='Editore'  />
        <WrappedForm.Input field='prezzoListino' label='Listino' />
        <WrappedForm.Button>OK</WrappedForm.Button>
        <WrappedForm.Button type={'button'} width={2} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       
       	 <WrappedForm.GeneralError rows={1} error readOnly/>	 
       </WrappedForm>
       
       </Container>
    )
  }
}
export default FormCatalogo;