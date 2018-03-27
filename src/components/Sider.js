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
			case 'acquisti': link='/acquisti/'+moment().format('YYYY/MM'); break;
			case 'vendite': link='/vendite/'+moment().format('YYYY/MM'); break;
			case 'inventari': link='/inventari'; break;
			case 'rese': link='/rese/'+moment().format('YYYY/MM'); break;
			
			case 'catalogo': link='/catalogo'; break;
				case 'fornitori': link='/fornitori'; break;
		    case 'dashboard': link='/dashboard'; break;
		    case 'magazzino': link='/magazzino'; break;
			case 'userMgmt?mode=changePassword': link='/userMgmt?mode=changePassword'; break;
			case 'userMgmt?mode=configuration': link='/userMgmt?mode=configuration'; break;
			case '#signout': link='/#signout'; this.props.signOutUser();break;
			case 'version': link='/version';break;
			
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
            <Menu.Item key="acquisti">
              <Icon type="shopping-cart" />
              <span>Acquisti</span>
            </Menu.Item>
            <Menu.Item key="vendite">
              <Icon type="smile-o" />
              <span>Cassa</span>
            </Menu.Item>
            <Menu.Item key="inventari">
              <Icon type="tag" />
              <span>Inventario</span>
            </Menu.Item>
             <Menu.Item key="rese">
              <Icon type="rocket" />
              <span>Rese</span>
            </Menu.Item>
             <Menu.Item key="magazzino">
              <Icon type="barcode" />
              <span>Magazzino</span>
            </Menu.Item>
            <SubMenu key="sub2" title={<span><Icon type="database" /><span>Anagrafiche</span></span>}>
	        
            <Menu.Item key="catalogo">
              <Icon type="book" />
              <span>Catalogo</span>
            </Menu.Item>
            <Menu.Item key="fornitori">
              <Icon type="coffee" />
              <span>Fornitori</span>
            </Menu.Item>
            
            </SubMenu>
            <SubMenu key="sub1" title={<span><Icon type="user" /><span>Utente</span></span>}>
	            <Menu.Item key="userMgmt?mode=changePassword">
	              <Icon type="retweet" />
	              <span>Password</span>
	            </Menu.Item>
	            <Menu.Item key="userMgmt?mode=configuration">
	              <Icon type="setting" />
	              <span>Configurazione</span>
	            </Menu.Item>
	            <Menu.Item key="#signout">
	              <Icon type="logout" />
	              <span>Esci</span>
	            </Menu.Item>
	            
	         </SubMenu>   
	          <Menu.Item key="dashboard">
              <Icon type="line-chart" />
              <span>Dashboard</span>
            </Menu.Item>
	          <Menu.Item key="version">
	              <Icon type="info-circle" />
	              <span>Versione</span>
	            </Menu.Item>
          </Menu>
         </div> 
     )}
}


export default withRouter(Sider);
