import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormCalcoloResto extends Component {
//E' la classe madre che disambigua i diversi campi... checkbox da input normali...

onChange = (name, value) => {
	//   	this.props.changeEditedCassa(name, value)
	
}
		

 





  render() {
  	const formValues = {};
  	
  	    
  	return (
  		<WrappedForm formValues={formValues} errorMessages={{}} loading={false}>
        <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.Input  formColumnLayout={{span:12}} itemStyle={{marginRight: 10}} label='Contanti' field='contanti'  />
        <WrappedForm.Input  formColumnLayout={{span:12}} itemStyle={{marginRight: 10}} label='Resto' field='resto'  />
        </WrappedForm.Group>
       </WrappedForm>
    )
  }
}
export default FormCalcoloResto;