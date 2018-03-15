import React, {Component} from 'react'
import WrappedForm from '../../../components/WrappedForm'

class FormCalcoloResto extends Component {

constructor(props) {
 super(props);
    this.state = {formValues: {contanti: '', resto: ''}};
  }
  
  
componentWillUpdate = () =>
{
	let totale = this.props.testataScontrino ? this.props.testataScontrino.totali.prezzoTotale : 0;
	let formValues = {...this.state.formValues};

	if (totale === 0 && (formValues.contanti > 0 || formValues.resto))
		{
		this.setState({formValues: {contanti: '', resto: ''}});
	
		}
	
}

onChange = (name, value) => {
	//   	this.props.changeEditedCassa(name, value)
	let formValues = {...this.state.formValues};
	formValues[name] = value;
	let totale = this.props.testataScontrino ? this.props.testataScontrino.totali.prezzoTotale : 0;
	if (totale > 0) 
	{
		if (formValues.contanti - totale > 0) formValues.resto = (formValues.contanti - totale).toFixed(2);
		else formValues.resto = '';
		this.setState({formValues: formValues});
			
		}
	
}
		

 



  

  render() {
 let enableContanti = (this.props.testataScontrino && (this.props.testataScontrino.totali.prezzoTotale >0));
 	
  			  
  	return (
  		<WrappedForm formValues={this.state.formValues} errorMessages={{}} loading={false} onChange={this.onChange} >
        <WrappedForm.Group formGroupLayout={{gutter:0}}>
        <WrappedForm.Input  formColumnLayout={{span:12}} itemStyle={{marginRight: 10}} disabled={!enableContanti} label='Contanti' field='contanti'  />
        <WrappedForm.Input  formColumnLayout={{span:12}} itemStyle={{marginRight: 10}} disabled={true} label='Resto' field='resto'  />
        </WrappedForm.Group>
       </WrappedForm>
    )
  }
}
export default FormCalcoloResto;