import React from 'react';
import {Col, FormGroup, ControlLabel, FormControl, Checkbox, HelpBlock, Button, ButtonToolbar} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Control, Errors, actions as ActionsForm} from 'react-redux-form';

import { isValidEAN, generateEAN, getBookByEAN13} from '../helpers/ean';
 
import * as Actions from '../actions/bolle';
import * as ActionsRigaBolla from '../actions/rigaBolla'



class FormRigaBolla extends React.Component {
EANerrorShow = false;  

updatePrice = (model,value) => {
   return(dispatch) => {this.props.actionsRigaBolla.updatePriceFromDiscount(model,value,this.props.formRigaBolla);}
}

updateTotalPriceFromPezzi = (model,value) => {
  return(dispatch) => {this.props.actionsRigaBolla.updateTotalPriceFromPezzi(value,this.props.formRigaBolla);}
}

updateTotalPriceFromPrice = (model,value) => {
  return(dispatch) => {this.props.actionsRigaBolla.updateTotalPriceFromPrice(value,this.props.formRigaBolla);}
}

toggleManSconto = (model,value) => {
  return(dispatch) => {this.props.actionsRigaBolla.toggleManSconto(value,this.props.formRigaBolla);}
}

EANChange = (model,value) => {
  return(dispatch) => 
  {
  this.props.actionsForm.change(model,value);
  if (value.length == 13) {
     this.EANerrorShow = true;
    this.props.actionsRigaBolla.processEAN(value,this.props.formRigaBolla);
  }
  }
}


//Campo EAN gestisco diversamente
EANonKeyDown = (event) =>
  {   
  if (event.which === 13) {
      if (!this.props.formRigaBolla.ean.valid) /* Enter */ {
          this.EANerrorShow = true;
          event.preventDefault();
          this.props.actionsRigaBolla.changeCodeToEAN(this.props.formRigaBolla);
          }
 
     }
  else  if (event.which != 9) this.props.actionsRigaBolla.staleCode(this.props.formRigaBolla); //Utente ha scritto ma non ha ancora battuto invio gestisco nella change se è lungo 13
}

handleSubmit = (values) => {
  if (this.props.selectedRigaBolla) this.props.actions.aggiornaRigaBolla(1,values,this.props.selectedRigaBolla);
  if (!this.props.selectedRigaBolla) this.props.actions.aggiungiRigaBolla(1,values);
  this.cancelForm();
}

cancelForm = () => {
  this.props.actionsForm.reset("form2.rigaBolla");
  this.EANerrorShow = false;
  this.props.actionsRigaBolla.staleCode(this.props.formRigaBolla);
  this.props.actions.setSelectedRigaBolla(null);
   this.props.actionsRigaBolla.eanFocus();
}

componentDidMount = () => {
  this.props.actionsRigaBolla.staleCode(this.props.formRigaBolla);
  this.props.actionsRigaBolla.eanFocus();
}

  render() {
    const { formRigaBolla} = this.props;
    const toggleMan = formRigaBolla.manSconto.value;
    const enableSubmitButton = this.props.formRigaBolla.$form.valid;
     return(
           <Form model="form2.rigaBolla" autoComplete="off" className="form-horizontal" onSubmit={v => this.handleSubmit(v)}>
         
          <div className="form-group">
           <Col sm={3}>
             <FormGroup controlId="ean"  onKeyDown={this.EANonKeyDown} validationState={((this.EANerrorShow) && (!formRigaBolla.ean.valid)) ? "error" : null}>
                   <ControlLabel>EAN: </ControlLabel>
                    <Control.text model=".ean" component={FormControl}  changeAction={this.EANChange} />
                    <HelpBlock>
                    <Errors
                         model=".ean"
                         messages={{
                            isValidCode: 'EAN o codice + INVIO',
                            isValidEan: 'EAN non valido',
                            EANFound: 'EAN non trovato'
                        }}
                        show={this.EANerrorShow}
                    />
                    </HelpBlock>
             </FormGroup>
           </Col>  
           <Col sm={4}>
             <FormGroup controlId="titolo" validationState={formRigaBolla.titolo.valid ? null : "error"}>
                   <ControlLabel>Titolo: </ControlLabel>
                    <Control.text model=".titolo" disabled component={FormControl}/>
                    <HelpBlock>
                    <Errors
                         model=".titolo"
                         messages={{
                            isRequired: 'Please provide an email address.',
                            isEmail: 'Please provide an email address.',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>  
          </Col>  
           <Col sm={3}>
             <FormGroup controlId="autore" validationState={formRigaBolla.autore.valid ? null : "error"}>
                   <ControlLabel>Autore: </ControlLabel>
                    <Control.text model=".autore" disabled component={FormControl}/>
                    <HelpBlock>
                    <Errors
                         model=".autore"
                         messages={{
                            isRequired: 'Please provide an email address.',
                            isEmail: 'Please provide an email address.',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>   
          </Col>
           <Col sm={2} >
             <FormGroup controlId="prezzoListino" validationState={formRigaBolla.prezzoListino.valid ? null : "error"}>
                   <ControlLabel>Listino: </ControlLabel>
                    <Control.text model=".prezzoListino" disabled component={FormControl} changeAction={this.updatePrice}/>
                    <HelpBlock>
                    <Errors
                         model=".prezzoListino"
                         messages={{
                            isRequired: 'Please provide an email address.',
                            isEmail: 'Please provide an email address.',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
           </Col>  
          </div>
          <div className="form-group">
           <Col sm={1}>
             <FormGroup controlId="sconto1"  validationState={formRigaBolla.sconto1.valid ? null : "error"}>
                   <ControlLabel>Sc.1: </ControlLabel>
                    <Control.text model=".sconto1" disabled={toggleMan} component={FormControl} changeAction={this.updatePrice}/>
                    
                    <HelpBlock>
                    <Errors
                         model=".sconto1"
                         messages={{
                            isPercentage: '(0-99)',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
          </Col>
          <Col sm={1}>
            <FormGroup controlId="sconto2" validationState={formRigaBolla.sconto2.valid ? null : "error"}>
                   <ControlLabel>Sc.2: </ControlLabel>
                    <Control.text model=".sconto2" disabled={toggleMan} component={FormControl} changeAction={this.updatePrice}/>
                    <HelpBlock>
                    <Errors
                         model=".sconto2"
                         messages={{
                            isPercentage: '(0-99)',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
           </Col>
          <Col sm={1}>
             <FormGroup controlId="sconto3" validationState={formRigaBolla.sconto3.valid ? null : "error"}>
                   <ControlLabel>Sc.3: </ControlLabel>
                    <Control.text model=".sconto3" disabled={toggleMan} component={FormControl} changeAction={this.updatePrice}/>
                    <HelpBlock>
                    <Errors
                         model=".sconto3"
                         messages={{
                            isPercentage: '(0-99)',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
          </Col>
           <Col sm={1}>
             <FormGroup controlId="manSconto">
                   <ControlLabel>Man. </ControlLabel>
                    <Control.checkbox model=".manSconto" changeAction={this.toggleManSconto} component={Checkbox}/>
             </FormGroup>
           </Col>
         
          <Col sm={2}>
             <FormGroup controlId="prezzoUnitario" validationState={formRigaBolla.prezzoUnitario.valid ? null : "error"}>
                   <ControlLabel>Prezzo: </ControlLabel>
                    <Control.text model=".prezzoUnitario" disabled={!toggleMan} changeAction={this.updateTotalPriceFromPrice} component={FormControl} />
                    <HelpBlock>
                    <Errors
                         model=".sconto3"
                         messages={{
                            isNaN: 'Inserire importo',
    
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
          </Col>  
  <Col sm={2}>
          <FormGroup controlId="pezzi" validationState={formRigaBolla.pezzi.valid ? null : "error"}>
                   <ControlLabel>Quantità: </ControlLabel>
                    <Control.text model=".pezzi"  changeAction={this.updateTotalPriceFromPezzi} component={FormControl}/>
                    <HelpBlock>
                    <Errors
                         model=".pezzi"
                         messages={{
                            isPositive: 'numero',
               
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
  </Col>  
  <Col sm={2}>
          <FormGroup controlId="gratis" validationState={formRigaBolla.gratis.valid ? null : "error"}>
                   <ControlLabel>Gratis: </ControlLabel>
                    <Control.text model=".gratis" component={FormControl}
                    validators={{
                        isNumber: (val) => val >= 0,
                        }}
                    validateOn={["change", "blur"]}   
                    />
                    <HelpBlock>
                    <Errors
                         model=".gratis"
                         messages={{
                            isNumber: 'numero',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>      
  </Col>  
  <Col sm={2}>
            <FormGroup controlId="prezzoTotale" validationState={formRigaBolla.prezzoTotale.valid ? null : "error"}>
                   <ControlLabel>Totale: </ControlLabel>
                    <Control.text model=".prezzoTotale" component={FormControl}/>
                    <HelpBlock>
                    <Errors
                         model=".prezzoTotale"
                         messages={{
                            isRequired: 'Please provide an email address.',
                            isEmail: 'Please provide an email address.',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
          </Col>  
          </div>
             <ButtonToolbar>
              <Button type="submit" disabled={!enableSubmitButton} bsStyle="primary" bsSize="large" active={!enableSubmitButton}>{(this.props.selectedRigaBolla) ? 'Modifica' :' Inserisci'} </Button>
              <Button type="button" onClick={this.cancelForm} bsSize="large" active>Annulla</Button>
             </ButtonToolbar>
          </Form>
           

    );
  }
}
//<button action="submit" className="btn btn-primary">Inserisci</button>
//  <Button action="submit" active={enableSubmitButton} disabled={!enableSubmitButton} className="btn btn-primary">Inserisci</Button>

function mapStateToProps(state) {
  return {
    discountGroupDisabled: state.bolle.discountGroupDisabled,
    formRigaBolla: state.form2.forms.rigaBolla ,
        }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
    actionsRigaBolla: bindActionCreators(ActionsRigaBolla, dispatch),
    actionsForm: bindActionCreators(ActionsForm, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormRigaBolla);