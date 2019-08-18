//Pagina principale dell'applicazione
//Ricarica lo stato in caso di reload (qui punto se un cretino fa refresh della pagina)
//Qui ho l'header e un eventuale menu a tendina laterale
//Gestisco anche la presenza di un utente autenticato...(anche se nel rendering sotto mi devo fidare del mio stato)

import React from 'react';
import { withRouter } from 'react-router-dom'
import { LocaleProvider, Layout,  Affix, Row, Col, Spin } from 'antd';
import itIT from 'antd/lib/locale-provider/it_IT';
//import Measure from 'react-measure';

//import Header from '../components/Header';
import Main from '../components/Main';
import SiderComponent from '../components/Sider';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux'

import {signOutUser, listenAuthStateChanged, toggleCollapsed, storeMeasure, removeMeasure, setMenuSelectedKeys} from '../actions';
import {isAuthenticated, getUser, getCollapsed, getHeaderInfo, getInfo, getMenuSelectedKeys, getMeasures} from '../reducers';

//Foglio di stile...
import '../styles/app.css';


const { Sider, Content } = Layout;

function viewportSize(){
	
	/*var test = document.createElement( "div" );

	test.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0;";
	document.documentElement.insertBefore( test, document.documentElement.firstChild );
	
	var dims = { width: test.offsetWidth, height: test.offsetHeight };
	document.documentElement.removeChild( test );
	*/
	var dims = {width: window.innerWidth, height: window.innerHeight};
	return dims;
}
 
class App extends React.Component {

  componentWillMount() {
  this.props.listenAuthStateChanged();
  }
  
  

 componentDidMount() {
 	
 	//this.props.storeMeasure('headerHeight', ReactDOM.findDOMNode(this.refs.header).clientHeight);
    this.handleResize(); //La prima volta...
    window.addEventListener('resize', this.handleResize,false);
    
  }


componentWillUnmount() {
	
	window.removeEventListener('resize', this.handleResize,false);
}



handleResize = () => {
  let dims = viewportSize(); 
  this.props.storeMeasure('viewPortHeight', dims.height);
  this.props.storeMeasure('viewPortWidth', dims.width);
  this.props.storeMeasure('mainWidth', dims.width - this.props.measures.siderWidth);
  this.props.storeMeasure('mainHeight', dims.height - this.props.measures.headerHeight);
  
}
           
           
 

  render() {
  	return (
  	  <LocaleProvider  locale={itIT}>	
      {(this.props.authenticated === null)? 
      <Spin style={{width: '100vw', height: '100vh'}}>
      <div style={{width: '100vw', height: '100vh'}} />
      </Spin>
      :
      (this.props.authenticated === true) ?
      (
      
      <Layout style={{height: '100vh'}}>
        <Sider style={{height: '100vh'}}
          trigger={null}
          collapsible
          collapsed={this.props.collapsed}
        >
        <Affix>
     
           <SiderComponent  signOutUser={this.props.signOutUser} authenticated={this.props.authenticated} setMenuSelectedKeys={this.props.setMenuSelectedKeys} menuSelectedKeys={this.props.menuSelectedKeys}/>
          </Affix>
     
      </Sider>
       
       
          <Layout >
           
           <Header setMenuSelectedKeys={this.props.setMenuSelectedKeys} toggleCollapsed={this.props.toggleCollapsed} signOutUser={this.props.signOutUser} info={this.props.info} headerInfo = {this.props.headerInfo} path2url={this.props.path2url} storeMeasure = {this.props.storeMeasure} viewPortWidth={this.props.measures.viewPortWidth} collapsed={this.props.collapsed}/>
          
           
           
           <Content style={{ position: 'fixed', left: this.props.measures.siderWidth, top: this.props.measures.headerHeight, width: window.innerWidth-this.props.measures.siderWidth, height: window.innerHeight-this.props.measures.headerHeight, minWidth: window.innerWidth-this.props.measures.siderWidth, minHeight: window.innerHeight-this.props.measures.headerHeight,  margin: '0px 0px', background: '#fff', overflow: 'hidden'  }}>
        
          <Main  authenticated={true} user={this.props.user}/>
	      
     
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
    measures: getMeasures(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({signOutUser, listenAuthStateChanged, toggleCollapsed, storeMeasure, removeMeasure, setMenuSelectedKeys}, dispatch);
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
