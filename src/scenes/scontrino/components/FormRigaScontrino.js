import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormRigaScontrino extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	   	this.props.changeEditedRigaScontrino(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
    const values =  {...this.props.editedRigaScontrino.values, 'data': this.props.testataScontrino.dataCassa};  //Qui posso aggiungere oggetti dalla testata!!!!
    let params = [...this.props.period];
    params.push(this.props.cassa);
    params.push(this.props.scontrino);
    this.props.submitEditedRigaScontrino(this.props.editedRigaScontrino.isValid, this.props.editedRigaScontrino.selectedItem, params, values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaScontrino();
}




  render() {
  	const formValues = this.props.editedRigaScontrino.values;
  	const errorMessages = this.props.editedRigaScontrino.errorMessages;
  	const willFocus = this.props.editedRigaScontrino.willFocus;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaScontrino.loading;
  	const readOnlyEAN = ((this.props.editedRigaScontrino.selectedItem !== null) || (this.props.editedRigaScontrino.eanState === 'PARTIAL'))
  	
  	    
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.Input field='ean' required={true} label='EAN' formColumnLayout={{span:6}}  disabled={readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{span:8}}  disabled/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{span:6}} disabled/>
        <WrappedForm.Input field='prezzoListino' label='Listino'  formColumnLayout={{span:4}}  disabled/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.Input field='sconto' label='Sconto' disabled={prezzoMan} formColumnLayout={{span:4}}  />
        <WrappedForm.Checkbox formColumnLayout={{span:4}} field='manSconto' label='Man.'/>
        
        <WrappedForm.Input field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' formColumnLayout={{span:5}} />
        <WrappedForm.Input field='pezzi' label='Quantità' formColumnLayout={{span:5}}/>
        <WrappedForm.Input field='prezzoTotale' label='Totale' readOnly formColumnLayout={{span:6}} formItemLayout={{wrapperCol: { offset: 2, span: 22 }}}/>
    
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:16}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:14}}/>
       
        <WrappedForm.Button type={'button'} formColumnLayout={{span:5}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" formColumnLayout={{span:5}}>{(this.props.editedRigaScontrino.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaScontrino;