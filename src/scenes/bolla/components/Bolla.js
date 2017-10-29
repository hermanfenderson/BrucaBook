import TableBolla from '../containers/TableBolla';
import FormRigaBolla from '../containers/FormRigaBolla';
import TotaliBolla from '../containers/TotaliBolla';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import React, {Component} from 'react'
import { Grid, Image, Container, Modal} from 'semantic-ui-react'




class Bolla extends Component {
  componentDidMount()
  {
  	
  }
  
  componentDidUpdate() {
 	
 }	
 
 componentWillUnmount() {
 	this.props.resetBolla(this.props.match.params.id);
 }
 
render()
{
  return (
 	
  <Grid>
  
  
    <Modal open={this.props.showCatalogModal}>
		<FormCatalogo readOnlyEAN={true} scene='BOLLA'/>
    </Modal>  
    <Grid.Row>
      <Grid.Column width={3}>
        <Image src='/image.png' />
      </Grid.Column>
      <Grid.Column width={10}>
    	 <FormRigaBolla idBolla={this.props.match.params.id}/>
      </Grid.Column>
      <Grid.Column width={3}>
    	 <TotaliBolla idBolla={this.props.match.params.id}/>
      </Grid.Column>
    </Grid.Row>
     <Grid.Row>
      <Container>
         <TableBolla idBolla={this.props.match.params.id}/>
      </Container>
    </Grid.Row>
   
  </Grid>
 
 
)
}

}
export default Bolla;
