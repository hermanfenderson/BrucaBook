import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm2'
import Magazzino from '../../magazzino'

class FormRigaInventario extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedRigaInventario(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	var valuesTestata = {...this.props.testataInventario};
	delete valuesTestata.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
    delete valuesTestata.createdBy;
    delete valuesTestata.createdAt;
    delete valuesTestata.changedBy;
    delete valuesTestata.changedAt;
    delete valuesTestata.key;
	valuesTestata.data = valuesTestata.dataInventario;
    const values =  {...this.props.editedRigaInventario.values, ...valuesTestata};
    values.pinned = false;
    //Non devo persisterli...
    
	this.props.submitEditedRigaInventario(this.props.editedRigaInventario.isValid, this.props.editedRigaInventario.selectedItem, this.props.idInventario, values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaInventario();
}



  render() {
  	const formValues = this.props.editedRigaInventario.values;
  	const errorMessages = this.props.editedRigaInventario.errorMessages;
  	const willFocus = this.props.editedRigaInventario.willFocus;
  	const loading = this.props.editedRigaInventario.loading;
  	const cols1 = this.props.geometry.formCols1;
  	const cols2 = this.props.geometry.formCols2;
  	const generalError = this.props.geometry.generalError;
 
   	const readOnlyEAN = ((this.props.editedRigaInventario.selectedItem !== null) || (this.props.editedRigaInventario.eanState === 'PARTIAL'))
  	return (
      <WrappedForm  layout='vertical'focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
        <WrappedForm.InputLookup lookupElement={<Magazzino noHeader noDetails/>} field='ean' required={true} label='EAN' coord={cols1.ean}  disabled={readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  coord={cols1.titolo}   disabled/>
        <WrappedForm.Input field='autore' label='Autore'  coord={cols2.autore} disabled/>
     
          <WrappedForm.Input field='prezzoListino' label='Listino'  coord={cols2.listino}  disabled/>
     
        <WrappedForm.Input field='prima' label='Prima' coord={cols2.prima} disabled/>
       
        <WrappedForm.InputNumber field='pezzi' label='Variazione' coord={cols2.delta}/>
        <WrappedForm.Input field='dopo' label='Dopo' coord={cols2.dopo} disabled/>
        <WrappedForm.Input field='ora' label='Ora' coord={cols2.ora} disabled/>
     
       <WrappedForm.Button  type={'button'} coord={cols2.annulla}  onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  coord={cols2.inserisci}  type="primary" htmlType="submit" >{(this.props.editedRigaInventario.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
     
         <WrappedForm.GeneralError  coord={generalError}/>
       
        
        
       
       </WrappedForm>
    )
  }
}
export default FormRigaInventario;