import React from 'react';
import ReactDOM from 'react-dom';
import {Layout, Affix, Row, Icon} from 'antd';

class Header extends React.Component {

toggle = () => {
    this.props.toggleCollapsed();
  }

 componentDidMount() {
 	
 	this.props.storeMeasure('headerHeight', ReactDOM.findDOMNode(this.refs.header).clientHeight);
     }
  
  render()
  {
  	return(
  		<Layout.Header style={{ background: '#fff', padding: 0, width: '100%' }} ref='header' >
           
        
           <Affix>
           <Row  style={{backgroundColor: 'white'}}>
            <Icon
              className="trigger"
              type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
             {this.props.headerInfo} 
            </Row>
            </Affix>
          </Layout.Header>
  		)
  }
}

export default Header;

  
