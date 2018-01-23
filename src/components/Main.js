//Componente puro per gestire il contenuto di Main
//In sostanza sceglie una "scene"
import React from 'react';

import { Switch, Route, Redirect} from 'react-router-dom'
import Home from './Home';
import UserMgmt from '../scenes/userMgmt';
import ElencoBolle from '../scenes/elencoBolle';
import ElencoCasse from '../scenes/elencoCasse';
import Scontrino from '../scenes/scontrino';
import ElencoRese from '../scenes/elencoRese';

import GestioneBolla from '../scenes/bolla';
import Resa from '../scenes/resa';

import Inventario from '../scenes/inventario';
import ElencoInventari from '../scenes/elencoInventari';
import DettagliArticolo from '../scenes/dettagliArticolo';
import ReadmeViewer from '../scenes/readmeViewer';
import Fornitori from '../scenes/fornitori';
//import GestioneScontrino from '../containers/GestioneScontrino';
//        		<Route path="/cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
//      		<Route path="/cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
 
//<Route exact path='/home' component={Home}/>

import GestioneItemCatalog from '../scenes/catalogo';


    
    
const Main= (props) => 
{  	const authenticated = props.authenticated;
    
     const RequireAuth = (Component) => {return((props) => {
     	                   	return (authenticated ?  <Component {...props}/>:  <Redirect to='/userMgmt?mode=login' />);
    						})}
    						
	return( 					<Switch>
      									<Route exact path='/' component={RequireAuth(Home)}/>
      									<Route exact path='/vendite/:anno/:mese' component={RequireAuth(ElencoCasse)}/>
		        					   	<Route path='/inventario/:id' component={RequireAuth(Inventario)}/>
    									<Route exact path='/inventari' component={RequireAuth(ElencoInventari)}/>
    									<Route path='/dettagli/:ean' component={RequireAuth(DettagliArticolo)}/>
    								
    									<Route path='/bolla/:anno/:mese/:id' component={RequireAuth(GestioneBolla)}/>
    									<Route exact path='/acquisti/:anno/:mese' component={RequireAuth(ElencoBolle)}/>
    									<Route exact path='/vendite/:anno/:mese' component={RequireAuth(ElencoCasse)}/>
    										<Route exact path='/rese/:anno/:mese' component={RequireAuth(ElencoRese)}/>
    								     <Route path='/resa/:anno/:mese/:id' component={RequireAuth(Resa)}/>
    									
		        					     <Route exact path='/scontrino/:anno/:mese/:cassa/:scontrino' component={RequireAuth(Scontrino)}/>
		        						<Route exact path='/scontrino/:anno/:mese/:cassa' component={RequireAuth(Scontrino)}/>
		        					    <Route path="/userMgmt" render={(props) => <UserMgmt {...props}/>} />
    					      		     <Route path="/fornitori" component={RequireAuth(Fornitori)} />
    					      			              
		        						<Route path="/catalogo" component={RequireAuth(GestioneItemCatalog)} />
    					      			<Route exact path='/version' component={RequireAuth(ReadmeViewer)}/>
		        					   
						    		
						            </Switch>
		)
}

export default Main;
