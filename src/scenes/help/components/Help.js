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
   	<YouTube
         opts={opts}
        
      />
  );
  }

	
}
	

export default Help