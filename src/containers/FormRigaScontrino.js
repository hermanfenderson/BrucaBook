import React from 'react';
import {Row, Col, FormGroup, ControlLabel, FormControl, Checkbox, HelpBlock, Button, ButtonToolbar} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Control, Errors, actions as ActionsForm} from 'react-redux-form';

import { isValidEAN, generateEAN} from '../helpers/ean';
 
import * as Actions from '../actions/scontrini';
import * as ActionsRigaScontrino from '../actions/rigaScontrino'



class FormRigaScontrino extends React.Component {
EANerrorShow = false;  

updatePrice = (model,value) => {
   return(dispatch) => {this.props.actionsRigaScontrino.updatePriceFromDiscount(model,value,this.props.values);}
}

updateTotalPriceFromPezzi = (model,value) => {
  return(dispatch) => {this.props.actionsRigaScontrino.updateTotalPriceFromPezzi(value,this.props.values);}
}

updateTotalPriceFromPrice = (model,value) => {
  return(dispatch) => {this.props.actionsRigaScontrino.updateTotalPriceFromPrice(value,this.props.values);}
}

toggleManSconto = (model,value) => {
  return(dispatch) => {this.props.actionsRigaScontrino.toggleManSconto(value,this.props.values);}
}

EANChange = (model,value) => {
  return(dispatch) => 
  {
  this.props.actionsForm.change(model,value);
  if (value.length == 13) {
     this.EANerrorShow = true;
    this.props.actionsRigaScontrino.processEAN(value,this.props.values);
  }
  }
}


//Campo EAN gestisco diversamente
EANonKeyDown = (event) =>
  {   
  if (event.which === 13) {
      if (!this.props.form.ean.valid) /* Enter */ {
          this.EANerrorShow = true;
          event.preventDefault();
          this.props.actionsRigaScontrino.changeCodeToEAN(this.props.values);
          }
 
     }
  else  if (event.which != 9) this.props.actionsRigaScontrino.staleCode(); //Utente ha scritto ma non ha ancora battuto invio gestisco nella change se è lungo 13
}

handleSubmit = (values) => {
//Serve imgUrl perchè non è esplicitata nel form
 var valuesImg = {...values};
 valuesImg['imgUrl'] = '';
 if (this.props.values.imgUrl) valuesImg['imgUrl'] = this.props.values.imgUrl;
  if (this.props.selectedRigaScontrinoValues) this.props.actions.aggiornaRigaScontrino(this.props.cassaId, this.props.scontrinoId, valuesImg, this.props.selectedRigaScontrinoValues);
  if (!this.props.selectedRigaScontrinoValues) this.props.actions.aggiungiRigaScontrino(this.props.cassaId, this.props.scontrinoId, valuesImg);
  this.cancelForm();
}

cancelForm = () => {
  this.props.actionsForm.reset("form2.rigaScontrino");
  this.EANerrorShow = false;
  this.props.actionsRigaScontrino.staleCode();
  this.props.actions.setSelectedRigaScontrino(null);
  this.props.actionsRigaScontrino.setImgUrl('');
   this.props.actionsRigaScontrino.eanFocus();
}

componentDidMount = () => {
  this.props.actionsRigaScontrino.staleCode();
  this.props.actionsRigaScontrino.eanFocus();
}

  render() {
    const { form,values} = this.props;
    const toggleMan = values.manSconto;
    const enableSubmitButton = form.$form.valid;
     return(
           <Form model="form2.rigaScontrino" autoComplete="off"  onSubmit={v => this.handleSubmit(v)}>
           <Row>
           <Col sm={4}>
             <FormGroup controlId="ean"  onKeyDown={this.EANonKeyDown} validationState={((this.EANerrorShow) && (!form.ean.valid)) ? "error" : null}>
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
           <Col sm={5}>
             <FormGroup controlId="titolo" validationState={form.titolo.valid ? null : "error"}>
                   <ControlLabel>Titolo: </ControlLabel>
                    <Control.text model=".titolo" disabled component={FormControl}/>
                    
             </FormGroup>  
          </Col>  
           <Col sm={3}>
             <FormGroup controlId="autore" validationState={form.autore.valid ? null : "error"}>
                   <ControlLabel>Autore: </ControlLabel>
                    <Control.text model=".autore" disabled component={FormControl}/>
        
             </FormGroup>   
          </Col>
          </Row>
          <Row>
           <Col sm={2} >
             <FormGroup controlId="prezzoListino" validationState={form.prezzoListino.valid ? null : "error"}>
                   <ControlLabel>Listino: </ControlLabel>
                    <Control.text model=".prezzoListino" disabled component={FormControl} changeAction={this.updatePrice}/>
             </FormGroup>     
           </Col>  
           <Col sm={2}>
             <FormGroup controlId="sconto"  validationState={form.sconto.valid ? null : "error"}>
                   <ControlLabel>Sconto: </ControlLabel>
                    <Control.text model=".sconto" disabled={toggleMan} component={FormControl} changeAction={this.updatePrice}/>
                    
                    <HelpBlock>
                    <Errors
                         model=".sconto"
                         messages={{
                            isPercentage: '(0-99)',
                        }}
                      
                    />
                    </HelpBlock>
             </FormGroup>     
          </Col>
         
           <Col sm={2}>
             <FormGroup controlId="manSconto">
                   <ControlLabel>Man. </ControlLabel>
                    <Control.checkbox model=".manSconto" changeAction={this.toggleManSconto} component={Checkbox}/>
             </FormGroup>
           </Col>
         
          <Col sm={2}>
             <FormGroup controlId="prezzoUnitario" validationState={form.prezzoUnitario.valid ? null : "error"}>
                   <ControlLabel>Prezzo: </ControlLabel>
                    <Control.text model=".prezzoUnitario" disabled={!toggleMan} changeAction={this.updateTotalPriceFromPrice} component={FormControl} />
                    <HelpBlock>
                    <Errors
                         model=".prezzoUnitario"
                         messages={{
                            isNaN: 'Inserire importo',
    
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
          </Col>  
  <Col sm={2}>
          <FormGroup controlId="pezzi" validationState={form.pezzi.valid ? null : "error"}>
                   <ControlLabel>Quantità: </ControlLabel>
                    <Control.text model=".pezzi"  changeAction={this.updateTotalPriceFromPezzi} component={FormControl}/>
                    <HelpBlock>
                    <Errors
                         model=".pezzi"
                         messages={{
                            isNumber: 'numero',
               
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
  </Col>  
  
  <Col sm={2}>
            <FormGroup controlId="prezzoTotale" validationState={form.prezzoTotale.valid ? null : "error"}>
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
          </Row>
              <ButtonToolbar>
              <Button type="submit" disabled={!enableSubmitButton} bsStyle="primary" bsSize="large" active={!enableSubmitButton}>{(this.props.selectedRigaBollaValues) ? 'Modifica' :' Inserisci'} </Button>
              <Button type="button" onClick={this.cancelForm} bsSize="large" active>Annulla</Button>
             </ButtonToolbar>
          </Form>
           

    );
  }
}

function mapStateToProps(state) {
  return {
    discountGroupDisabled: state.scontrini.discountGroupDisabled,
    form: state.form2.forms.rigaScontrino ,
    values: state.form2.rigaScontrino,
         }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
    actionsRigaScontrino: bindActionCreators(ActionsRigaScontrino, dispatch),
    actionsForm: bindActionCreators(ActionsForm, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormRigaScontrino);
