import React, {Component} from 'react'
import {Form, Message , Label} from 'semantic-ui-react'


class FormRigaBolla extends Component {
onChange = (event,name, data=undefined) => {
	    const target = event.target; 
	    const value = data ? data.checked : target.value; 
		this.props.changeEditedRigaBolla(name, value)};
		
onSubmit = () => {
	this.props.submitEditedRigaBolla();
  }

  render() {
  	const formValues = this.props.editedRigaBolla.values;
  	const prezzoMan = formValues['manSconto'];
  	return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group>
         <Form.Field>
         <Label> EAN </Label>
          <input value={formValues.ean} placeholder='EAN' width={4} onChange={(e) => this.onChange(e,"ean")} />
          <Label pointing>Please enter a value</Label>
          </Form.Field>
          <Form.Input label='Titolo' value={formValues.titolo} width={6} readOnly/>
           <Form.Input label='Autore' value={formValues.autore}  width={4} readOnly/>
             <Form.Input label='Listino' value={formValues.prezzoListino} width={2} readOnly/>
        </Form.Group>
        <Form.Group>
          <Form.Input label='Sc.1' value={formValues.sconto1}  width={2} disabled={prezzoMan} onChange={(e) => this.onChange(e,"sconto1")} />
		<Form.Input label='Sc.2' value={formValues.sconto2} width={2} disabled={prezzoMan} onChange={(e) => this.onChange(e,"sconto2")}/>
    	<Form.Input label='Sc.3' value={formValues.sconto3} width={2} disabled={prezzoMan} onChange={(e) => this.onChange(e,"sconto3")}/>
    
          <Form.Input label='Prezzo' value={formValues.prezzoUnitario} readOnly={!prezzoMan} width={3} onChange={(e) => this.onChange(e,"prezzoUnitario")}/>
           <Form.Input label='Quantità' value={formValues.pezzi} width={2} onChange={(e) => this.onChange(e,"pezzi")}/>
             <Form.Input label='Gratis' value={formValues.gratis} width={2} onChange={(e) => this.onChange(e,"gratis")}/>
             <Form.Input label='Totale' value={formValues.prezzoTotale} readOnly width={3}/>
        </Form.Group>
       
        <Form.Checkbox label='Man.' checked={formValues.manSconto} onChange={(event,data) => this.onChange(event,"manSconto",data)}/>
        
       
       
         <Message 
    		 error
    		 header='EAN non trovato'
    		  content='Non ho trovato questo libro.'
			 />
		 <Message 
    		 
    		 header='Titolo inserito'
    		  content='2 copie a magazzino'
			 />	 
        <Form.Button>Submit</Form.Button>
      </Form>
    )
  }
}
export default FormRigaBolla;