import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm2'

class FormTestataScontrino extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	   	this.props.changeEditedCassa(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
   
    
    let params = [...this.props.period];
    params.push(this.props.cassa);
    params.push(this.props.scontrino);
    
    let newValues = {};
    newValues.numero = this.props.editedCassa.values.numero;
    newValues.sconto = this.props.editedCassa.values.sconto;
    newValues.oraScontrino = this.props.editedCassa.values.oraScontrino;
    newValues.dataCassa = this.props.editedCassa.values.dataCassa;
    
    if (this.props.editedCassa.selectedItem) newValues.oldNumero = this.props.editedCassa.selectedItem.numero; //Metto il vecchio numero per gestire le modifiche...
    this.props.submitEditedCassa(this.props.editedCassa.isValid, this.props.editedCassa.selectedItem, params, newValues); //Per sapere cosa fare... dopo
    if (this.props.editedCassa.isValid) this.props.setSconto(params,newValues.sconto,this.props.righeScontrino);
  }
 


/* Posso cambiare il numero scontrino soltanto se sono a nuova gestione del modello dati... ovvero ho in testata numeroScontrini e ha dimensione uguale al totale scontrini...*/

  render() {
  	const formValues = this.props.editedCassa.values;
  	const errorMessages = this.props.editedCassa.errorMessages;
  	const willFocus = this.props.editedCassa.willFocus;
  	const loading = this.props.editedCassa.loading;
  	const frsCols1 = this.props.geometry.formTestataCols1;
  	const frsCols2 = this.props.geometry.formTestataCols2;
  	
  	
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
        <WrappedForm.InputNumber  coord={frsCols1.numero} disabled={!this.props.canChangeNumber}   field='numero'  />
        <WrappedForm.TimePicker   coord={frsCols1.oraScontrino} className='input-ora-scontrino' field='oraScontrino'  format="HH:mm" allowClear={false}/>
        
        <WrappedForm.Button  coord={frsCols1.edit} icon='edit'  type="primary" htmlType="submit" />
          <WrappedForm.Input  coord={frsCols2.sconto} field='sconto'  /> 
       
        <WrappedForm.Button coord={frsCols2.submit}   type="primary" htmlType="submit">Sconto </WrappedForm.Button>
       
        
       </WrappedForm>
    )
  }
}
export default FormTestataScontrino;