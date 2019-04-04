import React from 'react';
import WrappedForm from '../../../components/WrappedForm'



const FilterMagazzino = (props) =>
{   const cols = props.formSearchCols;
	const onChange = (field, value) => {props.setFilter(field,value)}
    return (
	<WrappedForm  onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
         <WrappedForm.Group formGroupLayout={{gutter:cols.gutter}}>
        <WrappedForm.Input field='key' label='EAN' formColumnLayout={{width:cols.ean}}  />
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{width:cols.titolo}}  />
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{width:cols.autore}} />
        <WrappedForm.Input field='editore' label='Editore'  formColumnLayout={{width:cols.autore}} />
        
         <WrappedForm.Input field='nomeCategoria' label='Categoria'  formColumnLayout={{width:cols.nomeCategoria}} />
      
         <WrappedForm.Button type={'button'} formColumnLayout={{width:cols.reset}} onClick={props.resetFilter}>Reset</WrappedForm.Button>
       <WrappedForm.Button type={'button'} formColumnLayout={{width:cols.reset}} onClick={props.saveMagazzino}>Salva</WrappedForm.Button>
     
     </WrappedForm.Group>
     </WrappedForm>
		)
		
}

export default FilterMagazzino;
