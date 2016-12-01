//Pagina principale dell'applicazione
//Ricarica lo stato in caso di reload (qui punto se un cretino fa refresh della pagina)
//Qui ho l'header e un eventuale menu a tendina laterale
//Gestisco anche la presenza di un utente autenticato...(anche se nel rendering sotto mi devo fidare del mio stato)

import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import '../styles/app.css';
import Measure from 'react-measure';

class App extends React.Component {
  componentWillMount() {
  this.props.actions.verifyAuth(); //Questo metodo è maledettamente asincrono... lo ho sincronizzato... 
  }

 componentDidMount() {
    this.handleResize(); //La prima volta...
    window.addEventListener('resize', this.handleResize);
  }

componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  this.props.actions.removeMeasure('windowHeight');
  }

handleResize = () => {
  this.props.actions.storeMeasure('windowHeight', window.innerHeight);
}
  render() {
    if (this.props.auth_info)
        {  
        return (
          <Measure onMeasure={(dimensions) => {
          console.log({dimensions});
          
        }}
      >
           <div>
            <Header />
                {React.cloneElement(this.props.children, { authenticated: this.props.authenticated, user: this.props.user })}
          </div>
          </Measure>
        );
        }
     else 
        {
         return (
            <div>loading...</div>
         )
        }
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    auth_info: state.auth.auth_info,
    user: state.status.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
