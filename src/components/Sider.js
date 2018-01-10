//Componente puro per gestire la parte alta della app...
import React from 'react';
import {Menu, Icon} from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

const SubMenu = Menu.SubMenu;

class Sider extends React.Component {
  

	onClick = (selection) => {
	let link = '';
	switch(selection.key)
		{
			case '1': link='/acquisti/'+moment().format('YYYY/MM'); break;
			case '2': link='/vendite/'+moment().format('YYYY/MM'); break;
			case '3': link='/inventari'; break;
			
			case '4': link='/itemCatalogo'; break;
			
			case '5': link='/userMgmt?mode=changePassword'; break;
			case '6': link='/userMgmt?mode=configuration'; break;
			case '7': link='/#signout'; this.props.signOutUser();break;
			case '8': link='/version';break;
			
			default: break;
		}
        this.props.setMenuSelectedKeys([selection.key]);
		this.props.history.push(link);
	}
  
    render() {
    	return (
    	 <div>
    	 <div onClick= {() => {this.props.setMenuSelectedKeys([]); this.props.history.push('/')}} className="logo"/>
        
    	<Menu onClick={this.onClick} theme="dark" mode="inline" selectedKeys={this.props.menuSelectedKeys}>
            <Menu.Item key="1">
              <Icon type="shopping-cart" />
              <span>Acquisti</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="gift" />
              <span>Vendite</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="tag" />
              <span>Inventario</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="book" />
              <span>Catalogo</span>
            </Menu.Item>
            <SubMenu key="sub1" title={<span><Icon type="user" /><span>Utente</span></span>}>
	            <Menu.Item key="5">
	              <Icon type="retweet" />
	              <span>Password</span>
	            </Menu.Item>
	            <Menu.Item key="6">
	              <Icon type="setting" />
	              <span>Configurazione</span>
	            </Menu.Item>
	            <Menu.Item key="7">
	              <Icon type="logout" />
	              <span>Esci</span>
	            </Menu.Item>
	            
	         </SubMenu>   
	          <Menu.Item key="8">
	              <Icon type="info-circle" />
	              <span>Versione</span>
	            </Menu.Item>
          </Menu>
         </div> 
     )}
}


export default withRouter(Sider);
