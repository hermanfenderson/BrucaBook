import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
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
   	const readOnlyEAN = ((this.props.editedRigaInventario.selectedItem !== null) || (this.props.editedRigaInventario.eanState === 'PARTIAL'))
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:cols1.gutter}}>
        <WrappedForm.InputLookup lookupElement={<Magazzino noHeader noDetails/>} field='ean' required={true} label='EAN' formColumnLayout={{width:cols1.ean}}  disabled={readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{width:cols1.titolo}}   disabled/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{width:cols1.autore}} disabled/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group formGroupLayout={{gutter:cols1.gutter}}>
          <WrappedForm.Input field='prezzoListino' label='Listino'  formColumnLayout={{width:cols2.listino}}  disabled/>
     
        <WrappedForm.Input field='stock' label='Stock' formColumnLayout={{width:cols2.stock}} disabled/>
       
        <WrappedForm.InputNumber field='pezzi' label='Variazione' formColumnLayout={{width:cols2.delta}}/>
       <WrappedForm.Button  type={'button'} formColumnLayout={{width: cols2.annulla}}  onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  formColumnLayout={{width:cols2.inserisci}}  type="primary" htmlType="submit" >{(this.props.editedRigaInventario.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
     
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:0}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaInventario;