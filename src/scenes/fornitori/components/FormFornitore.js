import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormFornitore extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedFornitore(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	this.props.submitEditedFornitore(this.props.editedFornitore.isValid, this.props.editedFornitore.selectedItem, null, this.props.editedFornitore.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedFornitore();
}

componentWillMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedFornitore.values;
  	const errorMessages = this.props.editedFornitore.errorMessages;
  	const selectedItem = this.props.editedFornitore.selectedItem;
  	const submitLabel =  selectedItem ? 'Modifica' : 'Crea';
    return (
     <WrappedForm  layout='vertical' loading={false}  onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group formGroupLayout={{gutter:0}}>
         <WrappedForm.Input field='nome' label='Nome' required  formColumnLayout={{span: 14}} itemStyle={{marginRight: 10}} />
     
       <WrappedForm.Button itemStyle={{width: '90%',  marginTop: 40}} type={'button'} formColumnLayout={{span:3}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button itemStyle={{width: '90%',  marginTop: 40}} type="primary" htmlType="submit" formColumnLayout={{span:3}}>{submitLabel}</WrappedForm.Button>
     
       </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
         
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormFornitore;