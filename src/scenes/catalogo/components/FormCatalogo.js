import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormCatalogo extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedCatalogItem(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, this.props.scene, this.props.saveGeneral); //Per sapere cosa fare... dopo
  }
  
resetForm = () => {
	this.props.resetEditedCatalogItem(this.props.scene);
}


  render() {
  	const formValues = this.props.editedCatalogItem.values;
  	const errorMessages = this.props.editedCatalogItem.errorMessages;
  	const loading = this.props.editedCatalogItem.loading;
  	return (
     <WrappedForm layout='horizontal' readOnlyForm={false} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
          <WrappedForm.Input field='ean' label='EAN' readOnly={this.props.readOnlyEAN} />
        <WrappedForm.Input field='titolo' label='Titolo' />
        <WrappedForm.Input field='autore' label='Autore'  />
        <WrappedForm.Input field='editore' label='Editore'/>
        <WrappedForm.Input field='prezzoListino' label='Listino'/>
        {this.props.isModal ? <WrappedForm.Group></WrappedForm.Group> :
        <WrappedForm.Group formGroupLayout={{gutter:32}}>
         <WrappedForm.GeneralError  formColumnLayout={{span:14}}/>
         <WrappedForm.Button type={'button'} formColumnLayout={{span:5}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	 <WrappedForm.Button  type="primary" htmlType="submit" formColumnLayout={{span:5}}>OK</WrappedForm.Button>
        </WrappedForm.Group>
        }
       
       </WrappedForm>
       )
  }
}
export default FormCatalogo;