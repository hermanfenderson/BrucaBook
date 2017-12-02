import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormTestataScontrino extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	   	this.props.changeEditedCassa(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
    var values =  {...this.props.editedCassa.values};  //Qui posso aggiungere oggetti dalla testata!!!!
    if (this.props.editedCassa.selectedItem)
    	{
    	 values['oldNumero'] = this.props.editedCassa.selectedItem.numero; 	
    	 values['numeroKey'] = null;
    	 for (var i in this.props.data) 
    		{
    			if ((this.props.data[i].key !== this.props.editedCassa.selectedItem.key) && (this.props.data[i].numero === this.props.editedCassa.values.numero)) 
    				{
    				 values['numeroKey'] = 	this.props.data[i].key;
    				 break;
    				}
    		}
    	}
    	
    		
    let params = [...this.props.period];
    params.push(this.props.cassa);
    params.push(this.props.scontrino);
    this.props.submitEditedCassa(this.props.editedCassa.isValid, this.props.editedCassa.selectedItem, params, values); //Per sapere cosa fare... dopo
  }
 





  render() {
  	const formValues = this.props.editedCassa.values;
  	const errorMessages = this.props.editedCassa.errorMessages;
  	const willFocus = this.props.editedCassa.willFocus;
  	const loading = this.props.editedCassa.loading;
  	
  	    
  	return (
      <WrappedForm focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
        
        <WrappedForm.InputNumber field='numero' label='Numero' />
        <WrappedForm.TimePicker field='oraScontrino'  label='Ora' format="HH:mm"/>
            <WrappedForm.GeneralError />
       
        <WrappedForm.Button  type="primary" htmlType="submit">Aggiorna</WrappedForm.Button>
       </WrappedForm>
    )
  }
}
export default FormTestataScontrino;