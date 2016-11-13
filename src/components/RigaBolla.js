import React from 'react';
const RigaBolla = (props) => { 
  return (
      <tr key={props.id}>
          <td className="titolo">{props.riga.titolo}</td>
        <td className="prezzo">{props.riga.prezzo}</td>
        <td className="copie">{props.riga.copie}</td>
        <td className="totale">{props.riga.totale}</td>
        <td className="azioni">
    
          <div className="glyphicon glyphicon-trash" onClick={() => {this.props.deleteRow(this.props.row)}}></div>
				<div className="glyphicon glyphicon-edit" onClick={() => {this.props.editRow(this.props.row)}} ></div>
        
        </td>
      </tr>
    );
};

export default RigaBolla;

