import React from 'react';
import WrappedForm from '../../../components/WrappedForm2'

const FilterResaLibera = (props) =>
{
	const onChange = (field, value) => {props.setFilter(field,value)}
	const formSearchCols = props.geometry.formSearchCols;
    return (
	<WrappedForm  layout='vertical' onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
        <WrappedForm.Input field='key' label='EAN' coord={formSearchCols.ean}  />
        <WrappedForm.Input field='titolo' label='Titolo' coord={formSearchCols.titolo}  />
            <WrappedForm.Input field='editore' label='Editore' coord={formSearchCols.editore}  />
    
         <WrappedForm.Button  type={'button'} coord={formSearchCols.reset} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm>
		)
		
}

export default FilterResaLibera;


