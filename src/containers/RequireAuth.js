import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router';
export default function(WrappedComponent) {
  class Auth extends React.Component {
       
    render() {
      return this.props.authenticated ? <WrappedComponent {...this.props} /> : <Redirect to='/login' />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.status.authenticated, 
             user: state.status.user
           };
  }

  return connect(mapStateToProps)(Auth);
}
