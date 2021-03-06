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
import Ordine from '../scenes/ordine';
import Resa from '../scenes/resa';
import ResaLibera from '../scenes/resaLibera';

import Inventario from '../scenes/inventario';
import ElencoInventari from '../scenes/elencoInventari';
import DettagliArticolo from '../scenes/dettagliArticolo';
import ReadmeViewer from '../scenes/readmeViewer';
import Fornitori from '../scenes/fornitori';
import Clienti from '../scenes/clienti';

import Categorie from '../scenes/categorie';

import Dashboard from '../scenes/dashboard';
import Magazzino from '../scenes/magazzino';
import Help from '../scenes/help';
import ElencoOrdini from '../scenes/elencoOrdini';


//import GestioneScontrino from '../containers/GestioneScontrino';
//        		<Route path="/cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
//      		<Route path="/cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
 
//<Route exact path='/home' component={Home}/>

import GestioneItemCatalog from '../scenes/catalogo';


 const RequireAuthRoute = ({ component: Component, ...rest }) => 
			{
			  return(
			  <Route {...rest} render={props => (
			    rest.authenticated?  <Component {...props} {...rest.otherProps} />:  <Redirect to='/userMgmt?mode=login' />
			  )}/>)
			}
			
    
const Main= (props) => 
{  	const authenticated = props.authenticated;
    
   

	return( 					<Switch>
      									<RequireAuthRoute exact path='/' component={Home} authenticated={authenticated}/>
      								 	<RequireAuthRoute exact path='/inventari' component={ElencoInventari} authenticated={authenticated}/>
    									<RequireAuthRoute path='/dettagli/:ean' component={DettagliArticolo} authenticated={authenticated}/>
    								    <RequireAuthRoute path="/inventario/:id" component={Inventario} authenticated={authenticated}/>

    									<RequireAuthRoute path='/bolla/:anno/:mese/:id' component={GestioneBolla} authenticated={authenticated}/>
    									<RequireAuthRoute exact path='/acquisti/:anno/:mese' component={ElencoBolle} authenticated={authenticated}/>
    									<RequireAuthRoute exact path='/vendite/:anno/:mese' component={ElencoCasse} authenticated={authenticated}/>
    										<RequireAuthRoute exact path='/rese/:anno/:mese' component={ElencoRese} authenticated={authenticated}/>
    								     <RequireAuthRoute path='/resa/:anno/:mese/:id' component={Resa} authenticated={authenticated}/>
    									<RequireAuthRoute path='/resaLibera/:anno/:mese/:id' component={ResaLibera} authenticated={authenticated}/>
    									
		        					     	<RequireAuthRoute exact path='/scontrino/:anno/:mese/:cassa/:scontrino' component={Scontrino} authenticated={authenticated}/>
		        							<RequireAuthRoute exact path='/scontrino/:anno/:mese/:cassa' component={Scontrino} authenticated={authenticated}/>
		        					    <Route path="/userMgmt" render={(props) => <UserMgmt {...props}/>} />
    					      		     <RequireAuthRoute path="/fornitori" component={Fornitori} authenticated={authenticated}/>
    					      		      <RequireAuthRoute path="/clienti" component={Clienti} authenticated={authenticated}/>
    					      			
    					      			  <RequireAuthRoute path="/categorie" component={Categorie} authenticated={authenticated}/>
    					      			  	<RequireAuthRoute path="/catalogo/:ean" component={GestioneItemCatalog} authenticated={authenticated}/>
		        					
    					      		     	<RequireAuthRoute path="/catalogo" component={GestioneItemCatalog} authenticated={authenticated}/>
		        					        
		        							<RequireAuthRoute path="/dashboard" component={Dashboard} authenticated={authenticated} />
		        								<RequireAuthRoute path="/magazzino" component={Magazzino} authenticated={authenticated}/>
    					      		
    					      		    	<RequireAuthRoute exact path='/ordini/:cliente' component={ElencoOrdini} authenticated={authenticated}/>
    									<RequireAuthRoute exact path='/ordine/:cliente/:id' component={Ordine} authenticated={authenticated}/>
    									
    										<RequireAuthRoute exact path='/ordiniAperti' component={Ordine} otherProps={{ordiniAperti:true}} authenticated={authenticated}/>
    							
    					      			<RequireAuthRoute exact path='/version' component={ReadmeViewer} authenticated={authenticated}/>
		        					 
    					      			<Route exact path='/help' component={Help}/>
		        					   
						    		
						            </Switch>
		)
}

export default Main;
