//Componente Input.. autovalidante. Esegue una onSubmit su ritorno carrello o su cambio campo...
import React from 'react';
import {Input} from 'antd';

const SubInput = (props) => 
		    {
		     const {onSubmit, onChange, ...otherProps} = props;
	   	     //const onBlur = () => {onSubmit()};
	   	     const onChangeInput = (e) => {onChange(e.target.value)}
	   	     const onKeyPress = (e) => {
    			if (e.key === 'Enter') {
    				onSubmit();
    				}
				}
			return(<Input onChange={onChangeInput}  onKeyPress={onKeyPress} {...otherProps} />)
		    }

export default SubInput;

