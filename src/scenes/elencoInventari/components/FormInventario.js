import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm'

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
  	const  formCols1 = this.props.geometry.formCols1;
  
  	const formValues = this.props.editedInventario.values;
  	const errorMessages = this.props.editedInventario.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedInventario.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
    return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group formGroupLayout={{gutter: formCols1.gutter}}>
         <WrappedForm.DatePicker field='dataInventario' label='Data Inventario'  allowClear={false} format = 'DD/MM/YYYY' formColumnLayout={{width:formCols1.dataInventario}} disabled={(this.props.editedInventario.selectedItem!==null)} />
         <WrappedForm.Input field='note' label='Note'   formColumnLayout={{width:formCols1.note}} />
     
       <WrappedForm.Button  type={'button'} formColumnLayout={{width:formCols1.annulla}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button type="primary" htmlType="submit" formColumnLayout={{width:formCols1.crea}}>{submitLabel}</WrappedForm.Button>
     
       </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
         
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default withRouter(FormInventario);