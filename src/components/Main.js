//Componente puro per gestire il contenuto di Main
//In sostanza sceglie una "scene"
import React from 'react';

import { Switch, Route, Redirect} from 'react-router-dom'
import Home from './Home';
import Signup from '../scenes/signup';
import Login from '../scenes/login';
import ElencoBolle from '../scenes/elencoBolle';
import GestioneBolla from '../scenes/bolla';
//import GestioneScontrino from '../containers/GestioneScontrino';
//        		<Route path="/cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
//      		<Route path="/cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
 
//<Route exact path='/home' component={Home}/>

import GestioneItemCatalog from '../scenes/catalogo';


const Main= (props) => 
{    const authenticated = props.authenticated;
     const RequireAuth = (Component) => {return((props) => {
     	                   	return (authenticated ?  <Component {...props}/>:  <Redirect to='/login' />);
    						})}
    						
	return( 					<Switch>
      									<Route exact path='/' component={RequireAuth(Home)}/>
      									
    									<Route path='/bolla/:id' component={RequireAuth(GestioneBolla)}/>
    									<Route exact path='/acquisti' component={RequireAuth(ElencoBolle)}/>
		        						<Route path="/itemCatalogo" component={RequireAuth(GestioneItemCatalog)} />
    					      			<Route path="/login" component={Login} />
						    			<Route path="/signup" component={Signup} />
						            </Switch>
		)
}

export default Main;