
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../actions';

const validate = values => {
  const errors = {};
  if (!values.ean) {
    errors.ean = "Inserisci il codice prodotto";
  } else if (/[^0-9]+/i.test(values.ean)) {
    errors.ean = 'NON è un numero'
  }

  if (!values.email) {
    errors.email = "Please enter an email.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = "Please enter a password.";
  }
  
  

  return errors;
};

function getBookByEAN13(ean13)
{
  const books = {"1": {"titolo": "I promessi sposi", "autore": "Alessandro Manzoni", "prezzo": "9.90"},
       "2": {"titolo": "Pinocchio", "autore": "Collodi", "prezzo": "5.00"},
       "3": {"titolo": "La fuga del cavallo morto", "autore": "Mauro Minenna", "prezzo": "5.90"}};  
  return books[ean13];
}

class FormRigaBolla extends React.Component {
  
  getBookByCodeOld = (code, active) => {
       console.log(active);
    //lo lancio solo se ho perso focus
    
   
    if (!active && code && (!(/[^0-9]+/i.test(code)))) {
       var book = getBookByEAN13(code);
       console.log(book);
       console.log(this.props);
       console.log(this.props.formState.values['ean']);
      //formState dentro props contiene tutto!!! Values, Fields...
      
       this.props.change('titolo',book.titolo);
      this.props.change('autore',book.autore);
      this.props.change('prezzoListino',book.prezzo);
      this.props.change('pezzi',1);
       }
  } 
  
  getBookByCode = (value, previousValue, allValues) => {
       var active = false;
       var code = value;
    //lo lancio solo se ho perso focus
    
   
    if (!active && code && (!(/[^0-9]+/i.test(code)))) {
       var book = getBookByEAN13(code);
       console.log(book);
       console.log(this.props);
       console.log(this.props.formState.values['ean']);
      //formState dentro props contiene tutto!!! Values, Fields...
      
       this.props.change('titolo',book.titolo);
      this.props.change('autore',book.autore);
      this.props.change('prezzoListino',book.prezzo);
      this.props.change('pezzi',1);
      this.calculateDiscountPrice(value,previousValue,allValues);
       }
     return value; 
  } 
  
  calculateDiscountPrice = (value, previousValue, allValues) => 
{   var tmp = allValues.prezzzoUnitario;
   if (!allValues.manSconto)
        {
        tmp = ((1 - allValues['sconto3']/100) *((1 - allValues['sconto2']/100) *((1 - allValues['sconto1']/100) * allValues['prezzoListino']))).toFixed(2);
        this.props.change('prezzoUnitario',tmp);
        }  
    this.props.change('prezzoTotale',(allValues.pezzi * tmp).toFixed(2));
   return value;                   
   };                      
   
calculateTotal = (value, previousValue, allValues) => 
{ 
    this.props.change('prezzoTotale',(allValues.pezzi * allValues.prezzoUnitario).toFixed(2));
    return value;
};
                      
  handleFormSubmit = (values) => {
   //Se arrivo qui ma non ho finito...
    if (values.pezzi > 0) {this.props.actions.aggiungiRigaBolla(1,values);}
    else this.getBookByCode(values.ean,false);
  };

  renderField = ({onBlur, input, label, type, meta: { touched, error, active } }) => 
  {
    const onBlurFunc = (onBlur ?  onBlur(input.value, active) :  onBlur);
  return (
    <fieldset className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label className="control-label">{label}</label>
      <div>
        <input onBlur={() => onBlurFunc} {...input}  className="form-control" type={type} />
        {touched && error && <div className="help-block">{error}</div>}
      </div>
    </fieldset>
  );
}

  renderAuthenticationError() {
    if (this.props.authenticationError) {
      return <div className="alert alert-danger">{ this.props.authenticationError }</div>;
    }
    return <div></div>;
  }

  render() {
    return(
      <div className="container">
           { this.renderAuthenticationError() }
 <Col sm={2}>
<img src="https://img.ibs.it/images/9788807032073_0_0_180_0.jpg"/>
 </Col>
<Col sm={9}>
          <form className="form-horizontal" onSubmit={this.props.handleSubmit(this.handleFormSubmit)}>
         
          <div className="form-group">
           <Col sm={3}>
            <Field name="ean" component={this.renderField} className="form-control" type="text" label="EAN" normalize={this.getBookByCode} onBlur={this.getBookByCodeTmp}/>
          </Col>  
           <Col sm={4}>
            <Field name="titolo" component={this.renderField} className="form-control" type="text" label="Titolo"/>
          </Col>  
           <Col sm={3}>
            <Field name="autore" component={this.renderField} className="form-control" type="text" label="Autore"/>
           </Col>
           <Col sm={2} >
            <Field name="prezzoListino" component={this.renderField} className="form-control" type="text" label="Listino" normalize={this.calculateDiscountPrice}/>
          </Col>  
    
          </div>
          <div className="form-group">
           <Col sm={1}>
            <Field name="sconto1" component={this.renderField} className="form-control" type="text" label="Sc.1" normalize={this.calculateDiscountPrice}/>
          </Col>
          <Col sm={1}>
            <Field name="sconto2" component={this.renderField} className="form-control" type="text" label="Sc.2" normalize={this.calculateDiscountPrice}/>
          </Col>
          <Col sm={1}>
            <Field name="sconto3" component={this.renderField} className="form-control" type="text" label="Sc.3" normalize={this.calculateDiscountPrice}/>
          </Col>
           <Col sm={1}>
            <Field name="manSconto" component={this.renderField} className="form-control" type="checkbox" label="Man."/>
          </Col>
         
          <Col sm={2}>
            <Field name="prezzoUnitario" component={this.renderField} className="form-control" type="text" label="Prezzo" normalize={this.calculateTotal}/>
          </Col>  
  <Col sm={2}>
            <Field name="pezzi" component={this.renderField} className="form-control" type="text" label="Quantità"  normalize={this.calculateTotal}/>
          </Col>  
  <Col sm={2}>
            <Field name="gratis" component={this.renderField} className="form-control" type="text" label="Gratis"/>
          </Col>  
  <Col sm={2}>
            <Field name="prezzoTotale" component={this.renderField} className="form-control" type="text" label="Totale"/>
          </Col>  
          </div>

            
            <button action="submit" className="btn btn-primary">Inserisci</button>
          </form>
</Col>
<Col sm={1}>
<Row> Copie: 23 </Row>
<Row> Gratis: 12 </Row>
<Row> Totale: 323,70 </Row>
 </Col>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticationError: state.auth.error,
    formState: state.form.rigaBolla
   }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps,  mapDispatchToProps)(reduxForm({
  form: 'rigaBolla', 
  validate,
  initialValues: {'sconto1': 0, 'sconto2': 0, 'sconto3': 0}
})(FormRigaBolla));