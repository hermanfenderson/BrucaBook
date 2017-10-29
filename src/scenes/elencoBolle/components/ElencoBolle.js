import TableElencoBolle from '../containers/TableElencoBolle';
import FormBolla from '../containers/FormBolla';
import React, {Component} from 'react'
import { Grid, Container} from 'semantic-ui-react'




class ElencoBolle extends Component {
  	
 componentWillUnmount() {
 	this.props.resetElencoBolle();
 }
 
render()
{
  return (
 	
  <Grid>
  
  
  <Grid.Row>
  <Container>
    	 <FormBolla/>
  </Container>  	 
    </Grid.Row>
     <Grid.Row>
      <Container>
         <TableElencoBolle/>
      </Container>
    </Grid.Row>
   
  </Grid>
 
 
)
}

}
export default ElencoBolle;
