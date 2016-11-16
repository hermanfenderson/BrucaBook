import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import '../styles/app.css';

class App extends React.Component {
  componentWillMount() {
    this.props.actions.verifyAuth();
  }

  render() {
    return (
       <div>
        <Header />
            {React.cloneElement(this.props.children, { authenticated: this.props.authenticated, user: this.props.user })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    user: state.auth.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
