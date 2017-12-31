import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm'

class FormInventario extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedBolla(name, value)};
		
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
  	const formValues = this.props.editedInventario.values;
  	const errorMessages = this.props.editedInventario.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedInventario.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
    return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group formGroupLayout={{gutter:16}}>
         <WrappedForm.DatePicker field='dataInventario' label='Data Inventario'  allowClear={false} format = 'DD/MM/YYYY' formColumnLayout={{span: 4}} disabled={(this.props.editedInventario.selectedItem!==null)} />
       <WrappedForm.Button itemStyle={{paddingTop: '30px'}} type={'button'} formColumnLayout={{span:3}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button itemStyle={{paddingTop: '30px'}} type="primary" htmlType="submit" formColumnLayout={{span:3}}>{submitLabel}</WrappedForm.Button>
     
       </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
         
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default withRouter(FormInventario);