import React from 'react';
import { Card } from 'antd';
const { Meta } = Card;

const BookImg = (props) =>
{
	return(
  <Card className='book-img'
    hoverable
    cover={<img alt="notAvailable" src="/image.png" />}
  >
   <Meta
      description={props.eanState}
    />
  </Card>
		)
}

export default BookImg
