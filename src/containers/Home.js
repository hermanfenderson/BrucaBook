import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import SearchBar from '../components/SearchBar';
import {isAuthenticated} from '../reducers';

import '../styles/app.css';

class Home extends React.Component {
  render() {
    return (
      <div>
        <SearchBar onTermChange={null} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: isAuthenticated(state)
    
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);