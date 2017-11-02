import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
import {Redirect} from 'react-router';

class FormLogin extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedLogin(name, value)};
		
onSubmit = () => {
	this.props.submitEditedLogin(this.props.editedItem.isValid, this.props.editedItem.values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedLogin();
}



  render() {
  	const formValues = this.props.editedItem.values;
  	const errorMessages = this.props.editedItem.errorMessages;
  	
  	return (
  	this.props.authenticated ? <Redirect to='/' /> :	
     <WrappedForm onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
           <WrappedForm.Input field='email' label='Email'/>
        <WrappedForm.Input field='password' label='Password' type='password'/>
           <WrappedForm.GeneralError error readOnly/>	 
        <WrappedForm.Button primary disabled={!this.props.editedItem.isValid} width={4}>{'Login'}</WrappedForm.Button>
      
       </WrappedForm>
    )
  }
}
export default FormLogin;