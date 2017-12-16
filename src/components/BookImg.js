import React from 'react';
import { Card } from 'antd';
const { Meta } = Card;

const BookImg = (props) =>
{
	return(
  <Card
    hoverable
    cover={<img alt="notAvailable" src="/image.png" />}
  >
   <Meta
      title={props.ean}
      description={props.eanState}
    />
  </Card>
		)
}

export default BookImg
