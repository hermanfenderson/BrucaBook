import React, {Component} from 'react'
import {message, Modal} from 'antd'
import WrappedForm from '../../../components/WrappedForm'
import {Redirect} from 'react-router';
import queryString from 'query-string';

var query;
var mode;
var nextUrl = '/';
var buttonText;
class FormUserMgmt extends Component {
//Casi tracciati
//Signup
//Login
//RequestPasswordReset
//ChangePassword (unico a utente loggato)
//ResetPassword
initMode = () => {
	this.props.setMode(mode);
  	var modeTxt = null;
    if (mode==='resetPassword') this.props.verifyCode(query.oobCode);
  	if (this.props.info) 
  		{
  		this.props.changeEditedSignup('email', this.props.info.email);
  		this.props.changeEditedSignup('nome', this.props.info.nome);
  		this.props.changeEditedSignup('cognome', this.props.info.cognome);
  		this.props.changeEditedSignup('nick', this.props.info.nick);
  		this.props.changeEditedSignup('imgFirebaseUrl', this.props.info.imgFirebaseUrl);
  		}
  	switch(mode)
  	{
  		case 'changePassword': 
  		case 'resetPassword':
  				modeTxt = 'Scegli una nuova password'; break;
  		case 'configuration':
  				modeTxt = 'Configurazione utente'; break;
  		default:
  				modeTxt = '';
  	}
  	if (modeTxt) this.props.setHeaderInfo(modeTxt);
    switch(mode)
  		{
  			case 'resetPassword':
  			case 'changePassword':
  			buttonText = 'Cambia password'; break;
  			case 'requestPasswordReset':
  			buttonText = 'Richiedi il link'; break;
  			case 'login': 
  			buttonText = 'Accedi'; break;
  			case 'configuration': 
  			buttonText = 'Aggiorna'; break;
  			default:
  			buttonText = 'Registrati'; break;
  		}
	
}
componentWillMount = () =>{
	query = queryString.parse(this.props.location.search);
  	mode = query.mode;
  	this.initMode();
}	



componentDidUpdate = () =>{
	query = queryString.parse(this.props.location.search);
    if (mode !== query.mode)
    	{
    		mode = query.mode;
    		this.initMode();
    	}

const redoLogin = () =>{
	mode='login'; nextUrl = '/userMgmt?mode=changePassword'; this.props.signOutUser(); this.props.history.push('/userMgmt?mode=login');
}
const redirectHome = () => {
this.props.resetState();
this.props.history.push(nextUrl);	
this.props.setMenuSelectedKeys([]);
return(0);
}

if (this.props.editedItem.userMgmtState === 'passwordChangeOK') {this.props.resetState(); message.info("Cambio password effettuato",2,redirectHome());}
if (this.props.editedItem.userMgmtState === 'changeOK') {this.props.resetState(); message.info("Configurazione aggiornata",2,redirectHome());}

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
  		((this.props.authenticated) && ((mode !== 'changePassword')&&(mode !== 'configuration'))) ? <Redirect to='/' /> :	
       
   	
       <WrappedForm formClass="signup-form" layout='horizontal' readOnlyForm={false} loading={false} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
     
           <WrappedForm.Input disabled={(this.props.authenticated)} required={!this.props.authenticated} label='Email' field='email' />
        
        {((mode === 'signup')||(mode === 'configuration')) ?
        <WrappedForm.Input disabled={(mode === 'configuration')} required={(mode === 'signup')} label='Nome' field='nome' />
        : null }
        
         {((mode === 'signup')||(mode === 'configuration')) ?
        <WrappedForm.Input disabled={(mode === 'configuration')} required={(mode === 'signup')}   label='Cognome' field='cognome' />
        : null }
          {(mode === 'configuration') ?
        <WrappedForm.Input required={(mode === 'configuration')} label='Nick' field='nick' />
        : null }
        
          {(mode === 'configuration') ?
        <WrappedForm.ImageUploader label='Avatar' field='imgFirebaseUrl' fullName={'images/avatars/'+this.props.uid+'.jpg'} />
        : null }
        
          {(mode === 'configuration') ?
        <WrappedForm.SelectBookstore required={(mode === 'configuration')} defaultCatena={this.props.info.catena} defaultLibreria={this.props.info.libreria} 
bookstoresList={this.props.info.elencoLibrerie} label='Libreria' field='libreria' />
        : null }
        
       
       
        {((mode!=='requestPasswordReset') && (mode!=='configuration')) ?
        <WrappedForm.Input required={true}  label='Password' type="password" field='password' />
        : null }
        
        {((mode!=='requestPasswordReset') && (mode!=='configuration') && (mode!=='login')  ) ?
        
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
        
           
        <WrappedForm.Button type="primary" htmlType="submit" className="login-form-button"> {buttonText} </WrappedForm.Button>
       {(mode==='signup') ? <WrappedForm.WrapGeneric><div>Hai già un account? <a href="/userMgmt?mode=login">esegui il login</a></div></WrappedForm.WrapGeneric> : null}
       {(mode==='requestPasswordReset') ? <WrappedForm.WrapGeneric><div>Ricordi la password? <a href="/userMgmt?mode=login">esegui il login</a></div></WrappedForm.WrapGeneric> : null}
       {(mode==='login') ? <WrappedForm.WrapGeneric><div>Oppure <a href="/userMgmt?mode=signup">registrati ora</a></div></WrappedForm.WrapGeneric> : null}
      
       </WrappedForm>
    )
  }
}
export default FormUserMgmt;