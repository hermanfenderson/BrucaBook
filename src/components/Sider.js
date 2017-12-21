//Componente puro per gestire la parte alta della app...
import React from 'react';
import {Menu, Icon} from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

const SubMenu = Menu.SubMenu;

class Sider extends React.Component {
  state = {
    selectedKeys : [],
  }

	onClick = (selection) => {
	let link = '';
	switch(selection.key)
		{
			case '1': link='/acquisti/'+moment().format('YYYY/MM'); break;
			case '2': link='/vendite/'+moment().format('YYYY/MM'); break;
			case '3': link='/itemCatalogo'; break;
			case '4': link='/userMgmt?mode=changePassword'; break;
			case '5': link='/#signout'; this.props.signOutUser();break;
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
              <span>Vendite</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="book" />
              <span>Catalogo</span>
            </Menu.Item>
            <SubMenu key="sub1" title={<span><Icon type="user" /><span>Utente</span></span>}>
	            <Menu.Item key="4">
	              <Icon type="retweet" />
	              <span>Cambia password</span>
	            </Menu.Item>
	            <Menu.Item key="5">
	              <Icon type="logout" />
	              <span>Esci</span>
	            </Menu.Item>
	         </SubMenu>   
          </Menu>
         </div> 
     )}
}


export default withRouter(Sider);
