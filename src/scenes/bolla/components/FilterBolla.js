import React from 'react';
import WrappedForm from '../../../components/WrappedForm'



const FilterBolla = (props) =>
{
	const onChange = (field, value) => {props.setFilter(field,value)}
    return (
	<WrappedForm  onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
         <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.Input field='key' label='EAN' formColumnLayout={{span:6}} itemStyle={{marginRight: 10}} />
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{span:15}} itemStyle={{marginRight: 10}} />
         <WrappedForm.Button itemStyle={{width:'90%'}} type={'button'} formColumnLayout={{span:3}} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm.Group>
     </WrappedForm>
		)
		
}

export default FilterBolla;
