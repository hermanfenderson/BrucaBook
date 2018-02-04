//Componente Input.. autovalidante. Esegue una onSubmit su ritorno carrello o su cambio campo...
import React from 'react';
import {Input, Tooltip} from 'antd';

const SubInput = (props) => 
		    {
		     const {onSubmit, onChange, errorMessage, ...otherProps} = props;
	   	     //const onBlur = () => {onSubmit()};
	   	     const onChangeInput = (e) => {onChange(e.target.value)}
	   	     const onKeyPress = (e) => {
    			if (e.key === 'Enter') {
    				onSubmit();
    				}
				}
			return(<div className={props.errorMessage ? 'has-error' : ''}> <Tooltip title={props.errorMessage} > <Input onChange={onChangeInput}  onKeyPress={onKeyPress} {...otherProps} /> </Tooltip></div>)
		    }

export default SubInput;

