import React from 'react';
import Measure from 'react-measure';

import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';

class Header extends React.Component {
  handleSignout() {
    this.props.signOutUser();
  }

  renderAuthLinks() {
    if (this.props.authenticated) {
      return [
      	  <li className="nav-item" key={1}>
          <Link className="nav-link" to="/cassa/20160105cassa1/1">Gestione vendite</Link>
        </li>,
         <li className="nav-item" key={2}>
          <Link className="nav-link" to="/bolla/1">Gestione bolle</Link>
        </li>,
               <li className="nav-item" key={3}>
          <Link className="nav-link" to="/bollaold/1">Gestione bolle old</Link>
        </li>,
        <li className="nav-item" key={4}>
          <Link className="nav-link" to="/itemCatalogo">Catalogo</Link>
        </li>,
        <li className="nav-item" key={5}>
          <a className="nav-link" href="#" onClick={() => this.handleSignout()}>Sign Out</a>
        </li>
      ]
    } else {
      return [
        <li className="nav-item" key={1}>
          <Link className="nav-link" to="/login">Login</Link>
        </li>,
        <li className="nav-item" key={2}>
          <Link className="nav-link" to="/signup">Sign Up</Link>
        </li>
      ]
    }
  }

  render() {
    return (
       <Measure onMeasure={(dimensions) => {
          this.props.storeMeasure('headerHeight',dimensions.height);
          
        }}
      >
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">BrucaBook</Link>
          </div>
           <ul className="nav navbar-nav navbar-right">
             { this.renderAuthLinks() }
           </ul>
        </div>
      </nav>
      </Measure>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps, Actions)(Header);
