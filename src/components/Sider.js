//Componente puro per gestire la parte alta della app...
import React from 'react';
import {Menu, Icon} from 'antd';
import { withRouter } from 'react-router-dom';




class Header extends React.Component {
  state = {
    selectedKeys : [],
  }

	onClick = (selection) => {
	let link = '';
	
	switch(selection.key)
		{
			case '1': link='/acquisti'; break;
			case '2': link='/itemCatalogo'; break;
			case '3': link='#signout'; this.props.signOutUser();break;
			default: break;
		}
		this.setState({selectedKeys : [selection.key]});
		this.props.history.push(link);
	}
  
    render() {
    	return (
    	 <div>
    	 <div onClick= {() => {this.setState({selectedKeys : []}); this.props.history.push('/')}} className="logo"/>
        
    	<Menu onClick={this.onClick} theme="dark" mode="inline" selectedKeys={this.state.selectedKeys}>
            <Menu.Item key="1">
              <Icon type="shopping-cart" />
              <span>Acquisti</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="gift" />
              <span>Catalogo</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="logout" />
              <span>Esci</span>
            </Menu.Item>
          </Menu>
         </div> 
     )}
}


export default withRouter(Header);
