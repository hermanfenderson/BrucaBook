import React from 'react';
import {message} from 'antd';
//Riceve due props
//L'array dei messaggi in se
//Un metodo per togliere la testa dell'array

class MessageQueue extends React.Component {
	componentDidUpdate()
	{
		if (this.props.messageBuffer.length > 0)
			{   
				message.info(this.props.messageBuffer[0]);
			    this.props.shiftMessage();
			}
	}
	
	render()
	{
		return null
	}
}

export default MessageQueue;

