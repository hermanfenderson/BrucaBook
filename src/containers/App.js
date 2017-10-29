//Pagina principale dell'applicazione
//Ricarica lo stato in caso di reload (qui punto se un cretino fa refresh della pagina)
//Qui ho l'header e un eventuale menu a tendina laterale
//Gestisco anche la presenza di un utente autenticato...(anche se nel rendering sotto mi devo fidare del mio stato)

import React from 'react';
import { withRouter } from 'react-router-dom'

import Header from '../components/Header';
import Main from '../components/Main';
import { connect } from 'react-redux';
import Measure from 'react-measure';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import '../styles/app.css';

class App extends React.Component {


  componentWillMount() {
  this.props.actions.listenAuthStateChanged();
  }

handleResize = () => {
  this.props.actions.storeMeasure('viewPortHeight', window.innerHeight);
}

 componentDidMount() {
    this.handleResize(); //La prima volta...
    window.addEventListener('resize', this.handleResize);
  }

componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  this.props.actions.removeMeasure('viewPortHeight');
  //QUI MANCA LA CHIUSURA DEL LISTENER DELL'AUTENTICAZIONE
	
}




  render() {
      return (
         <Measure onMeasure={(dimensions) => {
          this.props.actions.storeMeasure('windowHeight',dimensions.height);
          }}
    	 > 
           <div>
            <Header authenticated={this.props.authenticated} signOutUser={this.props.actions.signOutUser} />
            <Main />
           </div>
        </Measure>  
        );
        }
}

function mapStateToProps(state) {
  return {
    authenticated: state.status.authenticated,
    user: state.status.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
