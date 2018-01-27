//Componente Input.. autovalidante. Esegue una onSubmit su ritorno carrello o su cambio campo...
import React from 'react';
import {Input} from 'antd';

const SubInput = (props) => 
		    {
		     const {onSubmit, ...otherProps} = props;
	   	     const onBlur = () => {onSubmit()};
	   	     var record = props.record;
			 const onKeyPress = (e) => {
    			if (e.key === 'Enter') {
    				onSubmit(record);
    				}
				}
			return(<Input onBlur={onBlur} onKeyPress={onKeyPress} {...otherProps} />)
		    }

export default SubInput;

