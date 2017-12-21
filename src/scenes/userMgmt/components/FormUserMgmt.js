import React, {Component} from 'react'
import {message, Modal} from 'antd'
import WrappedForm from '../../../components/WrappedForm'
import {Redirect} from 'react-router';
import queryString from 'query-string';

var query;
var mode;
var nextUrl = '/';
class FormUserMgmt extends Component {
//Casi tracciati
//Signup
//Login
//RequestPasswordReset
//ChangePassword (unico a utente loggato)
//ResetPassword

componentWillMount = () =>{
	query = queryString.parse(this.props.location.search);
  	mode = query.mode;
  	this.props.setMode(mode);
  	var modeTxt = null;
    if (mode==='resetPassword') this.props.verifyCode(query.oobCode);
  	if (this.props.email) {this.props.changeEditedSignup('email', this.props.email);}
  	switch(mode)
  	{
  		case 'changePassword': 
  		case 'resetPassword':
  				modeTxt = 'Scegli una nuova password'; break;
  		default:
  				modeTxt = '';
  	}
  	if (modeTxt) this.props.setHeaderInfo(modeTxt);
}	



componentDidUpdate = () =>{

const redoLogin = () =>{
	mode='login'; nextUrl = '/userMgmt?mode=changePassword'; this.props.signOutUser(); this.props.history.push('/userMgmt?mode=login');
}
const redirectHome = () => {
this.props.resetState();
this.props.history.push(nextUrl);	
}

if (this.props.editedItem.userMgmtState === 'passwordChangeOK') {this.props.resetState(); message.info("Cambio password effettuato",2,redirectHome());}
if (this.props.editedItem.userMgmtState === 'loginOK') {this.props.resetState(); message.info("Login effettuato",2,redirectHome()); nextUrl = '/';}
if (this.props.editedItem.userMgmtState === 'signupOK') {this.props.resetState(); message.info("Utente creato e login effettuato",2,redirectHome());}
if (this.props.editedItem.userMgmtState === 'codeKO') {mode='requestPasswordReset'; this.props.resetState(); this.props.history.push('/userMgmt?mode=requestPasswordReset');} 
if (this.props.editedItem.userMgmtState === 'passwordChangeKO' && mode === 'changePassword') 
	{   Modal.confirm({
    		title: 'Impossibile cambiare la password',
    		content: 'Per cambiare la password devi fare di nuovo il login. Procedo?',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {redoLogin();
    			
    		},
    		onCancel() {redirectHome();
    		},});
	}


//message.error("Impossibile cambiare password. Effettua il login",2,() => {this.props.signOutUser(); this.props.history.push('/login')});

	
}



//E' la classe madre che disambigua i diversi campi... checkbox da input normali...
onChange = (name, value) => {
	   	this.props.changeEditedSignup(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	this.props.submitEditedSignup(this.props.editedItem.isValid, this.props.editedItem.values, mode, query.oobCode); //Per sapere cosa fare... dopo
  }
 


//Modificata in modo da essere polimorfica...
//Se viene chiamata con una email nelle props...
//Serve a fare cambio password


  render() {
  	const formValues = this.props.editedItem.values;
  	const errorMessages = this.props.editedItem.errorMessages;
  	return (
  	  (this.props.editedItem.userMgmtState === 'mailOK') ?
  	  <span>
  	  Riceverei a breve una mail con un link per il reset della tua password.
  	  </span> 
  	    :
  		((this.props.authenticated) && (mode !== 'changePassword')) ? <Redirect to='/' /> :	
       
   	
       <WrappedForm formClass="signup-form" layout='horizontal' readOnlyForm={false} loading={false} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
     
           <WrappedForm.Input disabled={this.props.email!==undefined && this.props.email!==null} required={!this.props.email} label='Email' field='email' />
        {(mode!=='requestPasswordReset') ?
        <WrappedForm.Input required={true}  label='Password' type="password" field='password' />
        : null }
        
        {((mode!=='requestPasswordReset') && (mode!=='login')  ) ?
        
         <WrappedForm.Input  required={true} field='confirmPassword' label='Ripeti password' type='password'/>
        : null }
          
          
           <WrappedForm.GeneralError />	 
         {(mode==='requestPasswordReset') ? <WrappedForm.WrapGeneric><div>Inserisci la tua email per ricevere un link per il reset della password. </div></WrappedForm.WrapGeneric> : null}
         {(mode==='login') ?
         <WrappedForm.Group>
           <WrappedForm.Checkbox formColumnLayout={{span:12}} field='remember'>Ricordami</WrappedForm.Checkbox>
           <WrappedForm.WrapGeneric><div><a className="login-form-forgot" href="/userMgmt?mode=requestPasswordReset">Password dimenticata?</a></div></WrappedForm.WrapGeneric>
         </WrappedForm.Group> :
         null}
        
           
        <WrappedForm.Button type="primary" htmlType="submit" className="login-form-button"> {(this.props.email || mode==='resetPassword') ? 'Cambia password': (mode==='requestPasswordReset') ? 'Richiedi il link' : (mode==='login') ? 'Accedi' : 'Registrati'}</WrappedForm.Button>
       {(mode==='signup') ? <WrappedForm.WrapGeneric><div>Hai già un account? <a href="/userMgmt?mode=login">esegui il login</a></div></WrappedForm.WrapGeneric> : null}
       {(mode==='requestPasswordReset') ? <WrappedForm.WrapGeneric><div>Ricordi la password? <a href="/userMgmt?mode=login">esegui il login</a></div></WrappedForm.WrapGeneric> : null}
       {(mode==='login') ? <WrappedForm.WrapGeneric><div>Oppure <a href="/userMgmt?mode=signup">registrati ora</a></div></WrappedForm.WrapGeneric> : null}
      
       </WrappedForm>
    )
  }
}
export default FormUserMgmt;