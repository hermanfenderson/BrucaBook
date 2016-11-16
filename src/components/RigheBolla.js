import React from 'react';
import FormRigaBolla from '../containers/FormRigaBolla';
import RigaBolla from '../components/RigaBolla';
const RigheBolla = (props) => { 
  //const righe = {"12345": { "titolo":"I Promessi Sposi", "prezzo":"9.90", "copie":"3", "totale":"29.70"},"12346": { "titolo":"Pinocchio", "prezzo":"5.00", "copie":"2", "totale":"10.00"}};
  const righeBolla = Object.keys(props.righeBollaDB).map((riga_key) => {
    return <RigaBolla key={riga_key}
            id={riga_key}
            riga={props.righeBollaDB[riga_key]} 
            editRow={props.editRow}
            deleteRow={props.deleteRow}
            />
  });
  return (
  <div>
     <FormRigaBolla />
  <div className="table-responsive">
  <table className="table table-bolle table-condensed table-striped table-bordered table-hover no-margin">
    <thead>
      <tr>
        <th style={{width:"40%"}}>Titolo</th>
        <th style={{width:"20%"}}>Prezzo</th>
        <th style={{width:"10%"}}>Copie</th>
        <th style={{width:"15%"}}>Totale</th>
        <th style={{width:"15%"}}>Azioni</th>
      </tr>
    </thead>
    <tbody>
      {righeBolla}
    </tbody>
  </table>
</div>
</div>    
    );
};

export default RigheBolla;

