import React, {Component} from 'react'
import {Spin} from 'antd'
//import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';





class Dashboard extends Component {
componentDidMount() {
    	//this.props.setHeaderInfo('Dashboard');
    	if (!this.props.listeningRegistroData) this.props.getRegistroDataAction();
    	
 }
 /*
 data = [
      {name: '13/3', 2018: 400.30, 2017: 240.50, amt: 2400},
      {name: '14/3', 2018: 300.20,  2017: 440.90, amt: 2210},
      {name: '15/3', 2017: 980.10, 2018: 229.00},
      {name: '16/3', 2018: 278.50, 2017: 390.80, amt: 2000},
      {name: '17/3', 2018: 189.40,  2017: 218.10},
      {name: '18/3', 2018: 239.30, 2017: 380.00, amt: 2500},
      {name: '19/3', 2018: 349.20, 2017: 430.00, amt: 2100},
]; 
  	
 data2 = [
      {name: 'gen', 2018: 400.30, 2017: 240.50, amt: 240.0},
      {name: 'febbraio', 2018: 300.20,  2017: 440.90, amt: 221.0},
      {name: 'marzo', 2017: 980.10, 2018: 229.00},
      {name: 'aprile', 2018: 278.50, 2017: 390.80, amt: 200.0},
      {name: 'maggio', 2018: 189.40,  2017: 218.10},
      {name: 'giugno', 2018: 239.30, 2017: 380.00, amt: 250.0},
      {name: 'luglio', 2018: 349.20, 2017: 430.00, amt: 210.0},
        {name: 'agosto', 2018: 100.30, 2017: 240.50, amt: 240.0},
      {name: 'settembre', 2018: 200.20,  2017: 440.90, amt: 221.0},
      {name: 'ottobre', 2018: 600.30, 2017: 240.50, amt: 240.0},
      {name: 'novembre', 2018: 300.20,  2017: 440.90, amt: 221.0},
      {name: 'dicembre', 2018: 200.30, 2017: 240.50, amt: 240.0},
    
    
];  
*/
/*
<BarChart width={730} height={250} data={this.data2}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip content={<CustomTooltip/>}/>
  <Legend />
  <Bar dataKey="2018" name="2018" fill="#8884d8" />
  <Bar dataKey="2017" name="2017" stackId="2017" fill="#82ca9d" />
  <Bar dataKey="amt" name="2017" stackId="2017" fill="#bbca9d" />
  
</BarChart>


      <LineChart width={600} height={400}  data={this.props.serieIncassi} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
  <Line type="linear" dataKey="incasso" stroke="#8884d8" />
  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
  <XAxis dataKey="period"/>
  <YAxis />
  <Tooltip />
      
</LineChart>

*/
render()
{
	 const cols = {
          'value': { min: 0 },
          'period': {range: [ 0 , 1] }
        };
        
   return (
  <Spin spinning={(this.props.serieIncassi.length===0)} >	
 <div>	
<Chart height={400} data={this.props.serieIncassi} scale={cols} forceFit>
            <Axis name="period" />
            <Axis name="incasso" />
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type="line" position="period*incasso" size={2} />
            <Geom type='point' position="period*incasso" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
          </Chart>

  </div>
  </Spin>
 
 
)
}

}
export default Dashboard;




  



