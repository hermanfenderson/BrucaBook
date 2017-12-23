import React from 'react';
import ReactDOM from 'react-dom';
import {Layout, Affix, Row, Icon, Col, Avatar, Dropdown, Menu} from 'antd';
import SelectBookstore from '../components/SelectBookstore';

class Header extends React.Component {

toggle = () => {
    this.props.toggleCollapsed();
  }

 componentDidMount() {
 	
 	this.props.storeMeasure('headerHeight', ReactDOM.findDOMNode(this.refs.header).clientHeight);
     }
  
menu = (<Menu><Menu.Item><SelectBookstore defaultCatena={'A'} defaultLibreria={'B'} 
bookstoresList={
				{'A': {nome: "L'AltraCittà", librerie: {'B': "L'AltraCittà"}},
				'C': {nome: "Sandbox", librerie: {'D': "Sandbox"}}
				}}/></Menu.Item></Menu>);  

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
            <Dropdown trigger={['click']} overlay={this.menu}>
              
            <Col className='userBox' span={6} >
                <span className='userTextBox'>
               {this.props.info.nick}
               
               </span>
              
                <Avatar className='avatar' icon='user' />
             
             </Col>
               </Dropdown> 
            </Row>
            
            </Affix>
          </Layout.Header>
  		)
  }
}

export default Header;

  
