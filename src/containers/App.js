//Pagina principale dell'applicazione
//Ricarica lo stato in caso di reload (qui punto se un cretino fa refresh della pagina)
//Qui ho l'header e un eventuale menu a tendina laterale
//Gestisco anche la presenza di un utente autenticato...(anche se nel rendering sotto mi devo fidare del mio stato)

import React from 'react';
import { withRouter } from 'react-router-dom'
import { LocaleProvider, Layout,  Affix, Row, Col, Spin } from 'antd';
import itIT from 'antd/lib/locale-provider/it_IT';


//import Header from '../components/Header';
import Main from '../components/Main';
import SiderComponent from '../components/Sider';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux'

import {signOutUser, listenAuthStateChanged, toggleCollapsed, storeMeasure, removeMeasure, setMenuSelectedKeys} from '../actions';
import {isAuthenticated, getUser, getCollapsed, getHeaderInfo, getInfo, getMenuSelectedKeys} from '../reducers';

//Foglio di stile...
import '../styles/app.css';

const { Sider, Content } = Layout;


class App extends React.Component {

  componentWillMount() {
  this.props.listenAuthStateChanged();
  }
  
  

 componentDidMount() {
 	
 	//this.props.storeMeasure('headerHeight', ReactDOM.findDOMNode(this.refs.header).clientHeight);
    this.handleResize(); //La prima volta...
    window.addEventListener('resize', this.handleResize);
    
  }



componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  this.props.removeMeasure('viewPortHeight');
  }

handleResize = () => {
  this.props.storeMeasure('viewPortHeight', window.innerHeight);
}


 
           
           
 

  render() {
  	return (
     <LocaleProvider locale={itIT}>	
      {(this.props.authenticated === null)? 
      <Spin />
      :
      (this.props.authenticated === true) ?
      (<Layout style={{height: '100vh'}}>
        <Sider style={{height: '100vh'}}
          trigger={null}
          collapsible
          collapsed={this.props.collapsed}
        >
        <Affix>
     
           <SiderComponent signOutUser={this.props.signOutUser} authenticated={this.props.authenticated} setMenuSelectedKeys={this.props.setMenuSelectedKeys} menuSelectedKeys={this.props.menuSelectedKeys}/>
          </Affix>
     
      </Sider>
       
       
          <Layout >
           
           <Header setMenuSelectedKeys={this.props.setMenuSelectedKeys} toggleCollapsed={this.props.toggleCollapsed} signOutUser={this.props.signOutUser} info={this.props.info} headerInfo = {this.props.headerInfo} path2url={this.props.path2url} storeMeasure = {this.props.storeMeasure} />
     
           
         
           <Content style={{ margin: '12px 8px', padding: 12, background: '#fff', minHeight: '100vh-74', overflow: 'scroll', maxHeight: '100vh-74'  }}>
          <Main authenticated={true} user={this.props.user}/>
          </Content>
        </Layout>
      </Layout>) 
      :
      (<div>
         
         <Row style={{height:'100vh'}} type="flex" justify="center" align="middle">
        		<Col span={9} /> 
        		<Col span={6}><Row style={{minHeight: 200}}><div className="logoBig" > </div> </Row><Row><Main authenticated={false}/></Row></Col>
        		<Col span={9}/>
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
    collapsed: getCollapsed(state),
    headerInfo: getHeaderInfo(state),
    info: getInfo(state),
    menuSelectedKeys: getMenuSelectedKeys(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({signOutUser, listenAuthStateChanged, toggleCollapsed, storeMeasure, removeMeasure, setMenuSelectedKeys}, dispatch);
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
