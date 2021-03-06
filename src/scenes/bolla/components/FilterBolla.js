import React from 'react';
import WrappedForm from '../../../components/WrappedForm2'



const FilterBolla = (props) =>
{
	const onChange = (field, value) => {props.setFilter(field,value)}
	const formSearchCols = props.geometry.formSearchCols;
    return (
	<WrappedForm  layout='vertical' onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
        <WrappedForm.Input field='key' label='EAN' coord={formSearchCols.ean}  />
        <WrappedForm.Input field='titolo' label='Titolo' coord={formSearchCols.titolo}  />
         <WrappedForm.Button  type={'button'} coord={formSearchCols.reset} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm>
		)
		
}

export default FilterBolla;
