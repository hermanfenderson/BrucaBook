import React from 'react';
import WrappedForm from '../../../components/WrappedForm'



const FilterInventario = (props) =>
{   const cols = props.formSearchCols;
	const onChange = (field, value) => {props.setFilter(field,value)}
    return (
	<WrappedForm  onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
         <WrappedForm.Group formGroupLayout={{gutter:cols.gutter}}>
        <WrappedForm.Input field='key' label='EAN' formColumnLayout={{width:cols.ean}}  />
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{width:cols.titolo}}  />
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{width:cols.autore}} />
         <WrappedForm.Button type={'button'} formColumnLayout={{width:cols.reset}} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm.Group>
     </WrappedForm>
		)
		
}

export default FilterInventario;
