import React from 'react';
import {Row, Col, FormGroup, ControlLabel, FormControl, Checkbox, HelpBlock} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Control, Errors, actions as ActionsForm} from 'react-redux-form';

import { isValidEAN, generateEAN, getBookByEAN13} from '../helpers/ean';
 
import * as Actions from '../actions';
import * as ActionsRigaBolla from '../actions/rigaBolla'



class FormRigaBolla extends React.Component {
  
updatePrice = (model,value) => {
   this.props.actionsRigaBolla.updatePriceFromDiscount(model,value,this.props.formRigaBolla);
}

getEANCode = (model,value) => {
  this.props.actionsForm.change(model,value);
}

//Campo EAN gestisco diversamente
EANonKeyPress = (event) =>
  { 
  if (event.which === 13 /* Enter */) {
     event.preventDefault();
    }
}

  render() {
    const { formRigaBolla} = this.props;
     return(
           <Form model="form2.rigaBolla"  className="form-horizontal" onSubmit={v => console.log(v)}>
         
          <div className="form-group">
           <Col sm={3}>
             <FormGroup controlId="ean" onKeyPress={this.EANonKeyPress} validationState={formRigaBolla.ean.valid ? null : "error"}>
                   <ControlLabel>EAN: </ControlLabel>
                    <Control.text model=".ean" component={FormControl} />
                    <HelpBlock>
                    <Errors
                         model=".ean"
                         messages={{
                            required: 'Inserisci codice.',
                            isEmail: 'Please provide an email address.',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>
           </Col>  
           <Col sm={4}>
             <FormGroup controlId="titolo" validationState={formRigaBolla.titolo.valid ? null : "error"}>
                   <ControlLabel>Titolo: </ControlLabel>
                    <Control.text model=".titolo" component={FormControl}/>
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
                    <Control.text model=".autore" component={FormControl}/>
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
                    <Control.text model=".prezzoListino" component={FormControl} changeAction={this.updatePrice}/>
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
             <FormGroup controlId="sconto1" validationState={formRigaBolla.sconto1.valid ? null : "error"}>
                   <ControlLabel>Sc.1: </ControlLabel>
                    <Control.text model=".sconto1" component={FormControl} changeAction={this.updatePrice}/>
                    
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
                    <Control.text model=".sconto2" component={FormControl} changeAction={this.updatePrice}/>
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
                    <Control.text model=".sconto3" component={FormControl} changeAction={this.updatePrice}/>
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
                    <Control.checkbox model=".manSconto" component={Checkbox}/>
             </FormGroup>
           </Col>
         
          <Col sm={2}>
             <FormGroup controlId="prezzoUnitario" validationState={formRigaBolla.prezzoUnitario.valid ? null : "error"}>
                   <ControlLabel>Prezzo: </ControlLabel>
                    <Control.text model=".prezzoUnitario" component={FormControl} />
                    <HelpBlock>
                    <Errors
                         model=".sconto3"
                         messages={{
                            isRequired: 'Please provide an email address.',
                            isEmail: 'Please provide an email address.',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
          </Col>  
  <Col sm={2}>
          <FormGroup controlId="pezzi" validationState={formRigaBolla.pezzi.valid ? null : "error"}>
                   <ControlLabel>Quantità: </ControlLabel>
                    <Control.text model=".pezzi" component={FormControl}/>
                    <HelpBlock>
                    <Errors
                         model=".pezzi"
                         messages={{
                            isRequired: 'Please provide an email address.',
                            isEmail: 'Please provide an email address.',
                        }}
                    />
                    </HelpBlock>
             </FormGroup>     
  </Col>  
  <Col sm={2}>
          <FormGroup controlId="gratis" validationState={formRigaBolla.gratis.valid ? null : "error"}>
                   <ControlLabel>Gratis: </ControlLabel>
                    <Control.text model=".gratis" component={FormControl}/>
                    <HelpBlock>
                    <Errors
                         model=".gratis"
                         messages={{
                            isRequired: 'Please provide an email address.',
                            isEmail: 'Please provide an email address.',
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

            <button action="submit" className="btn btn-primary">Inserisci</button>
            
          </Form>
           

    );
  }
}

function mapStateToProps(state) {
  return {
    discountGroupDisabled: state.bolle.discountGroupDisabled,
    formRigaBolla: state.form2.forms.rigaBolla 
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