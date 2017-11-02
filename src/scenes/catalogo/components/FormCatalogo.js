import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

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
  	const formItemLayout = {labelCol: {span : 3}, wrapperCol: { span: 21 }};
  	return (
     <WrappedForm layout='horizontal' readOnlyForm={false} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
          <WrappedForm.Input field='ean' label='EAN' readOnly={this.props.readOnlyEAN} formItemLayout={formItemLayout}/>
        <WrappedForm.Input field='titolo' label='Titolo' formItemLayout={formItemLayout}/>
        <WrappedForm.Input field='autore' label='Autore' formItemLayout={formItemLayout} />
        <WrappedForm.Input field='editore' label='Editore' formItemLayout={formItemLayout} />
        <WrappedForm.Input field='prezzoListino' label='Listino' formItemLayout={formItemLayout}/>
        <WrappedForm.Button>OK</WrappedForm.Button>
        <WrappedForm.Button type={'button'} width={2} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       
       	 <WrappedForm.GeneralError rows={1} error readOnly/>	 
       </WrappedForm>
       
       )
  }
}
export default FormCatalogo;