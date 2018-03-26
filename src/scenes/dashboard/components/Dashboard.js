import React, {Component} from 'react'
import {Spin, Row} from 'antd'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart} from 'recharts';





class Dashboard extends Component {
componentDidMount() {
    	//this.props.setHeaderInfo('Dashboard');
    	if (!this.props.listeningRegistroData) this.props.getRegistroDataAction();
    	
 }

//  <Tooltip crosshairs={{type : "y"}}/>
 
render()
{
	console.log(this.props.serieIncassiMesi);
	
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
       <Tooltip/>
       <Legend />
       <Line type="linear" dataKey="incasso" stroke="#8884d8" activeDot={{r: 8}}/>
      </LineChart>
</Row>
<Row>
<BarChart width={600} height={300} data={this.props.serieIncassiMesi}
            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="mese"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Bar dataKey="2017ytd" stackId="a" fill="#8884d8" />
       <Bar dataKey="2017dty" stackId="a" fill="#82ca9d" />
       <Bar dataKey="2018ytd" stackId="b" fill="#ffc658"/>
        <Bar dataKey="2018dty" stackId="b" fill="#bbc658"/>
      </BarChart>
</Row>          
</div>
          }
</Spin>          

 
 
)
}

}
export default Dashboard;




  



