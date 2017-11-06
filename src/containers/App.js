//Pagina principale dell'applicazione
//Ricarica lo stato in caso di reload (qui punto se un cretino fa refresh della pagina)
//Qui ho l'header e un eventuale menu a tendina laterale
//Gestisco anche la presenza di un utente autenticato...(anche se nel rendering sotto mi devo fidare del mio stato)

import React from 'react';
import { withRouter } from 'react-router-dom'
import { LocaleProvider, Layout, Icon, Affix, Row, Col } from 'antd';
import itIT from 'antd/lib/locale-provider/it_IT';


//import Header from '../components/Header';
import Main from '../components/Main';
import SiderComponent from '../components/Sider';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux'

import {signOutUser, listenAuthStateChanged, toggleCollapsed} from '../actions';
import {isAuthenticated, getUser, getCollapsed} from '../reducers';

//Foglio di stile...
import '../styles/app.css';

const { Header, Sider, Content } = Layout;


class App extends React.Component {

  componentWillMount() {
  this.props.listenAuthStateChanged();
  }
  
  

handleResize = () => {
 }

 componentDidMount() {
    }

componentWillUnmount() {
 
  //QUI MANCA LA CHIUSURA DEL LISTENER DELL'AUTENTICAZIONE
	
}

  toggle = () => {
    this.props.toggleCollapsed();
  }

           
           
 
  render() {
    return (
     <LocaleProvider locale={itIT}>	
      {this.props.authenticated ? 
      (<Layout>
      
        <Sider style={{height: '100vh'}}
          trigger={null}
          collapsible
          collapsed={this.props.collapsed}
        >
        <Affix>
     
          <div className="logo"/>
          <SiderComponent signOutUser={this.props.signOutUser} authenticated={this.props.authenticated}/>
          </Affix>
     
      </Sider>
       
       
          <Layout >
        
          <Header style={{   background: '#fff', padding: 0, width: '100%' }}>
           <Affix>
           <Row  style={{backgroundColor: 'white'}}>
            <Icon
              className="trigger"
              type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            </Row>
            </Affix>
          </Header>
       
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: '100vh-48' }}>
          <Main authenticated={true}/>
          </Content>
        </Layout>
      </Layout>) 
      :
      (<div>
         
         <Row style={{height:'100vh'}} type="flex" justify="center" align="middle">
        		<Col span={9} />
        		<Col span={6}><Main authenticated={false}/></Col>
        		<Col span={9} />
         </Row>
        
         
      </div>
      )
      }
      </LocaleProvider> 
    );
  }
}


        
function mapStateToProps(state) {
  return {
    authenticated: isAuthenticated(state),
    user: getUser(state),
    collapsed: getCollapsed(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({signOutUser, listenAuthStateChanged, toggleCollapsed }, dispatch);
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
