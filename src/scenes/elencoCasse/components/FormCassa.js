import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm'
import {period2month, moment2period} from '../../../helpers/form'

class FormCassa extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedCassa(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//Qui devo fare reload della pagina verso la riga bolla...
	if (this.props.readOnlyForm) {
		this.props.history.push('/scontrino/' + period2month(this.props.period) + '/' + this.props.editedCassa.selectedItem.key);
	}
	//Elemento radice: il parametro del punto di destinazione è oggetto vuoto...
	
	else this.props.submitEditedCassa(this.props.editedCassa.isValid, this.props.editedCassa.selectedItem, moment2period(this.props.editedCassa.values.dataCassa), this.props.editedCassa.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedCassa();
}

componentWillMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedCassa.values;
  	const errorMessages = this.props.editedCassa.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedCassa.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
    return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.Input field='cassa' label='Cassa'  required={true} formColumnLayout={{span: 8}} />
        <WrappedForm.DatePicker allowClear={false} field='dataCassa' label='Data'  format = 'DD/MM/YYYY' formColumnLayout={{span: 4}} disabled={(this.props.editedCassa.selectedItem!==null)}/>
         </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:18}}/>
       
        <WrappedForm.Button type={'button'} formColumnLayout={{span:3}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" formColumnLayout={{span:3}}>{submitLabel}</WrappedForm.Button>
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default withRouter(FormCassa);