import React, {Component} from 'react'
import {Button} from 'antd'
import FixBlock from '../../../components/FixBlock'
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
let width =  (this.props.measures['mainWidth']) ? this.props.measures['mainWidth'] -10 : 100; //Default a caso...
let height =  (this.props.measures['mainHeight']) ? this.props.measures['mainHeight'] : 100; //Default a caso...

if (isNaN(width) || (this.props.serieIncassi && this.props.serieIncassi.length===0)) return (
	<Spinner width={this.props.measures.mainWidth}  height={this.props.measures.mainHeight} />
     )
else  
	return (
<Spinner spinning={(this.props.waitingForData)} width={width}  height={height} >		
<div style={{position: 'relative', width: width+10, height: height, overflowY: 'scroll'}}>
<FixBlock coors={{top: 0, left: 0,  width: width/2, height: width/4}} >
<div className='report-title'>Confronto incassi annui</div>

	<ChartIncassiAnni width={width/2} height={width/4 -25} serieIncassiAnni={this.props.serieIncassiAnni} />

</FixBlock>
<FixBlock coors={{top: 0, left: width/2,  width: width/2, height: width/4}} >

<div className='report-title'>Confronto incassi mesi
 <Button type="primary" shape="circle" icon="retweet" onClick={this.props.getReportDataAction} style={{float:'right'}}/>
</div>

	<ChartIncassiMesi width={width/2} height={width/4 - 25} serieIncassiMesi={this.props.serieIncassiMesi} />
</FixBlock>
<FixBlock coors={{top: width/4, left: 0,  width: width, height: width/4}} >

<div className='report-title'>Incassi giornalieri</div>

	<ChartIncassi width={width} height={width/4 - 25} serieIncassi={this.props.serieIncassi} />

</FixBlock> 
<FixBlock coors={{top: width/2, left: 0,  width: width/3, height: width/4}} >


	{(this.props.top5thisYear && this.props.top5thisYear.length > 0) ? <div><div className='report-title'>I libri di quest'anno</div>
 
 <TopBooks topBooks={this.props.top5thisYear} /> </div>: null}
</FixBlock> 
<FixBlock coors={{top: width/2, left: width/3,  width: width/3, height: width/4}} >

 	{(this.props.top5lastMonth && this.props.top5lastMonth.length > 0) ?  <div><div className='report-title'>I libri del mese scorso</div>

<TopBooks topBooks={this.props.top5lastMonth} /> </div>: null}
</FixBlock> 
<FixBlock coors={{top: width/2, left: width*2/3,  width: width/3, height: width/4}} >

	{(this.props.top5lastYear && this.props.top5lastYear.length > 0) ?  <div><div className='report-title'>I libri dello scorso anno</div>
 <TopBooks topBooks={this.props.top5lastYear} /> </div>: null}
</FixBlock> 

</div>
</Spinner>
          )       

}

}
export default Dashboard;




  



