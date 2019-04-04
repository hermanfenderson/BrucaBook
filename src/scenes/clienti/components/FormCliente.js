import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormCliente extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedCliente(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	this.props.submitEditedCliente(this.props.editedCliente.isValid, this.props.editedCliente.selectedItem, null, this.props.editedCliente.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedCliente();
}

componentDidMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedCliente.values;
  	const errorMessages = this.props.editedCliente.errorMessages;
  	const selectedItem = this.props.editedCliente.selectedItem;
  	const submitLabel =  selectedItem ? 'Modifica' : 'Crea';
  	 	const formCols = this.props.geometry.formCols;
 
    return (
     <WrappedForm  layout='vertical' loading={false}  onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
           <WrappedForm.Group formGroupLayout={{gutter:formCols.gutter}}>
   
         <WrappedForm.Input field='nome' label='Nome' required  formColumnLayout={{width:formCols.nome}} />
         <WrappedForm.Input field='cognome' label='Cognome' required  formColumnLayout={{width:formCols.cognome}} />
         <WrappedForm.Input field='email' label='email'  formColumnLayout={{width:formCols.email}} />
         <WrappedForm.Input field='telefono' label='telefono'  formColumnLayout={{width:formCols.telefono}} />
     
     
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter: 8}}>
   
       <WrappedForm.Button type={'button'} formColumnLayout={{span:3}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" formColumnLayout={{span:3}}>{submitLabel}</WrappedForm.Button>
     
       </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
         
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormCliente;