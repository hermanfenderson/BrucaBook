import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
import Magazzino from '../../magazzino'
import {Modal} from 'antd';

import OrdiniAperti from '../../ordiniAperti';

class FormRigaScontrino extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	   	this.props.changeEditedRigaScontrino(name, value)};

submitFunc = () => {
         	if (this.props.editedRigaScontrino.isValid && this.props.eanTree[this.props.editedRigaScontrino.values.ean])
        		{
        		//Qui devo copiare lo stato degli ordini salvati... quindi mi conviene persisterlo...
        		let savedLines = this.props.saveOrdiniApertiDiff('scontrino',this.params);
        		this.props.setShowOrdiniApertiModal(false);
        		//Troppo semplice...
        		this.values.ordini = savedLines;
        		}
        	    this.props.submitEditedRigaScontrino(this.props.editedRigaScontrino.isValid, this.props.editedRigaScontrino.selectedItem, this.params, this.values); //Per sapere cosa fare... dopo
        	    
	    
}; 

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
    if (this.props.editedRigaScontrino.isValid && this.props.eanTree[this.props.editedRigaScontrino.values.ean]) 
	 {
	 this.props.setOrdiniApertiperEAN(this.props.eanTree[this.props.editedRigaScontrino.values.ean], (parseInt(this.values.pezzi,10) || 0 ));	
	 
	  this.props.setShowOrdiniApertiModal(true);
	 	
	 }
    		
	else this.submitFunc(); //Per sapere cosa fare... dopo

  }
 
resetForm = () => {
	this.props.resetEditedRigaScontrino();
}

eanLookupOpen = () => {this.props.setEanLookupOpen(true)};
eanLookupClosed = () => {this.props.setEanLookupOpen(false)};




  render() {
  	console.log(this.props.eanTree);
  	const formValues = this.props.editedRigaScontrino.values;
  	const errorMessages = this.props.editedRigaScontrino.errorMessages;
  	const willFocus = this.props.editedRigaScontrino.willFocus;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaScontrino.loading;
  	const readOnlyEAN = ((this.props.editedRigaScontrino.selectedItem !== null) || (this.props.editedRigaScontrino.eanState === 'PARTIAL'))
  	const frsCols = this.props.geometry.formRigaScontrinoCols;
  	const frsGutter = this.props.geometry.formRigaScontrinoGutter;
  	return (
  	<div>
  		<Modal title={'Ordini aperti per "'+ formValues.titolo+'"'} visible={this.props.showOrdiniApertiModal} onOk={this.submitFunc} onCancel={this.resetForm}>
		<OrdiniAperti></OrdiniAperti>
		<div> <p>Premi OK per confermare l'associazione cliente-quantità (totale pezzi {(parseInt(formValues.pezzi, 10) || 0 )})</p></div>
    </Modal>  	
	
	 <WrappedForm  disableAllColon={true} readOnlyForm={this.props.scontrino ? false : true} focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:frsGutter}}>
        <WrappedForm.InputLookup  lookupElement={<Magazzino noHeader noDetails/>} field='ean' required={true} label='EAN' formColumnLayout={{width:frsCols.ean}} style={{width:frsCols.ean}}  disabled={readOnlyEAN} onOpenModal={this.eanLookupOpen} onCloseModal={this.eanLookupClosed}/>
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{width:frsCols.titolo}} disabled/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{width:frsCols.autore}} disabled/>
        
       </WrappedForm.Group>
        
        <WrappedForm.Group formGroupLayout={{gutter:frsGutter}}>
       <WrappedForm.Input  field='prezzoListino' label='Listino'  formColumnLayout={{width:frsCols.listino}}  disabled/>
     
        <WrappedForm.Checkbox  formColumnLayout={{width:frsCols.man}}  field='manSconto' label='Man'/>
       
        <WrappedForm.Input  field='sconto' label='Sconto' disabled={prezzoMan} formColumnLayout={{width:frsCols.sconto}}  />
        
        <WrappedForm.Input  field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' formColumnLayout={{width:frsCols.prezzoUnitario}}/>
        <WrappedForm.Input  field='pezzi' label='Quantità' formColumnLayout={{width:frsCols.pezzi}}/>
        <WrappedForm.Input  field='prezzoTotale' label='Totale' readOnly formColumnLayout={{width:frsCols.prezzoTotale}}/>
    <WrappedForm.Button type={'button'} formColumnLayout={{width:frsCols.annulla}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary"  htmlType="submit"  formColumnLayout={{width:frsCols.aggiungi}}>{(this.props.editedRigaScontrino.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
        
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:0}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
       </div>
    )
  }
}
export default FormRigaScontrino;