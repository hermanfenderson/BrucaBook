import TableBolla from '../containers/TableBolla';
import FormRigaBolla from '../containers/FormRigaBolla';
import TotaliBolla from '../containers/TotaliBolla';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import React, {Component} from 'react'
import { Grid, Image, Container, Modal} from 'semantic-ui-react'




//Da sistemare
const onChange = (e) => {console.log(e.target.name);}


	


class Bolla extends Component {
  componentDidMount()
  {
  	
  }
  
  componentDidUpdate() {
 	
 }	
 
 componentWillUnmount() {
 	this.props.resetBolla(this.props.params.id);
 }
 
render()
{
  return (
     
  <Grid columns={3}>
  <Modal open={this.props.showCatalogModal}>
	<FormCatalogo/>
  </Modal>
    <Grid.Row>
      <Grid.Column width={3}>
        <Image src='/image.png' />
      </Grid.Column>
      <Grid.Column width={10}>
    	 <FormRigaBolla idBolla={this.props.params.id}/>
      </Grid.Column>
      <Grid.Column width={3}>
    	 <TotaliBolla idBolla={this.props.params.id}/>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Container>
         <TableBolla idBolla={this.props.params.id}/>
      </Container>
    </Grid.Row>
   
  </Grid>
 
 
)
}

}
export default Bolla;
