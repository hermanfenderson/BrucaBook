import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Row} from 'antd';

class ReadmeViewer extends React.Component 
{

componentWillMount() {
  this.props.loadReadme();
  this.props.setHeaderInfo('Versione');
}
	render()
	{
   
  return(<Row style={{height: this.props.readmeHeight}}>
  <ReactMarkdown  source={this.props.readme} />
  </Row>)
	}
}

export default ReadmeViewer
