//Componente puro per gestire la parte alta della app...
import React from 'react';
import {Menu, Icon} from 'antd';
import { withRouter } from 'react-router-dom';


class UserMenu extends React.Component {
  state = {
    selectedKeys : [],
  }

	onClick = (selection) => {
	let link = '';
	switch(selection.key)
		{
			case '4': link='/userMgmt?mode=changePassword'; break;
			case '5': link='/userMgmt?mode=configuration'; break;
			case '6': link='/#signout'; this.props.signOutUser();break;
			default: break;
		}
		this.setState({selectedKeys : [selection.key]});
		this.props.history.push(link);
	}
  
    render() {
    	return (
    	 <div>
    	 <Menu onClick={this.onClick} theme="light" mode="inline" selectedKeys={this.state.selectedKeys}>
            
	            <Menu.Item key="4">
	              <Icon type="retweet" />
	              <span>Password</span>
	            </Menu.Item>
	            <Menu.Item key="5">
	              <Icon type="setting" />
	              <span>Configurazione</span>
	            </Menu.Item>
	            <Menu.Item key="6">
	              <Icon type="logout" />
	              <span>Esci</span>
	            </Menu.Item>
	      </Menu>  
         </div> 
     )}
}


export default withRouter(UserMenu);
