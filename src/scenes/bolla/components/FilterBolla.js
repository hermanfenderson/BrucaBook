import React from 'react';
import WrappedForm from '../../../components/WrappedForm'



const FilterBolla = (props) =>
{
	const onChange = (field, value) => {props.setFilter(field,value)}
	const frmCols = props.geometry.formSearchCols;
    return (
	<WrappedForm  onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
         <WrappedForm.Group formGroupLayout={{gutter:frmCols.gutter}}>
        <WrappedForm.Input field='key' label='EAN' formColumnLayout={{width:frmCols.ean}}  />
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{width:frmCols.titolo}}  />
         <WrappedForm.Button  type={'button'} formColumnLayout={{width:frmCols.reset}} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm.Group>
     </WrappedForm>
		)
		
}

export default FilterBolla;
