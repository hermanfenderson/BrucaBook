import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import WrappedForm from '../../../components/WrappedForm'


class FormOrdine extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedOrdine(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//Qui devo fare reload della pagina verso la riga bolla...
	if (this.props.readOnlyForm) {
		this.props.history.push('/ordine/' + this.props.match.params.cliente + '/' + this.props.editedOrdine.selectedItem.key);
	}
	//Elemento radice: il parametro del punto di destinazione è oggetto vuoto...
	
	else this.props.submitEditedOrdine(this.props.editedOrdine.isValid, this.props.editedOrdine.selectedItem, this.props.match.params.cliente, this.props.editedOrdine.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedOrdine();
}

componentDidMount = () => 
{
	this.resetForm();
}

  render() {
  	const formValues = this.props.editedOrdine.values;
  	const errorMessages = this.props.editedOrdine.errorMessages;
  	const readOnlyForm = this.props.readOnlyForm; //Vado in read only form... perchè sono pronto per aggiungere libri...
  	const selectedItem = this.props.editedOrdine.selectedItem;
  	const submitLabel = readOnlyForm ? 'Seleziona' : (selectedItem ? 'Modifica' : 'Crea');
  	const  formCols1 = this.props.geometry.formCols1;
  	const  formCols2 = this.props.geometry.formCols2;
  	return (
     <WrappedForm  layout='vertical' loading={false} readOnlyForm={readOnlyForm} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
         <WrappedForm.Group formGroupLayout={{gutter: formCols1.gutter}} >
        <WrappedForm.Input field='riferimento' label='Riferimento'  formColumnLayout={{width:formCols1.riferimento}} />
        <WrappedForm.DatePicker field='dataOrdine' label='Data Ordine' allowClear={false} format = 'DD/MM/YYYY' formColumnLayout={{width:formCols1.dataOrdine}} style={{width:formCols1.dataOrdine}}  disabled={(this.props.editedOrdine.selectedItem!==null)}/>
        <WrappedForm.DatePicker field='dataChiusura' label='Data Chiusura'  allowClear={false} disabled={true} format = 'DD/MM/YYYY' formColumnLayout={{width:formCols1.dataChiusura}} style={{width:formCols1.dataChiusura}}/>
          <WrappedForm.SelectList field='stato' formColumnLayout={{width:formCols1.stato}} label='Stato' list={this.props.statoOrdine} defaultValue = 'A' />
     
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter: formCols2.gutter}}>
      
       <WrappedForm.Button   type={'button'}  formColumnLayout={{width:formCols2.annulla}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit"  formColumnLayout={{width:formCols2.crea}}>{submitLabel}</WrappedForm.Button>
     
       </WrappedForm.Group>
        
     
       <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
         
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default withRouter(FormOrdine);