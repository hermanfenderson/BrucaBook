import React, {Component} from 'react'
import {XAxis, YAxis, Tooltip, Legend, Line, LineChart, CartesianGrid} from 'recharts';

class ChartIncassi extends Component {
render()
	{

return(
<LineChart  width={this.props.width} height={this.props.height} data={this.props.serieIncassi}
            margin={{top: 5, right: 30, left: 20, bottom: 5}} >
       <XAxis padding={{left: 30, right: 30}} dataKey="period"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip />
       <Legend />
       <Line type="linear" dataKey="incasso" stroke={"#8884d8"} activeDot={{r: 8}}/>
</LineChart>
    )
	}
	
}

export default ChartIncassi