import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm2'
import {period2month, moment2period} from '../../../helpers/form'
import {objSelector} from '../../../helpers/form'


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

componentDidMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedBolla.values;
  	const errorMessages = this.props.editedBolla.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedBolla.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
  	const  formCols1 = this.props.geometry.formCols1;
  	const  formCols2 = this.props.geometry.formCols2;
  	const  generalError = this.props.geometry.generalError;
  
  	return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Input field='riferimento' label='Riferimento'  required={true} coord={formCols1.riferimento}/>
        <WrappedForm.AutoCompleteList field='fornitore' label='Fornitore' list={objSelector(this.props.fornitori,'nome')}  required={true} coord={formCols1.fornitore} />
        <WrappedForm.DatePicker field='dataDocumento' label='Data Documento' allowClear={false} format = 'DD/MM/YYYY'  coord={formCols1.dataDocumento}  disabled={(this.props.editedBolla.selectedItem!==null)}/>
        <WrappedForm.DatePicker field='dataCarico' label='Data Carico'  allowClear={false} format = 'DD/MM/YYYY'  coord={formCols1.dataCarico}/>
     
       <WrappedForm.SelectList field='tipoBolla' coord={formCols2.tipo} label='Tipo' list={this.props.tipiBolla} defaultValue = 'A' />
        <WrappedForm.DatePicker field='dataRendiconto' label='Data Rendiconto' coord={formCols2.dataRendiconto}  allowClear={false} format = 'DD/MM/YYYY'  disabled={(this.props.editedBolla.values.tipoBolla!=='R')}/>
       
       <WrappedForm.Button   type={'button'}  coord={formCols2.annulla} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit"  coord={formCols2.crea}>{submitLabel}</WrappedForm.Button>
         <WrappedForm.GeneralError coord={generalError}  />
       
  
   
         
       </WrappedForm>
    )
  }
}
export default withRouter(FormBolla);