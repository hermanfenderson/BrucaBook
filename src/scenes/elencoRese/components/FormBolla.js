import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm'
import {period2month, moment2period} from '../../../helpers/form'

class FormBolla extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedBolla(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//Qui devo fare reload della pagina verso la riga bolla...
	if (this.props.readOnlyForm) {
		this.props.history.push('/bolla/' + period2month(this.props.period) + '/' + this.props.editedBolla.selectedItem.key);
	}
	//Elemento radice: il parametro del punto di destinazione è oggetto vuoto...
	
	else this.props.submitEditedBolla(this.props.editedBolla.isValid, this.props.editedBolla.selectedItem, moment2period(this.props.editedBolla.values.dataDocumento), this.props.editedBolla.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedBolla();
}

componentWillMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedBolla.values;
  	const errorMessages = this.props.editedBolla.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedBolla.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
    return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group >
        <WrappedForm.Input field='riferimento' label='Riferimento'  required={true} formColumnLayout={{span: 4}} itemStyle={{marginRight: 10}}/>
        <WrappedForm.Input field='fornitore' label='Fornitore'  required={true} formColumnLayout={{span: 6, offset: 2}} itemStyle={{marginRight: 10}}/>
        <WrappedForm.DatePicker field='dataDocumento' label='Data Documento' allowClear={false} format = 'DD/MM/YYYY' formColumnLayout={{span: 4, offset: 2}} itemStyle={{marginRight: 10}} disabled={(this.props.editedBolla.selectedItem!==null)}/>
        <WrappedForm.DatePicker field='dataCarico' label='Data Carico'  allowClear={false} format = 'DD/MM/YYYY' formColumnLayout={{span: 4, offset: 2}} itemStyle={{marginRight: 20}}/>
      </WrappedForm.Group>
       <WrappedForm.Group>
      
       <WrappedForm.SelectList formColumnLayout={{span: 4}} field='tipoBolla' label='Tipo' list={this.props.tipiBolla} defaultValue = 'A' />
        <WrappedForm.DatePicker field='dataRendiconto' label='Data Rendiconto' allowClear={false} format = 'DD/MM/YYYY' formColumnLayout={{span: 4, offset: 2}} itemStyle={{marginRight: 10}} disabled={(this.props.editedBolla.values.tipoBolla!=='R')}/>
       
       <WrappedForm.Button   type={'button'} formColumnLayout={{offset: 6, span:4}} itemStyle={{width:'90%'}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" itemStyle={{width:'90%'}} formColumnLayout={{span:4}}>{submitLabel}</WrappedForm.Button>
     
       </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
         
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default withRouter(FormBolla);