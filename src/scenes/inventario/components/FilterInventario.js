import React from 'react';
import WrappedForm from '../../../components/WrappedForm2'



const FilterInventario = (props) =>
{   const cols = props.formSearchCols;
	const onChange = (field, value) => {props.setFilter(field,value)}
    return (
	<WrappedForm  layout='vertical' onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
        <WrappedForm.Input field='key' label='EAN' coord={cols.ean}  />
        <WrappedForm.Input field='titolo' label='Titolo'  coord={cols.titolo}  />
        <WrappedForm.Input field='autore' label='Autore'  coord={cols.autore} />
         <WrappedForm.Button type={'button'} coord={cols.reset} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm>
		)
		
}

export default FilterInventario;
