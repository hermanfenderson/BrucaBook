import React, {Component} from 'react'
import Firebase from 'firebase';
import {Modal} from 'antd';

import WrappedForm from '../../../components/WrappedForm'
import Magazzino from '../../magazzino'
class FormRigaOrdine extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedRigaOrdine(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	let cliente = (this.props.ordiniAperti) ? this.props.editedRigaOrdine.values.cliente : this.props.cliente;
	let idOrdine = (this.props.ordiniAperti) ? this.props.editedRigaOrdine.values.ordine : this.props.idOrdine;
   const values = (this.props.ordiniAperti) ? {...this.props.editedRigaOrdine.values} : {...this.props.editedRigaOrdine.values, cliente: this.props.cliente, ordine: this.props.idOrdine, dataOrdine: this.props.testataOrdine.dataOrdine}; //Utile avere il cliente nel record per lista ordini aperti
    let params = [cliente];
    params.push(idOrdine);
    //Storicizzo l'ordine...se sto per persistere...
    if (this.props.editedRigaOrdine.isValid) 
    
		{   let oldStato = (this.props.editedRigaOrdine.selectedItem) ? this.props.editedRigaOrdine.selectedItem.stato : null;
		   if (oldStato !== values.stato) values.oldStato = oldStato;
			values.history[Firebase.database().ref().push().key] = {at: Firebase.database.ServerValue.TIMESTAMP, oldStato: oldStato, stato: values.stato, source: 'user'};
		}
    if (this.props.editedRigaOrdine.selectedItem && (this.props.editedRigaOrdine.selectedItem.bolla || this.props.editedRigaOrdine.selectedItem.scontrino) && ((this.props.editedRigaOrdine.selectedItem.stato > values.stato) || (parseInt(this.props.editedRigaOrdine.selectedItem.pezzi,10) !== parseInt(values.pezzi,10))) ) 
				 Modal.error(
		    	{title: 'Impossibile modificare', content: 'Questa riga ha bolle/scontrini associati: impossibile cambiare le quantità o arretrare lo stato'}
		    	);			
	else this.props.submitEditedRigaOrdine(this.props.editedRigaOrdine.isValid, this.props.editedRigaOrdine.selectedItem, params, values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaOrdine();
}



  render() {
  	const formValues = this.props.editedRigaOrdine.values;
  	const errorMessages = this.props.editedRigaOrdine.errorMessages;
  	const willFocus = this.props.editedRigaOrdine.willFocus;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaOrdine.loading;
  	const readOnlyEAN = ((this.props.editedRigaOrdine.selectedItem !== null) || (this.props.editedRigaOrdine.eanState === 'PARTIAL'))
  	const formCols1 = this.props.geometry.formCols1;
  		const formCols2 = this.props.geometry.formCols2;
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:formCols1.gutter}}>
        <WrappedForm.InputLookup lookupElement={<Magazzino noHeader noDetails/>} field='ean' required={true} label='EAN' formColumnLayout={{width:formCols1.ean}}   disabled={readOnlyEAN || this.props.ordiniAperti}/>
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{width:formCols1.titolo}}  disabled/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{width:formCols1.autore}}  disabled/>
        <WrappedForm.Input field='prezzoListino' label='Listino'  formColumnLayout={{width:formCols1.listino}}   disabled/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group formGroupLayout={{gutter:formCols2.gutter}}>
        <WrappedForm.Checkbox formColumnLayout={{width:formCols2.man}} field='manSconto' label='Man.'/>
       
        <WrappedForm.Input field='sconto' label='Sc.' disabled={prezzoMan} formColumnLayout={{width:formCols2.sconto}} />
        
        <WrappedForm.Input field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' formColumnLayout={{width:formCols2.prezzo}} />
        <WrappedForm.Input field='pezzi' label='Quantità' formColumnLayout={{width:formCols2.pezzi}}/>
        <WrappedForm.Input field='prezzoTotale' label='Totale' readOnly formColumnLayout={{width:formCols2.totale}} />
         <WrappedForm.SelectList field='stato' formColumnLayout={{width:formCols2.stato}} label='Stato' list={this.props.statoRigaOrdine} defaultValue = 'D' />
     
       <WrappedForm.Button type={'button'} formColumnLayout={{width:formCols2.annulla}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" disabled={this.props.ordiniAperti && !this.props.editedRigaOrdine.selectedItem } formColumnLayout={{width:formCols2.crea}} htmlType="submit" >{(this.props.editedRigaOrdine.selectedItem || this.props.ordiniAperti) ?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
     
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:0}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaOrdine;