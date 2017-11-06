import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
import {Redirect} from 'react-router';

class FormSignup extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedSignup(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	this.props.submitEditedSignup(this.props.editedItem.isValid, this.props.editedItem.values); //Per sapere cosa fare... dopo
  }
 




  render() {
  	const formValues = this.props.editedItem.values;
  	const errorMessages = this.props.editedItem.errorMessages;
  	
  	return (
  	this.props.authenticated ? <Redirect to='/' /> :	
       
        <WrappedForm formClass="signup-form" layout='horizontal' readOnlyForm={false} loading={false} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
     
           <WrappedForm.Input required={true} label='Email' field='email' />
        <WrappedForm.Input required={true}  label='Password' type="password" field='password' />
         <WrappedForm.Input  required={true} field='confirmPassword' label='Ripeti password' type='password'/>
        
           <WrappedForm.GeneralError />	 
           
        <WrappedForm.Button type="primary" htmlType="submit" className="signup-form-button"> Registrati</WrappedForm.Button>
       <WrappedForm.WrapGeneric><div>Hai già un account? <a href="">esegui il login</a></div></WrappedForm.WrapGeneric>
       </WrappedForm>
    )
  }
}
export default FormSignup;