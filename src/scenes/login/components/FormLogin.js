import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom';

import WrappedForm from '../../../components/WrappedForm'
import {Icon} from 'antd';

class FormLogin extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedLogin(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
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
    <WrappedForm formClass="login-form" layout='horizontal' readOnlyForm={false} loading={false} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
     
           <WrappedForm.Input required={true} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" field='email' />
        <WrappedForm.Input required={true} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" field='password' />
           <WrappedForm.GeneralError />	 
           <WrappedForm.Group>
           <WrappedForm.Checkbox formColumnLayout={{span:12}} field='remember'>Ricordami</WrappedForm.Checkbox>
           <WrappedForm.WrapGeneric><div><a className="login-form-forgot" href="">Password dimenticata?</a></div></WrappedForm.WrapGeneric>
           </WrappedForm.Group>
           
        <WrappedForm.Button type="primary" htmlType="submit" className="login-form-button"> Login</WrappedForm.Button>
       <WrappedForm.WrapGeneric><div>Oppure <Link to="/signup">registrati ora</Link></div></WrappedForm.WrapGeneric>
       </WrappedForm>
    )
  }
}




export default FormLogin;

