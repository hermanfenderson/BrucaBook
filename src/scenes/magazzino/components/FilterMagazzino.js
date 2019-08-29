import React from 'react';
import WrappedForm from '../../../components/WrappedForm2'



const FilterMagazzino = (props) =>
{   const cols = props.formSearchCols;
	const onChange = (field, value) => {props.setFilter(field,value)}
    return (
	<WrappedForm  layout={'vertical'} onChange={onChange} loading={false} formValues={props.filters} errorMessages={{}}>
        <WrappedForm.Input field='key' label='EAN' coord={cols.ean}  />
        <WrappedForm.Input field='titolo' label='Titolo'  coord={cols.titolo}  />
        <WrappedForm.Input field='autore' label='Autore'  coord={cols.autore} />
        <WrappedForm.Input field='editore' label='Editore'  coord={cols.editore} />
        
         <WrappedForm.Input field='nomeCategoria' label='Categoria'  coord={cols.nomeCategoria} />
      
         <WrappedForm.Button type={'button'} coord={cols.reset} onClick={props.resetFilter}>Reset</WrappedForm.Button>
       <WrappedForm.Button type={'button'} coord={cols.reset} onClick={props.saveMagazzino}>Salva</WrappedForm.Button>
     
     </WrappedForm>
		)
		
}

export default FilterMagazzino;
