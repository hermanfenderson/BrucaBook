import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Row, Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isValidEAN, generateEAN, getBookByEAN13} from '../helpers/ean';
 
import * as Actions from '../actions';
const initialEmpty = {'sconto1': 0, 'sconto2': 0, 'sconto3': 0, 'gratis': 0};   

const validate = values => {
  const errors = {};
  if (!values.ean) {
    errors.ean = "Inserisci il codice prodotto";
  } else if (/[^0-9]+/i.test(values.ean)) {
    errors.ean = 'NON è un numero'
  }
  
  if (!((values.sconto1 >= 0) && (values.sconto1 < 100))) errors.sconto1 = "tra 0 e 100";
  if (!((values.sconto2 >= 0) && (values.sconto2 < 100))) errors.sconto2 = "tra 0 e 100";
  if (!((values.sconto3 >= 0) && (values.sconto3 < 100))) errors.sconto3 = "tra 0 e 100";
  
 if (!(values.pezzi>0)) errors.pezzi = "Numero";
 if (!(values.gratis>=0)) errors.gratis = "Numero";
  
  return errors;
};


function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto1/100) * prezzoListino))).toFixed(2);      
}


class FormRigaBolla extends React.Component {


   getBookByCode = () => {
       if (this.props.formState.values['ean']) 
          {
          var book = {};
          var code = this.props.formState.values['ean'];
          if ((code > 0) && (code.length < 12)) 
              {
              code = generateEAN(code); 
              this.props.change('ean',code);
              }
          if ((code.length === 13) && (isValidEAN(code))) {
              console.log("sono qui");
        
              book = getBookByEAN13(code);
              if (book['titolo'])
                {
                 this.props.change('titolo',book.titolo);
                this.props.change('autore',book.autore);
                this.props.change('prezzoListino',book.prezzo);
                this.props.change('pezzi',1);
                if (!this.props.formState.values['manSconto']) 
                     {
                      var tmp = discountPrice(book.prezzo,this.props.formState.values['sconto1'],this.props.formState.values['sconto2'],this.props.formState.values['sconto3']);
                      this.props.change(['prezzoUnitario'],tmp);
                      this.props.change(['prezzoTotale'],tmp); 
                     } 
               else 
                     {
                     this.props.change('prezzoUnitario',book.prezzo);
                     this.props.change('prezzoTotale',book.prezzo);
                     }  
                 this.pezziInput.focus();
                 }
               else 
                  {
                  this.props.change('ean',"");
                  this.EANInput.focus();
                  }
            }
          }  
     
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

toggleSconto = (value) =>
{
  if (value === true) this.props.actions.toggleScontoMan();
  if (value === false) this.props.actions.toggleScontoAut();
  return value;
  
}
  
  onKeyPress = (event) =>
  {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
      this.getBookByCode();
    }
}
  
 clearForm = () => {
   //this.props.actions.clearForm(initialEmpty);
 }
  
  handleFormSubmit = (values) => {
   //Se arrivo qui ma non ho finito...
 //  this.props.eanInputRef.focus();
    if (!values['manSconto']) values['manSconto'] = false;
    if (values.pezzi > 0) {this.props.actions.aggiornaRigaBolla(1,values);}  //Controllo insufficiente...rischio di fare un casino...
    else this.getBookByCode(values.ean,values.ean,values);
    this.props.eanInputRef.focus();
  };

renderEANField = ({input, onBlur, label, type, disabled, meta: { touched, error, active } }) => 
  {
  return (
    <fieldset className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label className="control-label">{label}</label>
      <div>
        <input {...input}  ref={(input) => { this.props.actions.setEANInputRef(input); this.EANInput = input; }} onKeyPress={this.onKeyPress} onBlur={onBlur} disabled={disabled} className="form-control" type={type} />
        {touched && error && <div className="help-block">{error}</div>}
      </div>
    </fieldset>
  );
}  

renderField = ({input, label, type, disabled,  meta: { touched, error, active } }) => 
  {
  return (
    <fieldset className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label className="control-label">{label}</label>
      <div>
        <input {...input}   disabled={disabled} className="form-control" type={type} />
        {touched && error && <div className="help-block">{error}</div>}
      </div>
    </fieldset>
  );
}

renderFieldPezzi = ({input, label, type, disabled,  meta: { touched, error, active } }) => 
  {
  return (
    <fieldset className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label className="control-label">{label}</label>
      <div>
        <input {...input}  ref={(input) => { this.pezziInput = input; }} disabled={disabled} className="form-control" type={type} />
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

  
  componentDidMount()
     {
       this.EANInput.focus();
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
            <Field name="ean" disabled={false} component={this.renderEANField} className="form-control" type="text" label="EAN" onBlur={this.getBookByCode}/>
          </Col>  
           <Col sm={4}>
            <Field name="titolo"  disabled={true} component={this.renderField} className="form-control" type="text" label="Titolo"/>
          </Col>  
           <Col sm={3}>
            <Field name="autore" disabled={true} component={this.renderField} className="form-control" type="text" label="Autore"/>
           </Col>
           <Col sm={2} >
            <Field name="prezzoListino" disabled={true} component={this.renderField} className="form-control" type="text" label="Listino" normalize={this.calculateDiscountPrice}/>
          </Col>  
    
          </div>
          <div className="form-group">
           <Col sm={1}>
            <Field name="sconto1" disabled={this.props.discountGroupDisabled} component={this.renderField} className="form-control" type="text" label="Sc.1" normalize={this.calculateDiscountPrice}/>
          </Col>
          <Col sm={1}>
            <Field name="sconto2" disabled={this.props.discountGroupDisabled} component={this.renderField} className="form-control" type="text" label="Sc.2" normalize={this.calculateDiscountPrice}/>
          </Col>
          <Col sm={1}>
            <Field name="sconto3" disabled={this.props.discountGroupDisabled} component={this.renderField} className="form-control" type="text" label="Sc.3" normalize={this.calculateDiscountPrice}/>
          </Col>
           <Col sm={1}>
            <Field name="manSconto" disabled={false} component={this.renderField} className="form-control" type="checkbox" label="Man." normalize={this.toggleSconto}/>
          </Col>
         
          <Col sm={2}>
            <Field name="prezzoUnitario" disabled={!this.props.discountGroupDisabled} component={this.renderField} className="form-control" type="text" label="Prezzo" normalize={this.calculateTotal}/>
          </Col>  
  <Col sm={2}>
            <Field name="pezzi" disabled={false}  component={this.renderFieldPezzi} className="form-control" type="text" label="Quantità"  normalize={this.calculateTotal}/>
          </Col>  
  <Col sm={2}>
            <Field name="gratis" disabled={false} component={this.renderField} className="form-control" type="text" label="Gratis"/>
          </Col>  
  <Col sm={2}>
            <Field name="prezzoTotale" disabled={true} component={this.renderField} className="form-control" type="text" label="Totale"/>
          </Col>  
          </div>

            <button action="submit" className="btn btn-primary">Inserisci</button>
            <button onClick={this.clearForm()} className="btn btn-primary">Annulla</button>
        
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
    discountGroupDisabled: state.bolle.discountGroupDisabled,
    formState: state.form.rigaBolla,
    eanInputRef: state.bolle.eanInputRef
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
  initialValues: initialEmpty
})(FormRigaBolla));