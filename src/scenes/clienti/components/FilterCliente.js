import React from 'react';
import WrappedForm from '../../../components/WrappedForm'



const FilterCliente = (props) =>
{
	const onChange = (field, value) => {props.setFilter(field,value)}
	const frmCols = props.geometry.formSearchCols;
    return (
	<WrappedForm  onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
         <WrappedForm.Group formGroupLayout={{gutter:frmCols.gutter}}>
        <WrappedForm.Input field='nome' label='Nome' formColumnLayout={{width:frmCols.nome}}  />
        <WrappedForm.Input field='cognome' label='Cognome'  formColumnLayout={{width:frmCols.cognome}}  />
         <WrappedForm.Input field='email' label='email' formColumnLayout={{width:frmCols.email}}  />
        <WrappedForm.Input field='telefono' label='telefono'  formColumnLayout={{width:frmCols.telefono}}  />
         <WrappedForm.Button  type={'button'} formColumnLayout={{width:frmCols.reset}} onClick={props.resetFilter}>Reset</WrappedForm.Button>
     
     </WrappedForm.Group>
     </WrappedForm>
		)
		
}

export default FilterCliente;
