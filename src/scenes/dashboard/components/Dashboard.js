import React, {Component} from 'react'
import {Spin, Row, Col} from 'antd'

import ChartIncassi from './ChartIncassi';

import ChartIncassiMesi from './ChartIncassiMesi';
import ChartIncassiAnni from './ChartIncassiAnni';
import TopBooks from './TopBooks';
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
let width =  (this.props.measures['dashboardWidth']) ? this.props.measures['dashboardWidth']-50 : 100; //Default a caso...
if (isNaN(width) || this.props.serieIncassi.length===0) return (<Spin spinning={(true)} />)
else  
	return (
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
<Row>
<Col span={12} >
	{(this.props.top5thisYear.length > 0) ? <TopBooks topBooks={this.props.top5thisYear} /> : null}
</Col>
<Col span={12} >
	{(this.props.top5lastYear.length > 0) ?  <TopBooks topBooks={this.props.top5lastYear} /> : null}
</Col>	
<Col span={12} >
 	{(this.props.top5lastMonth.length > 0) ?  <TopBooks topBooks={this.props.top5lastMonth} /> : null}
</Col>	
</Row>

</div>
          )       

}

}
export default Dashboard;




  



