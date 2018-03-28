import React, {Component} from 'react'
import {Spin, Row, Col} from 'antd'

import ChartIncassi from './ChartIncassi';

import ChartIncassiMesi from './ChartIncassiMesi';
import ChartIncassiAnni from './ChartIncassiAnni';
import ReactDOM from 'react-dom';



class Dashboard extends Component {
componentDidMount() {
    	this.props.setHeaderInfo('Dashboard');
    	if (!this.props.listeningRegistroData) this.props.getRegistroDataAction();
   	if(ReactDOM.findDOMNode(this.refs.dashboardWidth)) 
   		{var node = ReactDOM.findDOMNode(this.refs.dashboardWidth);
   		this.props.storeMeasure('dashboardWidth', node.clientWidth);
   		}
    	
 }
 
componentDidUpdate() {
	if(ReactDOM.findDOMNode(this.refs.dashboardWidth)) 
   		{var node = ReactDOM.findDOMNode(this.refs.dashboardWidth);
   		if (this.props.measures['dashboardWidth'] !==node.clientWidth) this.props.storeMeasure('dashboardWidth', node.clientWidth);
   		}
} 

//  <Tooltip crosshairs={{type : "y"}}/>
 
render()
{
let width = this.props.measures['dashboardWidth']-50;
   return (
<Spin spinning={(this.props.serieIncassi.length===0)} >	  
{(this.props.serieIncassi.length===0) ? null:
<div ref='dashboardWidth'>
<Row >
<Col span={12} style={{ height: width/4}}>
	<ChartIncassiAnni width={width/2} height={width/4} serieIncassiAnni={this.props.serieIncassiAnni} />

</Col>
<Col span={12} style={{ height: width/4}}>
	<ChartIncassiMesi width={width/2} height={width/4} serieIncassiMesi={this.props.serieIncassiMesi} />
</Col>
</Row>
<Row style={{ height: width/4}}>
	<ChartIncassi width={width} height={width/4} serieIncassi={this.props.serieIncassi} />

</Row> 

</div>
          }
</Spin>          

 
 
)
}

}
export default Dashboard;




  



