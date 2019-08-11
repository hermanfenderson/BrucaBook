import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm2'
import Magazzino from '../../magazzino'
import {Modal} from 'antd';

import OrdiniAperti from '../../ordiniAperti';

class FormRigaScontrino extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	   	this.props.changeEditedRigaScontrino(name, value)};

submitFunc = () => {
         	if (this.props.editedRigaScontrino.isValid && !this.props.editedRigaScontrino.selectedItem && this.props.eanTree[this.props.editedRigaScontrino.values.ean])
        		{
        		//Qui devo copiare lo stato degli ordini salvati... quindi mi conviene persisterlo...
        		let savedLines = this.props.saveOrdiniApertiDiff('scontrino',this.params);
        		this.props.setShowOrdiniApertiModal(false);
        		//Troppo semplice...
        		this.values.ordini = savedLines;
        		}
        	    this.props.submitEditedRigaScontrino(this.props.editedRigaScontrino.isValid, this.props.editedRigaScontrino.selectedItem, this.params, this.values); //Per sapere cosa fare... dopo
        	    
	    
}; 

submitFuncFromOrdiniAperti = () => {
	//Se ho errori... non faccio ulla
	if (!this.props.ordiniApertiErrors.hasErrors) this.submitFunc();
}


onSubmit = (e) => {
	e.preventDefault();
	var valuesTestata = {...this.props.testataScontrino};
	delete valuesTestata.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
    delete valuesTestata.createdBy;
    delete valuesTestata.createdAt;
    delete valuesTestata.changedBy;
    delete valuesTestata.changedAt;
    delete valuesTestata.key;
    delete valuesTestata.sconto;
	valuesTestata.data = valuesTestata.dataCassa;
    this.values =  {...this.props.editedRigaScontrino.values, ...valuesTestata};
    this.params = [...this.props.period];
    this.params.push(this.props.cassa);
    this.params.push(this.props.scontrino);
    if (this.props.editedRigaScontrino.isValid && !this.props.editedRigaScontrino.selectedItem && this.props.eanTree[this.props.editedRigaScontrino.values.ean]) 
	 {
	 this.props.setOrdiniApertiperEAN(this.props.eanTree[this.props.editedRigaScontrino.values.ean], (parseInt(this.values.pezzi,10) || 0 ));	
	 
	  this.props.setShowOrdiniApertiModal(true);
	 	
	 }
    		
	else 
		{
		 if (this.props.editedRigaScontrino.selectedItem && this.props.editedRigaScontrino.selectedItem.ordini && (parseInt(this.props.editedRigaScontrino.selectedItem.pezzi,10) !== parseInt(this.values.pezzi,10)) ) 
				 Modal.error(
		    	{title: 'Impossibile modificare', content: 'Questa riga ha ordini associati: impossibile cambiare le quantità'}
		    	);		
	
		else this.submitFunc(); //Per sapere cosa fare... dopo
		}

  }
 
resetForm = () => {
	this.props.resetEditedRigaScontrino();
	this.props.setShowOrdiniApertiModal(false);
}

eanLookupOpen = () => {this.props.setEanLookupOpen(true)};
eanLookupClosed = () => {this.props.setEanLookupOpen(false)};




  render() {
  	const formValues = this.props.editedRigaScontrino.values;
  	const errorMessages = this.props.editedRigaScontrino.errorMessages;
  	const willFocus = this.props.editedRigaScontrino.willFocus;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaScontrino.loading;
  	const readOnlyEAN = ((this.props.editedRigaScontrino.selectedItem !== null) || (this.props.editedRigaScontrino.eanState === 'PARTIAL'))
  	const frsCols1 = this.props.geometry.formCols1;
  	const frsCols2 = this.props.geometry.formCols2;
  	const generalError = this.props.geometry.generalError;
  	return (
  	<div>
  		<Modal width={880} title={'Ordini aperti per "'+ formValues.titolo+'"'} visible={this.props.showOrdiniApertiModal} onOk={this.submitFuncFromOrdiniAperti} onCancel={this.resetForm} okButtonProps={{ disabled: this.props.ordiniApertiErrors.hasErrors}}>
	<OrdiniAperti onSubmit={this.submitFuncFromOrdiniAperti}></OrdiniAperti>
	
	 </Modal>  	
	
	 <WrappedForm  layout={'vertical'} disableAllColon={true} readOnlyForm={this.props.scontrino ? false : true} focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.InputLookup  lookupElement={<Magazzino noHeader noDetails/>} field='ean' required={true} label='EAN' coord={frsCols1.ean}   disabled={readOnlyEAN} onOpenModal={this.eanLookupOpen} onCloseModal={this.eanLookupClosed}/>
        <WrappedForm.Input field='titolo' label='Titolo'  coord={frsCols1.titolo} disabled/>
        <WrappedForm.Input field='autore' label='Autore'  coord={frsCols1.autore} disabled/>
        
       <WrappedForm.Input  field='prezzoListino' label='Listino'  coord={frsCols2.listino}  disabled/>
     
        <WrappedForm.Checkbox  coord={frsCols2.man}  field='manSconto' label='Man'/>
       
        <WrappedForm.Input  field='sconto' label='Sconto' disabled={prezzoMan} coord={frsCols2.sconto}  />
        
        <WrappedForm.Input  field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' coord={frsCols2.prezzo}/>
        <WrappedForm.Input  field='pezzi' label='Quantità' coord={frsCols2.pezzi}/>
        <WrappedForm.Input  field='prezzoTotale' label='Totale' readOnly coord={frsCols2.totale}/>
    <WrappedForm.Button type={'button'} coord={frsCols2.annulla} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary"  htmlType="submit"  coord={frsCols2.aggiungi}>{(this.props.editedRigaScontrino.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
        
         <WrappedForm.GeneralError  coord={generalError}/>
       
        
        
       
       </WrappedForm>
       </div>
    )
  }
}
export default FormRigaScontrino;