import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormRigaBolla extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedRigaBolla(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();

	this.props.submitEditedRigaBolla(this.props.editedRigaBolla.isValid, this.props.editedRigaBolla.selectedItem, {'bollaId':this.props.idBolla}, this.props.editedRigaBolla.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaBolla();
}



  render() {
  	const formValues = this.props.editedRigaBolla.values;
  	const errorMessages = this.props.editedRigaBolla.errorMessages;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaBolla.loading;
  	const readOnlyEAN = (this.props.editedRigaBolla.selectedItem !== null)
  	
  	return (
      <WrappedForm loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group >
        <WrappedForm.Input field='ean' required={true} label='EAN' width={6} formItemLayout={{wrapperCol: { span: 22 }}} readOnly={readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  width={8} formItemLayout={{wrapperCol: { span: 22 }}} readOnly/>
        <WrappedForm.Input field='autore' label='Autore'  width={6} formItemLayout={{wrapperCol: { span: 22 }}} readOnly/>
        <WrappedForm.Input field='prezzoListino' label='Listino'  width={4} formItemLayout={{wrapperCol: { span: 22 }}} readOnly/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group >
        <WrappedForm.Input field='sconto1' label='Sc.1' disabled={prezzoMan} width={2} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.Input field='sconto2' label='Sc.2' disabled={prezzoMan} width={2} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.Input field='sconto3' label='Sc.3' disabled={prezzoMan} width={2} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.Checkbox width={2} field='manSconto' label='Man.'/>
        
        <WrappedForm.Input field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' width={4} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.Input field='pezzi' label='Quantità' width={3} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.Input field='gratis' label='Gratis' width={3} formItemLayout={{wrapperCol: { span: 22 }}}/>
        <WrappedForm.Input field='prezzoTotale' label='Totale' readOnly width={6} formItemLayout={{wrapperCol: { span: 22 }}}/>
    
      </WrappedForm.Group>
       <WrappedForm.Group >
         <WrappedForm.GeneralError  width={16}/>
       
        <WrappedForm.Button type={'button'} width={4} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" width={4}>{(this.props.editedRigaBolla.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaBolla;