import React from 'react';
import ReactDOM from 'react-dom';
import {Layout, Affix, Row, Icon, Col, Avatar, Dropdown, Button, Menu} from 'antd';
import { withRouter } from 'react-router-dom';


class Header extends React.Component {


toggle = () => {
    this.props.toggleCollapsed();
  }
  


back = () => {
	this.props.history.goBack();
//	setTimeout(() => {this.menuSet(document.location.href.split('/')[3]);},0); //Il pezzo del path che mi interessa...
	setTimeout(() => {this.props.setMenuSelectedKeys([document.location.href.split('/')[3]]);},0); //Il pezzo del path che mi interessa...
	
	
}


 componentDidMount() {
 	
 	this.props.storeMeasure('headerHeight', ReactDOM.findDOMNode(this.refs.header).clientHeight);
 	 }

onClick = (selection) => {
	let link = '';
	switch(selection.key)
		{
			case '5': link='/userMgmt?mode=changePassword'; break;
			case '6': link='/userMgmt?mode=configuration'; break;
			case '7': link='/#signout'; this.props.signOutUser();break;
			default: break;
		}
		this.props.setMenuSelectedKeys([selection.key]);
		this.props.history.push(link);
	}

menu = (<Menu onClick={this.onClick} theme="light" >
            
	            <Menu.Item key="5">
	              <Icon type="retweet" />
	              <span> Password</span>
	            </Menu.Item>
	            <Menu.Item key="6">
	              <Icon type="setting" />
	              <span> Configurazione</span>
	            </Menu.Item>
	            <Menu.Item key="7">
	              <Icon type="logout" />
	              <span> Esci</span>
	            </Menu.Item>
	      </Menu>  
       )

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
             <Button
              icon="arrow-left"
              onClick={this.back}>
            </Button>
           
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
          
                <Avatar src={this.props.info.imgFirebaseUrl} className='avatar' icon='user' />
             </Dropdown> 
             </Col>
            </Row>
            
            </Affix>
          </Layout.Header>
  		)
  }
}

export default withRouter(Header);

  
