import React, {Component} from 'react'
import {Spin} from 'antd'
import { Chart, Geom, Axis, Label } from 'bizcharts';





class Dashboard extends Component {
componentDidMount() {
    	//this.props.setHeaderInfo('Dashboard');
    	if (!this.props.listeningRegistroData) this.props.getRegistroDataAction();
    	
 }

//  <Tooltip crosshairs={{type : "y"}}/>
 
render()
{
	 const cols = {
          'incasso': { type:"linear",
    min:0,
    },
         
        };
        
   return (
<Spin spinning={(this.props.serieIncassi.length===0)} >	  
{(this.props.serieIncassi.length===0) ? null:
 <Chart height={400} width={600} forceFit={true} data={this.props.serieIncassi} scale={cols}   >
            <Axis name="period" />
            <Axis name="incasso" />
            <Geom type="line" position="period*incasso" size={2} />
            <Geom type='point' position="period*incasso" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}}>
                 <Label content="incasso" />
          
            </Geom>
          </Chart> }
</Spin>          

 
 
)
}

}
export default Dashboard;




  



