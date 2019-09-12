import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

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
  	
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
        <WrappedForm.Group formGroupLayout={{gutter:8}}>
        <WrappedForm.InputNumber   disabled={!this.props.canChangeNumber} className='input-numero-scontrino' formColumnLayout={{width:55}} field='numero'  />
        <WrappedForm.TimePicker   className='input-ora-scontrino' formColumnLayout={{width:70}} field='oraScontrino'  format="HH:mm" allowClear={false}/>
        
        <WrappedForm.Button  buttonItemLayout={{style:{paddingTop: '0px'}}} icon='edit' formColumnLayout={{width:40}} type="primary" htmlType="submit" />
        </WrappedForm.Group>
          <WrappedForm.Group formGroupLayout={{gutter:8}}>
       <WrappedForm.Input  formColumnLayout={{width:92}} field='sconto'  />
       
        <WrappedForm.Button  buttonItemLayout={{style:{paddingTop: '0px'}}} formColumnLayout={{width:80}} type="primary" htmlType="submit">Sconto </WrappedForm.Button>
       
        </WrappedForm.Group>
       
       </WrappedForm>
    )
  }
}
export default FormTestataScontrino;