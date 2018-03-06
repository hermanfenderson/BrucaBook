import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

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
  	const readOnlyEAN = ((this.props.editedRigaInventario.selectedItem !== null) || (this.props.editedRigaInventario.eanState === 'PARTIAL'))
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.Input field='ean' required={true} label='EAN' formColumnLayout={{span:4}} itemStyle={{marginRight: 10}} disabled={readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{span:13}} itemStyle={{marginRight: 10}}  disabled/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{span:7}} itemStyle={{marginRight: 10}}disabled/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group formGroupLayout={{gutter:0}}>
          <WrappedForm.Input field='prezzoListino' label='Listino'  formColumnLayout={{span:3}}  disabled/>
     
        <WrappedForm.Input field='stock' label='Stock' formColumnLayout={{span:4}} itemStyle={{marginRight: 10}} disabled/>
       
        <WrappedForm.InputNumber field='pezzi' label='Variazione' formColumnLayout={{span:6}} itemStyle={{marginRight: 10}}/>
       <WrappedForm.Button itemStyle={{width: '90%'}} type={'button'} formColumnLayout={{span:3, offset: 4}}  onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  formColumnLayout={{span:3}} itemStyle={{width: '90%'}} type="primary" htmlType="submit" >{(this.props.editedRigaInventario.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
     
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:0}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaInventario;