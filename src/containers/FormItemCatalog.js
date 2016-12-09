import React from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, ButtonToolbar} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Control, Errors, actions as ActionsForm} from 'react-redux-form';
import * as ActionsCatalog from '../actions/catalog';
import { isValidEAN, generateEAN} from '../helpers/ean';

class FormItemCatalog extends React.Component {

//Campo EAN gestisco diversamente
EANonKeyPress = (event) =>
  {   
  if (event.which === 13) {
          event.preventDefault();
		      var ean = generateEAN(this.props.formItemCatalog.ean.value);
		      if (!isNaN(ean)) this.props.actionsForm.change(this.props.formItemCatalog.ean.model,ean);
          }
 
  }
 

render() {
  const { formItemCatalog} = this.props;
	const enableSubmitButton = this.props.formItemCatalog.$form.valid;
   
   return (
     <Form model="form2.itemCatalog" autoComplete="off" onSubmit={v => this.props.actionsCatalog.updateCatalogItem(v)}>
         
          <div className="form-group">
             <FormGroup controlId="ean" onKeyPress={this.EANonKeyPress} validationState={(!formItemCatalog.ean.valid) ? "error" : null}>
                   <ControlLabel>EAN: </ControlLabel>
                    <Control.text model=".ean" component={FormControl} 
										validators={{
												isRequired: (val) => val.length > 0,
                        isValidCode: (val) => {
																              if ((val.length > 0) && (!(val > 0))) return false //Numero > 0
																							return true;
															 								},
												isValidEan: (val) => {
																							if ((val.length === 13) && (!isValidEAN(val))) return false //EAN valido
																							return true;
																						 }				
                        }}
                    validateOn={["change", "blur"]}   
                    />
                    <HelpBlock>
                    <Errors
                         model=".ean"
                         messages={{
                            isValidCode: 'EAN o codice + INVIO',
                            isValidEan: 'EAN non valido'
                        }}
                    />
                    </HelpBlock>
             </FormGroup>
              
            <FormGroup controlId="titolo" validationState={formItemCatalog.titolo.valid ? null : "error"}>
                   <ControlLabel>Titolo: </ControlLabel>
                    <Control.text model=".titolo" component={FormControl}
										validators={{
											  isRequired: (val) => val.length > 0,																
                        }}
										/>
                   
             </FormGroup>  
            <FormGroup controlId="autore" validationState={formItemCatalog.autore.valid ? null : "error"}>
                   <ControlLabel>Autore: </ControlLabel>
                    <Control.text model=".autore" component={FormControl}
										validators={{
											  isRequired: (val) => val.length > 0,																
                        }}
										/>
									
                   
             </FormGroup>
             <FormGroup controlId="editore" validationState={formItemCatalog.editore.valid ? null : "error"}>
                   <ControlLabel>Editore: </ControlLabel>
                    <Control.text model=".editore" component={FormControl}
										validators={{
											  isRequired: (val) => val.length > 0,																
                        }}
										/>
             </FormGroup>       
             <FormGroup controlId="prezzoListino" validationState={(formItemCatalog.prezzoListino.valid) ? null : "error"}>
                   <ControlLabel>Prezzo listino: </ControlLabel>
                    <Control.text model=".prezzoListino" component={FormControl}
										validators={{
											    isNumber: (val) => val > 0														
                        }}
                    validateOn={["change"]}   
										/>
                    <HelpBlock>
                    <Errors
                         model=".prezzoListino"
                         messages={{
                            isNumber: 'Prezzo',
                        }}
										  show={(formItemCatalog.prezzoListino.value.length>0)} 		
                    />
                    </HelpBlock>
             </FormGroup>   
		 </div>
       <ButtonToolbar>
              <Button type="submit" disabled={!enableSubmitButton} bsStyle="primary" bsSize="large" active={!enableSubmitButton}>Inserisci </Button>
              <Button type="button" onClick={this.cancelForm} bsSize="large" active>Annulla</Button>
             </ButtonToolbar>
          </Form>               
      
   )  
  }
}  

function mapStateToProps(state) {
  return {
     formItemCatalog: state.form2.forms.itemCatalog 
        }
}

function mapDispatchToProps(dispatch) {
  return {
		actionsForm: bindActionCreators(ActionsForm, dispatch),
		actionsCatalog:  bindActionCreators(ActionsCatalog, dispatch),
		
    //actions: bindActionCreators(Actions, dispatch),
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormItemCatalog);