import React, {Component} from 'react'
import {XAxis, YAxis, Tooltip, Legend, Line, LineChart, CartesianGrid, ResponsiveContainer} from 'recharts';
import {colors} from '../colors'
class ChartIncassi extends Component {
render()
	{

return(
<ResponsiveContainer width={this.props.width} height={this.props.height} >	
	
<LineChart  width={this.props.width} height={this.props.height} data={this.props.serieIncassi}
            margin={{top: 5, right: 30, left: 20, bottom: 5}} >
       <XAxis padding={{left: 30, right: 30}} dataKey="period"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip />
       <Legend />
       <Line type="linear" dataKey="incasso" stroke={colors[0][0]} activeDot={{r: 8}}/>
</LineChart>
</ResponsiveContainer>
    )
	}
	
}

export default ChartIncassi