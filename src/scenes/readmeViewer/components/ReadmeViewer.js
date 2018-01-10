import React from 'react';

import ReactMarkdown from 'react-markdown';
import {Button, Modal} from 'antd';
import {Redirect} from 'react-router';

class ReadmeViewer extends React.Component 
{

componentWillMount() {
  this.props.setHeaderInfo('Versione');
  this.props.setShowModal(true);

}
componentDidMount() {
this.props.loadReadme();
}

componentWillUnmount() {
	this.props.setShowModal(true);
}


handleCancel = () => 
{
	this.props.setShowModal(false);
	this.props.setMenuSelectedKeys([]); //Azzero la selezione nel menu
}
  
  render() {
  const showModal = this.props.showModal;
  return (
  	  <div>
      {showModal ? (
        <Modal width={'90%'} footer={[
            <Button key="back" onClick={this.handleCancel}>Chiudi</Button>,
            ]} visible={this.props.showModal} onCancel={this.handleCancel}>
  	<ReactMarkdown skipHtml={true} source={this.props.readme} />
 </Modal>
      ) : (
        <Redirect to='/' />
      )}
     </div> 
  );
  }

	
}
	

export default ReadmeViewer
