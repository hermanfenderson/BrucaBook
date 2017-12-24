import React from 'react';
import ReactDOM from 'react-dom';
import {Layout, Affix, Row, Icon, Col, Avatar, Dropdown} from 'antd';
import UserMenu from '../components/UserMenu';


class Header extends React.Component {

toggle = () => {
    this.props.toggleCollapsed();
  }

 componentDidMount() {
 	
 	this.props.storeMeasure('headerHeight', ReactDOM.findDOMNode(this.refs.header).clientHeight);
     }
  
menu = (<UserMenu signOutUser={this.props.signOutUser}/>);  

  render()
  {
  	return(
  		<Layout.Header style={{ background: '#fff', padding: 0, width: '100%' }} ref='header' >
           
        
           <Affix>
           <Row  style={{backgroundColor: 'white'}}>
           <Col span={18}>
            <Icon
              className="trigger"
              type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <span style={{fontWeight: 'bold'}}>
            {this.props.info.nomeLibreria}
            </span>
            <span>
            {' - '}
             {this.props.headerInfo} 
             </span>
            </Col> 
              
            <Col className='userBox' span={6} >
                <span className='userTextBox'>
               {this.props.info.nick}
               
               </span>
                   
           <Dropdown trigger={['click']} placement={'bottomRight'} overlay={this.menu}>
          
                <Avatar className='avatar' icon='user' />
             </Dropdown> 
             </Col>
            </Row>
            
            </Affix>
          </Layout.Header>
  		)
  }
}

export default Header;

  
