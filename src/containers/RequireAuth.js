import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router';
import {isAuthenticated, getUser} from '../reducers';
export default function(WrappedComponent) {
  class Auth extends React.Component {
       
    render() {
      return this.props.authenticated ? <WrappedComponent {...this.props} /> : <Redirect to='/login' />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: isAuthenticated(state), 
             user: getUser(state)
           };
  }

  return connect(mapStateToProps)(Auth);
}
