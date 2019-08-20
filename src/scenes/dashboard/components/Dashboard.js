import React, {Component} from 'react'
import {Row, Col, Button} from 'antd'

import ChartIncassi from './ChartIncassi';

import ChartIncassiMesi from './ChartIncassiMesi';
import ChartIncassiAnni from './ChartIncassiAnni';
import TopBooks from './TopBooks';
import ReactDOM from 'react-dom';
import Spinner from '../../../components/Spinner'


class Dashboard extends Component {
componentDidMount() {
	   	this.props.setHeaderInfo('Dashboard');
    	//Chiedo sempre dati freschi...quando entro qui...
    	this.props.getReportDataAction();
    	if (!this.props.listeningMagazzino) this.props.listenMagazzino(""); //Ascolto da subito il magazzino....
   
    	
 }
 

//  <Tooltip crosshairs={{type : "y"}}/>
 
render()
{
let width =  (this.props.measures['mainWidth']) ? this.props.measures['mainWidth'] : 100; //Default a caso...
let height =  (this.props.measures['mainHeight']) ? this.props.measures['mainHeight'] : 100; //Default a caso...

if (isNaN(width) || (this.props.serieIncassi && this.props.serieIncassi.length===0)) return (
	<Spinner width={this.props.measures.mainWidth}  height={this.props.measures.mainHeight} />
     )
else  
	return (
<Spinner spinning={(this.props.waitingForData)} width={this.props.measures.mainWidth}  height={this.props.measures.mainHeight} >		
<div style={{position: 'relative', width: width, height: height, overflowY: 'scroll'}}>
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
</Spinner>
          )       

}

}
export default Dashboard;




  



