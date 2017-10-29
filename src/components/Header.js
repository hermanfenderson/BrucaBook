//Componente puro per gestire la parte alta della app...
import React from 'react';
import { Link } from 'react-router-dom';
/*
<li className="nav-item" key={1}>
          <Link className="nav-link" to="/cassa/20160105cassa1/1">Gestione vendite</Link>
        </li>,
         <li className="nav-item" key={2}>
          <Link className="nav-link" to="/bolla/1">Gestione bolle</Link>
        </li>,
*/

const  renderAuthLinks = (authenticated, signOutUser) => {
    if (authenticated) {
      return [
      	  
        <li className="nav-item" key={3}>
          <Link to="/acquisti">Acquisti</Link>
        </li>,
        <li className="nav-item" key={4}>
          <Link to="/itemCatalogo">Catalogo</Link>
        </li>,
        <li className="nav-item" key={5}>
          <a className="nav-link" href="#" onClick={() => signOutUser()}>Sign Out</a>
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
  
  
const Header = (props) => {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">BrucaBook</Link>
          </div>
           <ul className="nav navbar-nav navbar-right">
             { renderAuthLinks(props.authenticated, props.signOutUser) }
           </ul>
        </div>
      </nav>
    );
}


export default Header;
