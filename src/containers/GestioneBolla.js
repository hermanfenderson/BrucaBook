import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import RigheBolla from '../components/RigheBolla';
import '../styles/app.css';

class GestioneBolla extends React.Component {
   componentWillMount() {
    this.props.actions.fetchRigheBolla(1);
  }
 
  render() {
    return (
      <div>
      <RigheBolla righeBollaDB={this.props.righeBolla}/>        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    righeBolla: state.bolle.righeBolla
    };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneBolla);