import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm2'

class FormInventario extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedInventario(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//Qui devo fare reload della pagina verso la riga bolla...
	if (this.props.readOnlyForm) {
		this.props.history.push('/inventario/' + this.props.editedInventario.selectedItem.key);
	}
	//Elemento radice: il parametro del punto di destinazione è oggetto vuoto...
	
	else this.props.submitEditedInventario(this.props.editedInventario.isValid, this.props.editedInventario.selectedItem, null, this.props.editedInventario.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedInventario();
}

componentWillMount = () => 
{
	this.resetForm();
}

  render() {
  	const  formCols1 = this.props.geometry.formCols;
  	const  generalError = this.props.geometry.generalError;
  
  
  	const formValues = this.props.editedInventario.values;
  	const errorMessages = this.props.editedInventario.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedInventario.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
    return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.DatePicker field='dataInventario' label='Data Inventario'  allowClear={false} format = 'DD/MM/YYYY' coord={formCols1.dataInventario} disabled={(this.props.editedInventario.selectedItem!==null)} />
         <WrappedForm.Input field='note' label='Note'   coord={formCols1.note} />
     
       <WrappedForm.Button  type={'button'} coord={formCols1.annulla} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button type="primary" htmlType="submit" coord={formCols1.crea}>{submitLabel}</WrappedForm.Button>
     
        <WrappedForm.GeneralError  coord={generalError}/>
       
         

       </WrappedForm>
    )
  }
}
export default withRouter(FormInventario);