import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
import Magazzino from '../../magazzino'

class FormRigaScontrino extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	   	this.props.changeEditedRigaScontrino(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	var valuesTestata = {...this.props.testataScontrino};
	delete valuesTestata.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
    delete valuesTestata.createdBy;
    delete valuesTestata.createdAt;
    delete valuesTestata.changedBy;
    delete valuesTestata.changedAt;
    delete valuesTestata.key;
    delete valuesTestata.sconto;
	valuesTestata.data = valuesTestata.dataCassa;
    const values =  {...this.props.editedRigaScontrino.values, ...valuesTestata};
    let params = [...this.props.period];
    params.push(this.props.cassa);
    params.push(this.props.scontrino);
    this.props.submitEditedRigaScontrino(this.props.editedRigaScontrino.isValid, this.props.editedRigaScontrino.selectedItem, params, values); //Per sapere cosa fare... dopo
  }
 
resetForm = () => {
	this.props.resetEditedRigaScontrino();
}




  render() {
  	const formValues = this.props.editedRigaScontrino.values;
  	const errorMessages = this.props.editedRigaScontrino.errorMessages;
  	const willFocus = this.props.editedRigaScontrino.willFocus;
  	const prezzoMan = formValues['manSconto'];
  	const loading = this.props.editedRigaScontrino.loading;
  	const readOnlyEAN = ((this.props.editedRigaScontrino.selectedItem !== null) || (this.props.editedRigaScontrino.eanState === 'PARTIAL'))
  	/*
  	  		<div>
     
       
      <Form layout="horizontal" >
      <Row gutter={16}>
      <Col span={18}>
    	 <Form.Item label="Sconto">
    	   <Input />
          </Form.Item>
      </Col>    
      <Col span={6}>
   
         <Form.Item style={{paddingTop: 22}}>
          <Button
            style={{width:'100%'}}
            type="primary"
            htmlType="submit"
          >
            Sconto
          </Button>
        </Form.Item>
       </Col>    
      
      </Row>  
         <Row gutter={16}>
      <FixCol width={810}>
    	 <Form.Item label="Sconto">
    	   <Input />
          </Form.Item>
      </FixCol>    
      <FixCol width={270}>
   
         <Form.Item style={{paddingTop: 22}}>
          <Button
            style={{width:'100%'}}
            type="primary"
            htmlType="submit"
          >
            Sconto
          </Button>
        </Form.Item>
       </FixCol>    
      
      </Row> 
      </Form>
      </div> 
  
       */
       
  	return (
	 <WrappedForm  readOnlyForm={this.props.scontrino ? false : true} focusSet={this.props.focusSet} willFocus={willFocus} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages}>
         <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.InputLookup lookupElement={<Magazzino noHeader noDetails/>} field='ean' required={true} label='EAN' formColumnLayout={{span:6}} itemStyle={{marginRight: 10}}  disabled={readOnlyEAN}/>
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{span:8}} itemStyle={{marginRight: 10}} disabled/>
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{span:6}} itemStyle={{marginRight: 10}} disabled/>
        <WrappedForm.Input field='prezzoListino' label='Listino'  formColumnLayout={{span:4}}  disabled/>
     
       </WrappedForm.Group>
        
        <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.Checkbox formColumnLayout={{span:2}} itemStyle={{marginRight: 10}} field='manSconto' label='Man.'/>
       
        <WrappedForm.Input field='sconto' label='Sconto' itemStyle={{marginRight: 10}} disabled={prezzoMan} formColumnLayout={{span:2}}  />
        
        <WrappedForm.Input field='prezzoUnitario'  readOnly={!prezzoMan} label='Prezzo' formColumnLayout={{span:4}}  itemStyle={{marginRight: 10}}/>
        <WrappedForm.Input field='pezzi' label='Quantità' formColumnLayout={{span:4}} itemStyle={{marginRight: 10}}/>
        <WrappedForm.Input field='prezzoTotale' label='Totale' readOnly formColumnLayout={{span:4}} itemStyle={{marginRight: 10}} formItemLayout={{wrapperCol: { offset: 2, span: 22 }}}/>
    <WrappedForm.Button type={'button'}  buttonItemLayout={{className: 'button-horizontal-form'}} formColumnLayout={{span:4}} style={{width: '90%'}} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	
        <WrappedForm.Button  type="primary" buttonItemLayout={{className: 'button-horizontal-form'}} htmlType="submit"  formColumnLayout={{span:4}} style={{width: '90%'}}>{(this.props.editedRigaScontrino.selectedItem)?'Aggiorna':'Aggiungi'}</WrappedForm.Button>
        
      </WrappedForm.Group>
       <WrappedForm.Group formGroupLayout={{gutter:0}} >
         <WrappedForm.GeneralError  formColumnLayout={{span:24}}/>
       
        
        
       
        </WrappedForm.Group >
       </WrappedForm>
    )
  }
}
export default FormRigaScontrino;