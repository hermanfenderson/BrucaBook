import React from 'react';
import {Row,Col} from 'antd';
import FormCatalogo from '../containers/FormCatalogo';

 

class Catalogo extends React.Component 
{
componentDidMount = () => {
	this.props.setHeaderInfo("Anagrafica - Catalogo");
}


render()
{ return (
	<Row>
		<Col offset={6} span={12}>
		<FormCatalogo ean={this.props.match.params.ean} scene='CATALOGO'/>
		</Col>
	</Row>
	 )
}

}
export default Catalogo;
