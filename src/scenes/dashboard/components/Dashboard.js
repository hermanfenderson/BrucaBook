import React, {Component} from 'react'
import {Spin, Row} from 'antd'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

import ChartIncassiMesi from './ChartIncassiMesi';



class Dashboard extends Component {
componentDidMount() {
    	this.props.setHeaderInfo('Dashboard');
    	if (!this.props.listeningRegistroData) this.props.getRegistroDataAction();
    	
 }

//  <Tooltip crosshairs={{type : "y"}}/>
 
render()
{

   return (
<Spin spinning={(this.props.serieIncassi.length===0)} >	  
{(this.props.serieIncassi.length===0) ? null:
<div>
<Row>
<LineChart  width={600} height={300} data={this.props.serieIncassi}
            margin={{top: 5, right: 30, left: 20, bottom: 5}} >
       <XAxis padding={{left: 30, right: 30}} dataKey="period"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip />
       <Legend />
       <Line type="linear" dataKey="incasso" stroke={"#8884d8"} activeDot={{r: 8}}/>
      </LineChart>
</Row>
<Row>
<ChartIncassiMesi serieIncassiMesi={this.props.serieIncassiMesi} />
</Row>          
</div>
          }
</Spin>          

 
 
)
}

}
export default Dashboard;




  



