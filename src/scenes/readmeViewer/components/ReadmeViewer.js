import React from 'react';

import ReactMarkdown from 'react-markdown';

class ReadmeViewer extends React.Component 
{


componentDidMount() {
this.props.setHeaderInfo('Versione');
this.props.loadReadme();

}


  
  render() {
  
  return (
  	<div style={{position: 'relative', left: 100, height: this.props.measures.mainHeight, overflowY: 'scroll'}}>

  	  	<ReactMarkdown skipHtml={true} source={this.props.readme} />
  	</div>  	
  );
  }

	
}
	

  
export default ReadmeViewer
