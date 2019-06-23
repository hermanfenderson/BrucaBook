import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
import Magazzino from '../../magazzino'

class FormRigaResaLibera extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedRigaResa(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	var valuesTestata = {...this.props.testataResa};
	delete valuesTestata.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
    delete valuesTestata.createdBy;
    delete valuesTestata.createdAt;
    delete valuesTestata.changedBy;
    delete valuesTestata.changedAt;
    delete valuesTestata.key;
	valuesTestata.data = valuesTestata.dataScarico;
    const values =  {...this.props.editedRigaResa.values, ...valuesTestata};
    let params = [...this.props.period];
    params.push(this.props.idResa);
    console.log(values);	   
	this.props.submitEditedRigaResa(this.props.editedRigaResa.isValid, this.props.editedRigaResa.selectedItem, params, values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaResa();
}



  render() {
  	const formValues = this.props.editedRigaResa.values;
  	const errorMessages = this.props.editedRigaResa.errorMessages;
  	const willFocus = this.props.editedRigaResa.willFocus;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaResa.loading;
  	const readOnlyEAN = ((this.props.editedRigaResa.selectedItem !== null) || (this.props.editedRigaResa.eanState === 'PARTIAL'));
  	const formCols1 = this.props.geometry.formCols1;
  	const formCols2 = this.props.geometry.formCols2;
  
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:formCols1.gutter}}>
        <WrappedForm.InputLookup lookupElement={<Magazzino noHeader noDetails/>}  field='ean' required={true} label='EAN' formColumnLayout={{width:formCols1.ean}} disabled={readOnlyEAN}/>
       <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{width:formCols1.titolo}}  disabled/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{width:formCols1.autore}}  disabled/>
        <WrappedForm.Input field='prezzoListino' label='Listino'  formColumnLayout={{width:formCols1.listino}}   disabled/>
     
       </WrappedForm.Group >
        
        <WrappedForm.Group formGroupLayout={{gutter:formCols2.gutter}}>
       <WrappedForm.Checkbox formColumnLayout={{width:formCols2.man}} field='manSconto' label='Man.'/>
       
        <WrappedForm.Input field='sconto1' label='Sc.1' disabled={prezzoMan} formColumnLayout={{width:formCols2.sconto1}} />
        <WrappedForm.Input field='sconto2' label='Sc.2' disabled={prezzoMan} formColumnLayout={{width:formCols2.sconto2}}/>
        <WrappedForm.Input field='sconto3' label='Sc.3' disabled={prezzoMan} formColumnLayout={{width:formCols2.sconto3}}/>
        
        <WrappedForm.Input field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' formColumnLayout={{width:formCols2.prezzo}} />
        <WrappedForm.Input field='pezzi' label='Quantità' formColumnLayout={{width:formCols2.pezzi}}/>
        <WrappedForm.Input field='gratis' label='Gratis' formColumnLayout={{width:formCols2.gratis}}/>
        <WrappedForm.Input field='prezzoTotale' label='Totale' readOnly formColumnLayout={{width:formCols2.totale}} />
    
       <WrappedForm.Button type={'button'} formColumnLayout={{width:formCols2.annulla}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" formColumnLayout={{width:formCols2.crea}} htmlType="submit" >{(this.props.editedRigaResa.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
     
     
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:0}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaResaLibera;