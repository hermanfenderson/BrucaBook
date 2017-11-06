//Componente puro per gestire la parte alta della app...
import React from 'react';
import {Menu, Icon} from 'antd';
import { withRouter } from 'react-router-dom';




const Header = (props) => {

	const onClick = (selection) => {
	let link = '';
	switch(selection.key)
		{
			case '1': link='/acquisti'; break;
			case '2': link='/itemCatalogo'; break;
			case '3': link='#signout'; props.signOutUser();break;
			case '4': link='/login'; break;
			case '5': link='/signup'; break;
			default: break;
		}
		props.history.push(link);
	}

    if (props.authenticated) {
    return (
    	<Menu onClick={onClick} theme="dark" mode="inline" defaultSelectedKeys={['1']}>
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
     )}
     else {
     	return (
     	<Menu onClick={onClick} theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="4">
              <Icon type="user" />
              <span>Login</span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="video-camera" />
              <span>Signup</span>
            </Menu.Item>
          </Menu>
          )
     }
}


export default withRouter(Header);