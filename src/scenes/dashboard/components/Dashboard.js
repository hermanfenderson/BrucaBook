import React, {Component} from 'react'
import {Spin, Row, Col, Button} from 'antd'

import ChartIncassi from './ChartIncassi';

import ChartIncassiMesi from './ChartIncassiMesi';
import ChartIncassiAnni from './ChartIncassiAnni';
import TopBooks from './TopBooks';
import ReactDOM from 'react-dom';



class Dashboard extends Component {
componentDidMount() {
	   	this.props.setHeaderInfo('Dashboard');
    	//Chiedo sempre dati freschi...quando entro qui...
    	this.props.getReportDataAction();
    	if (!this.props.listeningMagazzino) this.props.listenMagazzino(""); //Ascolto da subito il magazzino....
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
<Spin spinning={(this.props.waitingForData)} >		
<div ref='dashboardWidth'>
<Row >
<Col span={12} style={{ height: width/4}}>
<div className='report-title'>Confronto incassi annui</div>

	<ChartIncassiAnni width={width/2} height={width/4 -25} serieIncassiAnni={this.props.serieIncassiAnni} />

</Col>

<Col span={12} style={{ height: width/4}}>
<div className='report-title'>Confronto incassi mesi
 <Button type="primary" shape="circle" icon="retweet" onClick={this.props.getReportDataAction} style={{float:'right'}}/>
</div>

	<ChartIncassiMesi width={width/2} height={width/4 - 25} serieIncassiMesi={this.props.serieIncassiMesi} />
</Col>
</Row>
<Row style={{ height: width/4}}>
<div className='report-title'>Incassi giornalieri</div>

	<ChartIncassi width={width} height={width/4 - 25} serieIncassi={this.props.serieIncassi} />

</Row> 
<Row>
<Col span={12} >

	{(this.props.top5thisYear && this.props.top5thisYear.length > 0) ? <div><div className='report-title'>I libri di quest'anno</div>
 <TopBooks topBooks={this.props.top5thisYear} /> </div>: null}
</Col>

<Col span={12} >
 	{(this.props.top5lastMonth && this.props.top5lastMonth.length > 0) ?  <div><div className='report-title'>I libri del mese scorso</div>
<TopBooks topBooks={this.props.top5lastMonth} /> </div>: null}
</Col>
</Row>
<Row>
<Col span={12} >

	{(this.props.top5lastYear && this.props.top5lastYear.length > 0) ?  <div><div className='report-title'>I libri dello scorso anno</div>
 <TopBooks topBooks={this.props.top5lastYear} /> </div>: null}
</Col>	
</Row>

</div>
</Spin>
          )       

}

}
export default Dashboard;




  



