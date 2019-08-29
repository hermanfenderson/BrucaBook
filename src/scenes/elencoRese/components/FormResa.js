import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm2'
import {period2month, moment2period} from '../../../helpers/form'
import {objSelector} from '../../../helpers/form'


class FormResa extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedResa(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//Qui devo fare reload della pagina verso la riga bolla...
	if (this.props.readOnlyForm) {
		this.props.history.push('/resa/' + period2month(this.props.period) + '/' + this.props.editedBolla.selectedItem.key);
	}
	//Elemento radice: il parametro del punto di destinazione è oggetto vuoto...
	
	else this.props.submitEditedResa(this.props.editedResa.isValid, this.props.editedResa.selectedItem, moment2period(this.props.editedResa.values.dataDocumento), this.props.editedResa.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedResa();
}

componentWillMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedResa.values;
  	const errorMessages = this.props.editedResa.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedResa.selectedItem;
  	const formCols1 = this.props.geometry.formCols1;
  	const formCols2 = this.props.geometry.formCols2;
  	const generalError = this.props.geometry.generalError;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
    return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Input field='riferimento' label='Riferimento'  required={true} coord={formCols1.riferimento} />
        <WrappedForm.AutoCompleteList field='fornitore' label='Fornitore' list={objSelector(this.props.fornitori,'nome')}  required={true} coord={formCols1.fornitore}/>
        <WrappedForm.DatePicker field='dataDocumento' label='Data Documento' allowClear={false} format = 'DD/MM/YYYY' coord={formCols1.dataDocumento}  disabled={(this.props.editedResa.selectedItem!==null)}/>
        <WrappedForm.DatePicker field='dataScarico' label='Data Carico'  allowClear={false} format = 'DD/MM/YYYY' coord={formCols1.dataScarico} />
     
       <WrappedForm.SelectList coord={formCols2.stato}  disabled={(this.props.editedResa.selectedItem!==null && this.props.editedResa.selectedItem.stato==='libera')} field='stato' label='Stato' list={(this.props.editedResa.selectedItem===null) ? {'aperta': 'aperta', 'chiusa': 'chiusa', 'libera': 'libera'} : {'aperta': 'aperta', 'chiusa': 'chiusa'}} defaultValue = 'aperta' />
       <WrappedForm.Button   type={'button'} coord={formCols2.annulla} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" coord={formCols2.crea}>{submitLabel}</WrappedForm.Button>
     
       <WrappedForm.GeneralError coord={generalError} />
       
        
       </WrappedForm>
    )
  }
}
export default withRouter(FormResa);