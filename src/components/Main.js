//Componente puro per gestire il contenuto di Main
//In sostanza sceglie una "scene"
import React from 'react';

import { Switch, Route} from 'react-router-dom'
import Home from '../containers/Home';
import Signup from '../containers/Signup';
import Login from '../scenes/login';
import ElencoBolle from '../scenes/elencoBolle';
import GestioneBolla from '../scenes/bolla';
import GestioneScontrino from '../containers/GestioneScontrino';
import GestioneItemCatalog from '../scenes/catalogo';
import RequireAuth from '../containers/RequireAuth';

const Main= (props) => 
{
	return(
			<Switch>
      			<Route exact path='/' component={Home}/>
    			<Route path='/bolla/:id' component={RequireAuth(GestioneBolla)}/>
    			<Route exact path='/acquisti' component={RequireAuth(ElencoBolle)}/>
		        <Route path="/signup" component={Signup} />
        		<Route path="/login" component={Login} />
        		<Route path="/cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
        		<Route path="/itemCatalogo" component={RequireAuth(GestioneItemCatalog)} />
    		 </Switch>
		)
}

export default Main;
