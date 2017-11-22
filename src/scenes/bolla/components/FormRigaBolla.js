import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormRigaBolla extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedRigaBolla(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
    const values =  {...this.props.editedRigaBolla.values, 'data': this.props.testataBolla.dataCarico};
    let params = this.props.period;
    params.push(this.props.idBolla);
    	   
	this.props.submitEditedRigaBolla(this.props.editedRigaBolla.isValid, this.props.editedRigaBolla.selectedItem, params, values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaBolla();
}



  render() {
  	const formValues = this.props.editedRigaBolla.values;
  	const errorMessages = this.props.editedRigaBolla.errorMessages;
  	const willFocus = this.props.editedRigaBolla.willFocus;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaBolla.loading;
  	const readOnlyEAN = ((this.props.editedRigaBolla.selectedItem !== null) || (this.props.editedRigaBolla.eanState === 'PARTIAL'))
  	
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.Input field='ean' required={true} label='EAN' formColumnLayout={{span:6}}  readOnly={readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{span:8}}  readOnly/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{span:6}} readOnly/>
        <WrappedForm.Input field='prezzoListino' label='Listino'  formColumnLayout={{span:4}}  readOnly/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.Input field='sconto1' label='Sc.1' disabled={prezzoMan} formColumnLayout={{span:2}}  />
        <WrappedForm.Input field='sconto2' label='Sc.2' disabled={prezzoMan} formColumnLayout={{span:2}} />
        <WrappedForm.Input field='sconto3' label='Sc.3' disabled={prezzoMan} formColumnLayout={{span:2}} />
        <WrappedForm.Checkbox formColumnLayout={{span:2}} field='manSconto' label='Man.'/>
        
        <WrappedForm.Input field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' formColumnLayout={{span:4}} />
        <WrappedForm.Input field='pezzi' label='Quantità' formColumnLayout={{span:3}}/>
        <WrappedForm.Input field='gratis' label='Gratis' formColumnLayout={{span:3}}/>
        <WrappedForm.Input field='prezzoTotale' label='Totale' readOnly formColumnLayout={{span:6}} formItemLayout={{wrapperCol: { offset: 2, span: 22 }}}/>
    
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:16}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:16}}/>
       
        <WrappedForm.Button type={'button'} formColumnLayout={{span:4}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" htmlType="submit" formColumnLayout={{span:4}}>{(this.props.editedRigaBolla.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaBolla;