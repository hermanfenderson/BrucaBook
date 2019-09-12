import React from 'react';
import YouTube from 'react-youtube';
class Help extends React.Component 
{


  render() {
  	const opts = {
      height: '450',
      width: '800',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        list: 'PLIiYvOIzkBlLGoyAWXjVUX-Bj1fqyyQ8c',
      listType: 'playlist',
     
      }
    };
   return (
   	<div>
   	<YouTube
         opts={opts}
        
      />
      <button onClick={this.props.forzaAggiornaMagazzino}>Forza</button> 
      <button onClick={this.props.pulisciCatalogo}>Pulisci</button>
      
     </div>
    
  );
  }

	
}
	

export default Help