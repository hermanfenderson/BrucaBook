import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import RigheBolla from '../components/RigheBolla';
import '../styles/app.css';

const bolla = 1; //Andrà passato come parametro appena possibile...

class GestioneBolla extends React.Component {

  componentDidMount() {
     this.props.actions.deletedRigaBolla(bolla);
    this.props.actions.addedRigaBolla(bolla);
   //this.props.actions.ricerca(); Per gioco...
  }
 
  editRow(id)
         {
           this.props.eanInputRef.focus(); 
         }

 deleteRow = (id) => 
         {
           this.props.actions.deleteRigaBolla(bolla,id);
           this.props.eanInputRef.focus(); //Metto il focus su EAN dopo la cancellazione
         }
  
 render() {
    return (
      <div>
      <RigheBolla righeBollaDB={this.props.righeBolla}
                  editRow={this.editRow}
                  deleteRow={this.deleteRow} />        
      </div>
    );
  }
}



function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    righeBolla: state.bolle.righeBolla,
    eanInputRef: state.bolle.eanInputRef
     };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneBolla);