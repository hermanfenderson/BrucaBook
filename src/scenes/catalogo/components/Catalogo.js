import React from 'react';
import {Row,Col} from 'antd';
import FormCatalogo from '../containers/FormCatalogo';

const Catalogo = (props) => 
{ return (
	<Row>
		<Col offset={6} span={12}>
		<FormCatalogo />
		</Col>
	</Row>
	 )
}

export default Catalogo;
