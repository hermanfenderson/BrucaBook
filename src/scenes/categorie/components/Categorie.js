import TableCategorie from '../containers/TableCategorie';
import FormCategoria from '../containers/FormCategoria';
import React, {Component} from 'react'
import ReactDOM from 'react-dom';


import { Row, Col} from 'antd'


class Categorie extends Component {
componentDidMount() {
    	if (ReactDOM.findDOMNode(this.refs.formCategoria)) this.props.storeMeasure('formCategoriaHeight', ReactDOM.findDOMNode(this.refs.formCategoria).clientHeight);
    	this.props.setHeaderInfo('Anagrafica - Categorie');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 



render()
{


return (
 <div>	
  <Row>
  
      <Col style={{'marginTop': '30px'}} span={4}>
      </Col>
      <Col span={20}>
      <TableCategorie/>
   
   	 	 </Col>
    </Row>
    <Row type="flex" align="bottom" className='bottom-form' ref='formCategoria' style={{height: '100px'}}>
    <Col span={4} />
     
      <Col span={20}>
     
     <FormCategoria  />
     </Col>
          </Row>
   
  </div>
 
 
)

}
}

export default Categorie;
