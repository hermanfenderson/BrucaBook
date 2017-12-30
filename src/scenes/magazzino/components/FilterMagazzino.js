import React from 'react';
import WrappedForm from '../../../components/WrappedForm'



const FilterMagazzino = (props) =>
{
	const onChange = (field, value) => {props.setFilter(field,value)}
    return (
	<WrappedForm  onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
         <WrappedForm.Group formGroupLayout={{gutter:16}}>
        <WrappedForm.Input field='key' label='EAN' formColumnLayout={{span:4}}  />
        <WrappedForm.Input field='titolo' label='Titolo'  formColumnLayout={{span:9}} />
        <WrappedForm.Input field='autore' label='Autore'  formColumnLayout={{span:8}} />
         <WrappedForm.Button itemStyle={{paddingTop: '38px'}} type={'button'} formColumnLayout={{span:3}} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm.Group>
     </WrappedForm>
		)
		
}

export default FilterMagazzino;
