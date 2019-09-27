import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'
import {objSelector} from '../../../helpers/form'
import {isValidEAN, isInternalEAN} from '../../../helpers/ean'


class FormCatalogo extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	   	this.props.changeEditedCatalogItem(name, value)};
		
onSubmit = (e) => {
	e.preventDefault();
	//la decisione se devo salvare nel catalogo generale è una prop...
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, this.props.scene, this.props.saveGeneral); //Per sapere cosa fare... dopo
  }
  
resetForm = () => {
	this.props.resetEditedCatalogItem(this.props.scene);
}
    
componentDidMount = () => {
	if (this.props.ean) this.props.changeEditedCatalogItem('ean', this.props.ean);
}

  render() {
  	const formValues = this.props.editedCatalogItem.values;
  	const errorMessages = this.props.editedCatalogItem.errorMessages;
  	const loading = this.props.editedCatalogItem.loading;
  	const ean = this.props.editedCatalogItem.values.ean;
  	return (
     <WrappedForm layout='horizontal' readOnlyForm={false} loading={loading} onSubmit={this.onSubmit} onChange={this.onChange} formValues={formValues} errorMessages={errorMessages} >
          <WrappedForm.Input field='ean' label='EAN' readOnly={this.props.readOnlyEAN} />
        <WrappedForm.Input field='titolo'  label='Titolo' />
        <WrappedForm.Input field='autore'  label='Autore'  />
        <WrappedForm.Input field='editore'  label='Editore'/>
        <WrappedForm.Input field='prezzoListino'   label='Listino'/>
        <WrappedForm.SelectList field='iva' label='IVA' list={this.props.aliquoteIVA} defaultValue="a0"/>
         <WrappedForm.ImageUploader label='Copertina' field='imgFirebaseUrl' fullName={(isValidEAN(ean)) ? (this.props.saveGeneral && !(isInternalEAN(ean))) ? 'images/books/'+ean+'.jpg' : 'images/books/'+this.props.catena+'/'+this.props.libreria+'/'+ean+'.jpg' : ''} />
         <WrappedForm.AutoCompleteList field='categoria' label='Categoria' list={objSelector(this.props.categorie,'nome')}  />
      
        {this.props.isModal ? <WrappedForm.Group></WrappedForm.Group> :
        <WrappedForm.Group formGroupLayout={{gutter:8}}>
         <WrappedForm.GeneralError  formColumnLayout={{span:14}}/>
         <WrappedForm.Button formColumnLayout={{width:60}} type={'button'} onClick={this.resetForm}>Annulla</WrappedForm.Button>
       	 <WrappedForm.Button formColumnLayout={{width:60}} type="primary" htmlType="submit">OK</WrappedForm.Button>
        </WrappedForm.Group>
        }
       
       </WrappedForm>
       )
  }
}
export default FormCatalogo;