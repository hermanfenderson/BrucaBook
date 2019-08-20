import TableElencoInventari from '../containers/TableElencoInventari';
import FormInventario from '../containers/FormInventario';
import React, {Component} from 'react'


import FixBlock from '../../../components/FixBlock'


class ElencoInventari extends Component {
componentDidMount() {
    	this.props.setHeaderInfo('Inventario');
    	
 }
 
  	



render()
{

////Era...       <Col style={{'marginTop': '100px'}} span={4}>
	
return (
 <div>
  <FixBlock coors={this.props.geometry.emptyCoors} />
     
   <FixBlock coors={this.props.geometry.tableCoors}>
    
      <TableElencoInventari geometry={this.props.geometry}/>
   
   	</FixBlock>
    
   <FixBlock coors={this.props.geometry.formCoors} className='bottom-form2' >
   
     <FormInventario geometry={this.props.geometry} />
   </FixBlock>
  
   
  </div>
 
 
)

}
}

export default ElencoInventari;
